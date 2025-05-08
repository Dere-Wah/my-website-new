import HeroSection from '@/components/hero-section';
import About from '@/components/about';
import ProjectsSection from '@/components/projects-section';
import { getProjects } from '@/lib/mdx';

export default async function Home() {
  const projects = await getProjects();
  
  return (
    <div className="container max-w-3xl mx-auto px-4">
      <div className="space-y-8">
        <HeroSection />
        <About />
        <ProjectsSection projects={projects} />
      </div>
    </div>
  );
}