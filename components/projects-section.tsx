import { ProjectType } from "@/lib/mdx";
import ProjectCard from "./project-card";

interface ProjectsSectionProps {
  projects: ProjectType[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" className="py-12">
      <div className="prose dark:prose-invert max-w-none mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">Projects</h2>
        <p className="text-muted-foreground">
          Below you can find some of the projects I've worked on in these years. Some are interesting, some are crap, some are just cringe. I've warned you, proceed with caution.
        </p>
      </div>
      
      {projects.length === 0 ? (
        <p className="text-muted-foreground">No projects found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}