import { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import path from "path";
import fs from "fs/promises";
import matter from "gray-matter";

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
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const index = parseInt(params.slug, 10);

    if (isNaN(index)) {
      return new Response(
        JSON.stringify({ error: 400, message: "Invalid index" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Load and parse .mdx project files from /app/projects or /content/projects
    const files = await fs.readdir(path.join(process.cwd(), "app/projects"));
    const projects = [];

    for (const file of files) {
      if (file.endsWith(".mdx")) {
        const content = await fs.readFile(
          path.join(process.cwd(), "app/projects", file),
          "utf-8"
        );
        const { data } = matter(content);

        if (data.published) {
          const slug = file.replace(/\.mdx$/, "");
          projects.push({
            title: data.title,
            date: new Date(data.date),
            description: data.description,
            tags: data.tags,
            href: `/projects/${slug}`,
          });
        }
      }
    }

    projects.sort((a, b) => b.date.getTime() - a.date.getTime());

    if (index < 0 || index >= projects.length) {
      return new Response(
        JSON.stringify({ error: 404, message: "Project not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const project = projects[index];

    sendDiscordNotification(project.title, project.href).catch(console.error);

    // Note: must redirect from client-side — `redirect()` only works in Server Components.
    return new Response(null, {
      status: 307,
      headers: {
        Location: project.href,
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 500, message: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
