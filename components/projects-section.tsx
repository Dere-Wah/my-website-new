"use client";

import { useState, Fragment } from "react";
import { ProjectType } from "@/lib/mdx";
import ProjectCard from "./project-card";
import NewsletterCard from "./newsletter-card";

interface ProjectsSectionProps {
  projects: ProjectType[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [showNewsletter, setShowNewsletter] = useState(true);

  return (
    <section id="projects" className="py-12">
      <div className="prose dark:prose-invert max-w-none mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">Projects</h2>
      </div>

      {projects.length === 0 ? (
        <p className="text-muted-foreground">No projects found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {projects.map((project, index) => {
            // If it's the 3rd item (index 2), render newsletter before it
            if (index === 2 && showNewsletter) {
              return (
                <Fragment key={`group-${project.slug}`}>
                  <NewsletterCard
                    key="newsletter-card"
                    onClose={() => setShowNewsletter(false)}
                  />
                  <ProjectCard key={project.slug} project={project} />
                </Fragment>
              );
            }
            return <ProjectCard key={project.slug} project={project} />;
          })}
          {/* Fallback if we have fewer than 3 projects */}
          {projects.length < 3 && showNewsletter && (
            <NewsletterCard
              key="newsletter-card"
              onClose={() => setShowNewsletter(false)}
            />
          )}
        </div>
      )}
    </section>
  );
}
