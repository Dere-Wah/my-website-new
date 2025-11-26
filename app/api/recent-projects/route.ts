export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getProjects } from "@/lib/mdx";

export async function GET(req: NextRequest) {
  try {
    const projects = await getProjects();

    // Filter published projects and sort by date (newest first)
    const sortedProjects = projects
      .filter((project) => project.frontmatter.published)
      .sort(
        (a, b) =>
          new Date(b.frontmatter.date).getTime() -
          new Date(a.frontmatter.date).getTime()
      );

    if (sortedProjects.length === 0) {
      return NextResponse.json(
        { error: "No published projects found" },
        { status: 404 }
      );
    }

    // Get the latest project name (slug)
    const latestProjectName = sortedProjects[0].slug;

    return NextResponse.json(
      { name: latestProjectName },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Recent projects error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
