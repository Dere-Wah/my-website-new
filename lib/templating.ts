// Simple markdown to HTML converter for basic formatting
export function markdownToHtml(markdown: string): string {
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
export function extractFirstParagraphs(
  content: string,
  count: number = 3
): string {
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

// Generate newsletter content from blog post data
export function generateNewsletterContent(
  title: string,
  description: string,
  content: string,
  tags?: string[],
  thumbnailUrl?: string,
  blogUrl?: string,
  websiteUrl: string = "https://derewah.dev",
  unsubscribeId?: string
): {
  blogPreviewHtml: string;
  tagsHtml: string;
  replacements: Record<string, string>;
} {
  // Extract and convert first paragraphs to HTML
  const firstParagraphs = extractFirstParagraphs(content, 2);
  const blogPreviewHtml = markdownToHtml(firstParagraphs);

  // Generate tags HTML with inline styles (mobile-optimized)
  const tagsHtml = tags
    ? tags
        .map(
          (tag: string) =>
            `<span style="display: inline-block; background-color: #f1f5f9; color: #475569; padding: 4px 12px; border-radius: 20px; -webkit-border-radius: 20px; -moz-border-radius: 20px; font-size: 12px; font-weight: 500; margin-right: 8px; margin-bottom: 4px; line-height: 1.2; -webkit-font-smoothing: antialiased;">${tag}</span>`
        )
        .join("")
    : "";

  // Prepare all template replacements
  const replacements = {
    "{{BLOG_TITLE}}": title,
    "{{BLOG_DESCRIPTION}}": description,
    "{{BLOG_THUMBNAIL}}": thumbnailUrl || `${websiteUrl}/og-image.png`,
    "{{BLOG_URL}}": blogUrl || websiteUrl,
    "{{BLOG_TAGS}}": tagsHtml,
    "{{BLOG_PREVIEW}}": blogPreviewHtml,
    "{{WEBSITE_URL}}": websiteUrl,
    "{{GITHUB_URL}}": "https://github.com/dere-wah",
    "{{TWITTER_URL}}": "https://twitter.com/derewah",
    "{{LINKEDIN_URL}}":
      "https://www.linkedin.com/in/davide-locatelli-91a360304/",
    "{{UNSUBSCRIBE_URL}}": unsubscribeId
      ? `${websiteUrl}/api/newsletter?unsubscribe=${unsubscribeId}`
      : `${websiteUrl}/unsubscribe`,
  };

  return {
    blogPreviewHtml,
    tagsHtml,
    replacements,
  };
}

// Apply template replacements to HTML template
export function applyTemplateReplacements(
  template: string,
  replacements: Record<string, string>
): string {
  let result = template;

  Object.entries(replacements).forEach(([placeholder, value]) => {
    result = result.replace(new RegExp(placeholder, "g"), value);
  });

  return result;
}
