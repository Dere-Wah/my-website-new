import { notFound } from "next/navigation";
import { getProjectBySlug, getProjects } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";
import { format } from "date-fns";
import { ArrowLeftIcon, CalendarIcon, TagIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Shield } from "@/components/ui/shield";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export async function generateStaticParams() {
  const projects = await getProjects();

  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const project = (await getProjectBySlug(params.slug))?.frontmatter;

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} – DereWah`,
    description: project.description,
    keywords: project.tags,
    openGraph: {
      title: project.title,
      description: project.description,
      url: `https://derewah.dev/project/${params.slug}`,
      images: [
        {
          url: `${project.thumbnail}`,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} – DereWah`,
      description: project.description,
      images: [
        {
          url: `${project.thumbnail}`,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  const { frontmatter, content } = project;

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12">
      <article className="container max-w-3xl mx-auto px-4">
        <header className="space-y-6 mb-10">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              {frontmatter.title}
            </h1>

            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              <time dateTime={frontmatter.date}>
                {format(new Date(frontmatter.date), "MMMM d, yyyy")}
              </time>
            </div>
          </div>

          {frontmatter.thumbnail && (
            <div className="relative aspect-video rounded-lg overflow-hidden border">
              <Image
                src={frontmatter.thumbnail}
                alt={frontmatter.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
              />
            </div>
          )}

          <p className="text-lg text-muted-foreground">
            {frontmatter.description}
          </p>

          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <div className="flex items-center gap-2">
              <TagIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-wrap gap-2">
                {frontmatter.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </header>

        <Separator className="my-8" />

        <div
          className={cn(
            "prose dark:prose-invert max-w-none",
            // Headings
            "prose-h1:text-4xl prose-h1:font-bold prose-h1:tracking-tight prose-h1:mb-6",
            "prose-h2:text-3xl prose-h2:font-bold prose-h2:tracking-tight prose-h2:mt-12 prose-h2:mb-6",
            "prose-h3:text-2xl prose-h3:font-semibold prose-h3:tracking-tight prose-h3:mt-8 prose-h3:mb-4",
            "prose-h4:text-xl prose-h4:font-semibold prose-h4:tracking-tight prose-h4:mt-6 prose-h4:mb-4",
            // Paragraphs and spacing
            "prose-p:text-base prose-p:leading-7 prose-p:my-6",
            "prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6",
            "prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6",
            "prose-li:my-2 prose-li:leading-7",
            // Links
            "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
            // Code blocks
            "prose-pre:rounded-lg prose-pre:border prose-pre:bg-muted/50 prose-pre:p-4",
            "prose-code:text-primary prose-code:bg-muted/50 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm",
            "prose-pre:code:bg-transparent prose-pre:code:px-0 prose-pre:code:py-0",
            // Horizontal rules
            "prose-hr:my-12 prose-hr:border-border",
            // Tables
            "prose-table:w-full prose-table:my-8 prose-table:border prose-table:rounded-lg overflow-hidden",
            "prose-th:bg-muted prose-th:p-3 prose-th:text-left prose-th:font-semibold",
            "prose-td:p-3 prose-td:border-t prose-td:border-border",
            // Images
            "prose-img:rounded-lg prose-img:border prose-img:my-8 prose-img:mx-auto",
            // Blockquotes
            "prose-blockquote:border-l-4 prose-blockquote:border-primary/20 prose-blockquote:pl-6 prose-blockquote:italic",
            "prose-blockquote:text-muted-foreground prose-blockquote:my-8"
          )}
        >
          <MDXRemote source={content} components={{ Shield }} />
        </div>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="gap-2 -ml-2 transition-all duration-300 hover:gap-3 text-sm"
        >
          <Link href={`../#`}>
            <ArrowLeftIcon className="h-3.5 w-3.5" /> Back
          </Link>
        </Button>
      </article>
    </div>
  );
}
