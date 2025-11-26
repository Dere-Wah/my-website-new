import { NextRequest, NextResponse } from "next/server";
import { getProjectBySlug } from "@/lib/mdx";
import {
  generateNewsletterContent,
  applyTemplateReplacements,
} from "@/lib/templating";
import { promises as fs } from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const { searchParams } = new URL(request.url);
    const unsubscribeId = searchParams.get("id");

    // Get the blog post data
    const project = await getProjectBySlug(slug);

    if (!project) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Check if the post is published
    if (project.frontmatter.published === false) {
      return NextResponse.json(
        { error: "Blog post not published" },
        { status: 404 }
      );
    }

    // Read the newsletter template
    const templatePath = path.join(process.cwd(), "newsletter-template.html");
    let template = await fs.readFile(templatePath, "utf8");

    // Prepare the data for template replacement
    const websiteUrl = "https://derewah.dev";
    const blogUrl = `${websiteUrl}/projects/${slug}`;
    const thumbnailUrl = project.frontmatter.thumbnail
      ? `${project.frontmatter.thumbnail}`
      : `${websiteUrl}/og-image.png`; // fallback to default OG image

    // Generate newsletter content using the templating library
    const { replacements } = generateNewsletterContent(
      project.frontmatter.title,
      project.frontmatter.description,
      project.content,
      project.frontmatter.tags,
      thumbnailUrl,
      blogUrl,
      websiteUrl,
      unsubscribeId || undefined
    );

    // Apply all replacements to the template
    template = applyTemplateReplacements(template, replacements);

    // Return the HTML with proper content type
    return new NextResponse(template, {
      status: 200,
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Newsletter generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
