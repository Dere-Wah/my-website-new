import { NextRequest, NextResponse } from "next/server";
import { getProjectBySlug } from "@/lib/mdx";
import { promises as fs } from "fs";
import path from "path";

// Simple markdown to HTML converter for basic formatting
function markdownToHtml(markdown: string): string {
  return (
    markdown
      // Convert **bold** to <strong>
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      // Convert *italic* to <em>
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Convert _italic_ to <em>
      .replace(/_(.*?)_/g, "<em>$1</em>")
      // Convert `code` to <code>
      .replace(/`(.*?)`/g, "<code>$1</code>")
      // Convert line breaks to <br>
      .replace(/\n/g, "<br />")
  );
}

// Extract first N paragraphs from markdown content
function extractFirstParagraphs(content: string, count: number = 3): string {
  // Remove frontmatter and imports
  const cleanContent = content
    .replace(/^---[\s\S]*?---/, "") // Remove frontmatter
    .replace(/^import.*$/gm, "") // Remove import statements
    .trim();

  // Split by double newlines (paragraph breaks)
  const paragraphs = cleanContent
    .split(/\n\s*\n/)
    .filter((p) => p.trim().length > 0)
    .filter((p) => !p.startsWith("#")) // Remove headers
    .filter((p) => !p.startsWith("<")) // Remove JSX components
    .filter((p) => !p.startsWith("![")) // Remove images
    .slice(0, count);

  return paragraphs.join("\n\n");
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

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

    // Generate tags HTML
    const tagsHtml = project.frontmatter.tags
      ? project.frontmatter.tags
          .map((tag: string) => `<span class="tag">${tag}</span>`)
          .join("")
      : "";

    // Extract and convert first 2 paragraphs to HTML
    const firstParagraphs = extractFirstParagraphs(project.content, 2);
    const blogPreviewHtml = markdownToHtml(firstParagraphs);

    // Replace all placeholders in the template
    const replacements = {
      "{{BLOG_TITLE}}": project.frontmatter.title,
      "{{BLOG_DESCRIPTION}}": project.frontmatter.description,
      "{{BLOG_THUMBNAIL}}": thumbnailUrl,
      "{{BLOG_URL}}": blogUrl,
      "{{BLOG_TAGS}}": tagsHtml,
      "{{BLOG_PREVIEW}}": blogPreviewHtml,
      "{{WEBSITE_URL}}": websiteUrl,
      "{{GITHUB_URL}}": "https://github.com/dere-wah",
      "{{TWITTER_URL}}": "https://twitter.com/derewah",
      "{{LINKEDIN_URL}}":
        "https://www.linkedin.com/in/davide-locatelli-91a360304/",
      "{{UNSUBSCRIBE_URL}}": `${websiteUrl}/unsubscribe`, // You'll need to implement this
    };

    // Apply all replacements
    Object.entries(replacements).forEach(([placeholder, value]) => {
      template = template.replace(new RegExp(placeholder, "g"), value);
    });

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
