import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { index } = req.query;
    const idx = parseInt(index as string, 10);

    if (isNaN(idx) || idx < 0) {
      return res.status(400).json({
        error: 400,
        message: "Invalid index parameter.",
      });
    }

    // Read MDX files from file system (adjust the path as needed)
    const projectsDir = path.join(process.cwd(), "pages/projects");
    const files = fs
      .readdirSync(projectsDir)
      .filter((file) => file.endsWith(".mdx"));

    let projects = files
      .map((filename) => {
        const filePath = path.join(projectsDir, filename);
        const fileContents = fs.readFileSync(filePath, "utf8");
        const { data } = matter(fileContents);
        const slug = filename.replace(/\.mdx$/, "");

        return {
          title: data.title,
          date: new Date(data.date),
          published: data.published,
          description: data.description,
          tags: data.tags,
          href: `/projects/${slug}`,
        };
      })
      .filter((project) => project.published)
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    if (idx >= projects.length) {
      return res.status(404).json({
        error: 404,
        message: "Project not found.",
      });
    }

    const project = projects[idx];

    function estimateTextWidth(
      text: string,
      fontSize = 12,
      padding = 16
    ): number {
      return text.length * (fontSize * 0.6) + padding;
    }

    function wrapWords(text: string, maxLineLength: number): string[] {
      const words = text.split(" ");
      const lines: string[] = [];
      let currentLine = "";

      for (const word of words) {
        if ((currentLine + word).length <= maxLineLength) {
          currentLine += (currentLine ? " " : "") + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      if (currentLine) lines.push(currentLine);
      return lines;
    }

    const titleLines = wrapWords(project.title, 45);
    const descLines = wrapWords(project.description, 65);

    const TAG_HEIGHT = 22;
    const PADDING_BETWEEN_TAGS = 8;
    const PADDING_AROUND_TAG_TEXT = 14;
    const MAX_WIDTH = 540;

    let tagRows: string[][] = [];
    let currentRow: string[] = [];
    let currentRowWidth = 0;

    for (const tag of project.tags) {
      const tagWidth = estimateTextWidth(tag, 12, PADDING_AROUND_TAG_TEXT);
      if (currentRowWidth + tagWidth + PADDING_BETWEEN_TAGS > MAX_WIDTH) {
        tagRows.push(currentRow);
        currentRow = [tag];
        currentRowWidth = tagWidth + PADDING_BETWEEN_TAGS;
      } else {
        currentRow.push(tag);
        currentRowWidth += tagWidth + PADDING_BETWEEN_TAGS;
      }
    }
    if (currentRow.length) tagRows.push(currentRow);

    const TITLE_LINE_HEIGHT = 26;
    const DESC_LINE_HEIGHT = 20;
    const TAG_VERTICAL_SPACING = 8;

    const titleHeight = titleLines.length * TITLE_LINE_HEIGHT;
    const descHeight = descLines.length * DESC_LINE_HEIGHT;
    const dateHeight = 30;
    const tagsHeight = tagRows.length * (TAG_HEIGHT + TAG_VERTICAL_SPACING);
    const totalVerticalPadding = 40 + 20;

    const svgHeight =
      titleHeight +
      40 +
      descHeight +
      dateHeight +
      tagsHeight +
      totalVerticalPadding;

    const COLORS = {
      background: "#0d1117",
      border: "#30363d",
      title: "#e6edf3",
      description: "#c9d1d9",
      date: "#8b949e",
      tagBackground: "#21262d",
      tagBorder: "#30363d",
      tagText: "#8b949e",
    };

    const svg = `
<svg width="500" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
	<defs>
		<filter id="cardShadow" x="-2%" y="-2%" width="104%" height="104%">
			<feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#000000" flood-opacity="0.2" />
		</filter>
	</defs>
	<rect width="100%" height="100%" fill="${COLORS.background}" rx="6"
		stroke="${COLORS.border}" stroke-width="1" filter="url(#cardShadow)" />
	<g transform="translate(24, 24) scale(0.9)">
		<path d="..." fill="${COLORS.description}" />
	</g>
	<text x="52" y="40" font-family="Segoe UI, -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif"
		font-size="18" fill="${COLORS.title}" font-weight="600">
		${titleLines
      .map(
        (line, i) =>
          `<tspan x="52" dy="${
            i === 0 ? 0 : TITLE_LINE_HEIGHT
          }">${line}</tspan>`
      )
      .join("")}
	</text>
	<text x="24" y="${80 + (titleLines.length - 1) * TITLE_LINE_HEIGHT}"
		font-family="Segoe UI, -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif"
		font-size="14" fill="${COLORS.description}">
		${descLines
      .map(
        (line, i) =>
          `<tspan x="24" dy="${i === 0 ? 0 : DESC_LINE_HEIGHT}">${line}</tspan>`
      )
      .join("")}
	</text>
	<text x="24" y="${
    120 +
    (titleLines.length - 1) * TITLE_LINE_HEIGHT +
    (descLines.length - 1) * DESC_LINE_HEIGHT
  }"
		font-family="Segoe UI, -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif"
		font-size="12" fill="${COLORS.date}">
		<tspan>Updated on ${new Date(project.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}</tspan>
	</text>
	${tagRows
    .map((row, rowIndex) => {
      let x = 24;
      const y =
        150 +
        (titleLines.length - 1) * TITLE_LINE_HEIGHT +
        (descLines.length - 1) * DESC_LINE_HEIGHT +
        rowIndex * (TAG_HEIGHT + TAG_VERTICAL_SPACING);
      return row
        .map((tag) => {
          const width = estimateTextWidth(tag, 12, PADDING_AROUND_TAG_TEXT);
          const tagSVG = `
		<g>
			<rect x="${x}" y="${y}" rx="12" ry="12" width="${width}" height="${TAG_HEIGHT}"
				fill="${COLORS.tagBackground}" stroke="${COLORS.tagBorder}" stroke-width="1" />
			<text x="${x + PADDING_AROUND_TAG_TEXT / 2}" y="${y + TAG_HEIGHT - 7}"
				font-family="Segoe UI, -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif"
				font-size="12" fill="${COLORS.tagText}">${tag}</text>
		</g>`;
          x += width + PADDING_BETWEEN_TAGS;
          return tagSVG;
        })
        .join("");
    })
    .join("")}
</svg>`;

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader(
      "Cache-Control",
      "no-cache, no-store, private, must-revalidate"
    );
    res.setHeader("Vary", "Accept-Encoding");
    return res.status(200).send(svg);
  } catch (err: any) {
    return res.status(500).json({
      error: 500,
      message: err.message,
    });
  }
}
