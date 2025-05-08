import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} DereWah. All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/Dere-Wah/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon icon="lucide:github" className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>

          <Link
            href="https://www.linkedin.com/in/davide-locatelli-91a360304/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon icon="lucide:linkedin" className="h-5 w-5" />
            <span className="sr-only">LinkedIn</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
