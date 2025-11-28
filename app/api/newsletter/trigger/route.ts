import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getProjectBySlug } from "@/lib/mdx";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // 1. Get the latest project from the recent-projects endpoint
    const recentProjectResponse = await fetch(
      `${
        process.env.NEXT_PUBLIC_SITE_URL || "https://derewah.dev"
      }/api/recent-projects`
    );

    if (!recentProjectResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch latest project" },
        {
          status: 500,
        }
      );
    }

    const { name: latestProjectName } = await recentProjectResponse.json();

    // 2. Get a random user where last_sent doesn't match the latest project
    const { data: eligibleUsers, error: fetchError } = await supabase
      .from("emails")
      .select("*")
      .is("unsubscribed_at", null) // Only active subscribers
      .or(`last_sent.is.null,last_sent.neq."${latestProjectName}"`);

    if (fetchError) {
      console.error("Database fetch error:", fetchError);
      return NextResponse.json(
        { error: "Database error" },
        {
          status: 500,
        }
      );
    }

    if (!eligibleUsers || eligibleUsers.length === 0) {
      return NextResponse.json(
        { message: "Completed." },
        {
          status: 200,
        }
      );
    }

    // Select a random user from eligible users
    const randomUser =
      eligibleUsers[Math.floor(Math.random() * eligibleUsers.length)];

    // 3. Get the project details for the email subject
    const project = await getProjectBySlug(latestProjectName);
    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        {
          status: 404,
        }
      );
    }

    // 4. Get the HTML content from the newsletter endpoint
    const newsletterResponse = await fetch(
      `${
        process.env.NEXT_PUBLIC_SITE_URL || "https://derewah.dev"
      }/api/newsletter/${latestProjectName}?id=${randomUser.id}`
    );

    if (!newsletterResponse.ok) {
      return NextResponse.json(
        { error: "Failed to generate HTML." },
        {
          status: 500,
        }
      );
    }

    const newsletterHtml = await newsletterResponse.text();

    // 5. Send email using Resend
    const emailResult = await resend.emails.send({
      from: "projects@news.derewah.dev",
      to: randomUser.email,
      subject: project.frontmatter.title,
      html: newsletterHtml,
    });

    if (emailResult.error) {
      console.error("Resend error:", emailResult.error);
      return NextResponse.json(
        { error: "Failed." },
        {
          status: 500,
        }
      );
    }

    // 6. Update the user's last_sent column
    const { error: updateError } = await supabase
      .from("emails")
      .update({ last_sent: latestProjectName })
      .eq("id", randomUser.id);

    if (updateError) {
      console.error("Database update error:", updateError);
      // Email was sent but we couldn't update the database
      // This is not critical, so we'll log it but still return success
    }

    return NextResponse.json(
      {
        message: "Completed.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Newsletter trigger error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      {
        status: 500,
      }
    );
  }
}
