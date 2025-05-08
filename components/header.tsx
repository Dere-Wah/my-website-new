"use client";

import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { HomeIcon, FolderIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToProjects = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const projectsSection = document.getElementById("projects");
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200 overflow-hidden",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b"
          : "bg-transparent"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-xl">
            derewah
            <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 dark:from-blue-400 dark:via-cyan-400 dark:to-sky-400 bg-clip-text text-transparent">
              .dev
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Button variant="ghost" asChild size="sm">
            <Link href="/" className="flex items-center gap-2">
              <HomeIcon className="h-4 w-4" />
              <span className="hidden md:block">About me</span>
            </Link>
          </Button>

          <Button variant="ghost" asChild size="sm">
            <Link
              href="/#projects"
              onClick={scrollToProjects}
              className="flex items-center gap-2"
            >
              <FolderIcon className="h-4 w-4" />
              <span className="hidden md:block">Projects</span>
            </Link>
          </Button>

          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}
