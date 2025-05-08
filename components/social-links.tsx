import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";

const socialLinks = [
  {
    href: "https://github.com/Dere-Wah",
    icon: "mdi:github",
    label: "GitHub",
  },
  {
    href: "https://www.linkedin.com/in/davide-locatelli-91a360304/",
    icon: "mdi:linkedin",
    label: "LinkedIn",
  },
  {
    href: "mailto:contact@derewah.dev",
    icon: "mdi:email",
    label: "Email",
  },
];

export default function SocialLinks() {
  return (
    <div className="flex items-center gap-6 mb-12">
      {socialLinks.map(({ href, icon, label }) => (
        <Button
          key={label}
          variant="ghost"
          size="icon"
          asChild
          className="h-12 w-12 rounded-full hover:bg-accent hover:scale-110 transition-all duration-300"
        >
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center"
          >
            <Icon icon={icon} className="h-6 w-6" />
            <span className="sr-only">{label}</span>
          </a>
        </Button>
      ))}
    </div>
  );
}
