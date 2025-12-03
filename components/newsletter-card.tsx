"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, X } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

interface NewsletterCardProps {
  onClose?: () => void;
  className?: string;
  variant?: "default" | "inline";
}

export default function NewsletterCard({
  onClose,
  className,
  variant = "default",
}: NewsletterCardProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(true);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      toast({
        title: "Subscribed!",
        description: data.message || "You have successfully subscribed.",
      });
      setEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to subscribe",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen && variant === "default") {
    return null;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, height: 0 }}
      animate={
        inView ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }
      }
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn("relative overflow-hidden not-prose", className)}
    >
      <Card
        className={cn(
          "overflow-hidden border-primary/20 bg-primary/5",
          variant === "default" ? "md:h-full h-48" : "h-auto"
        )}
      >
        {variant === "default" && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 z-10 h-6 w-6 text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onClose) {
                onClose();
              } else {
                setIsOpen(false);
              }
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        <div
          className={cn(
            "flex flex-col justify-center h-full",
            variant === "default" && "md:flex-row md:items-center"
          )}
        >
          <div
            className={cn(
              "flex-1 flex flex-col justify-center",
              variant === "default" ? "h-full" : "p-2"
            )}
          >
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg">
                Subscribe to my blogposts
              </CardTitle>
              <CardDescription className="text-sm line-clamp-2">
                Get updates on my latest projects and articles directly to your
                inbox. No spam.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 pt-2">
              <form
                onSubmit={onSubmit}
                className="flex w-full items-center space-x-2"
              >
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-9"
                  disabled={isLoading}
                />
                <Button type="submit" size="sm" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </form>
            </CardContent>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
