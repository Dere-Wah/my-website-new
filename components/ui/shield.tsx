import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

interface ShieldProps {
  text: string;
  icon?: string;
  href?: string;
  variant?: "default" | "subtle";
  onClick?: () => void;
  className?: string;
}

export function Shield({ 
  text, 
  icon, 
  href, 
  variant = "default",
  onClick,
  className 
}: ShieldProps) {
  const Component = href ? "a" : "button";
  
  const content = (
    <>
      {icon && (
        <Icon 
          icon={icon} 
          className="h-4 w-4" 
        />
      )}
      <span>{text}</span>
    </>
  );
  
  return (
    <Component
      href={href}
      onClick={onClick}
      target={href ? "_blank" : undefined}
      rel={href ? "noopener noreferrer" : undefined}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-sm font-medium transition-colors",
        variant === "default" && "bg-primary/10 text-primary hover:bg-primary/20",
        variant === "subtle" && "bg-muted text-muted-foreground hover:bg-muted/80",
        className
      )}
    >
      {content}
    </Component>
  );
}