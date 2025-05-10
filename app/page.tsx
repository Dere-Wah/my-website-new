import HeroSection from "@/components/hero-section";
import About from "@/components/about";
import ProjectsSection from "@/components/projects-section";
import { getProjects } from "@/lib/mdx";

export const metadata = {
  metadataBase: new URL("https://derewah.dev"),
  title: "Hi! I'm Dere",
  description:
    "Exploring technology through web development, AI projects, and game design.",
  keywords: [
    "DereWah",
    "web development",
    "AI",
    "game development",
    "projects",
    "portfolio",
  ],
  openGraph: {
    title: "DereWah – Portfolio",
    description:
      "Showcasing innovative projects in web development, AI, and game design.",
    url: "https://derewah.dev",
    images: [
      {
        url: "https://derewah.dev/og-image.png",
        width: 1028,
        height: 447,
        alt: "DereWah Portfolio Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DereWah – Portfolio",
    description:
      "Showcasing innovative projects in web development, AI and game design.",
    images: ["https://derewah.dev/og-image.png"],
  },
};

export default async function Home() {
  const projects = await getProjects();
  return (
    <div className="container max-w-3xl mx-auto px-4">
      <div className="space-y-2">
        <HeroSection />
        <About />
        <ProjectsSection projects={projects} />
      </div>
    </div>
  );
}
