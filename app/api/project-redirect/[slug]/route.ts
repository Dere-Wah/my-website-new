import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import path from "path";
import fs from "fs/promises";
import matter from "gray-matter";
import { getProjects } from "@/lib/mdx";

export const dynamic = "force-dynamic"; // disable caching
export const revalidate = 0;

const DISCORD_WEBHOOK_URL = process.env.NOTIFY_WEBHOOK || "";

// Send notification to Discord
async function sendDiscordNotification(
  projectTitle: string,
  projectHref: string
) {
  try {
    const timestamp = new Date().toISOString();

    const payload = {
      embeds: [
        {
          title: "Blog Visit Notification",
          description: "Someone just visited one of your blog posts!",
          color: 3447003,
          fields: [
            { name: "Blog Post", value: projectTitle, inline: true },
            { name: "URL Path", value: projectHref, inline: true },
          ],
          footer: { text: "GitHub Profile Redirect" },
          timestamp,
        },
      ],
    };

    const res = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("Failed to send Discord notification:", await res.text());
    }
  } catch (error) {
    console.error("Error sending Discord notification:", error);
  }
}

// GET handler
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
  res: NextResponse
) {
  try {
    const { slug } = await params;
    console.log(slug);
    const index = parseInt(slug, 10);

    if (isNaN(index)) {
      return new Response(
        JSON.stringify({ error: 400, message: "Invalid index" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log(index);

    let projects = await getProjects();

    projects.sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );

    if (index < 0 || index >= projects.length) {
      return new Response(
        JSON.stringify({ error: 404, message: "Project not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const project = projects[index];

    await sendDiscordNotification(
      project.frontmatter.title,
      project.frontmatter.href
    ).catch(console.error);

    console.log(project.frontmatter);
    // Note: must redirect from client-side — `redirect()` only works in Server Components.
    return new Response(null, {
      status: 307,
      headers: {
        Location: project.frontmatter.href,
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 500, message: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
