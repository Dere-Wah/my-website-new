"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ProjectType } from "@/lib/mdx";
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface ProjectCardProps {
  project: ProjectType;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { slug, frontmatter } = project;
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg bg-card/95 hover:bg-card border-border/40 hover:border-border">
        <div className="md:flex">
          {frontmatter.thumbnail && (
            <div className="relative w-full md:w-56 h-40 md:h-auto overflow-hidden">
              <Image
                src={frontmatter.thumbnail}
                alt={frontmatter.title}
                fill
                sizes="(max-width: 768px) 100vw, 224px"
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          )}
          
          <div className="flex-1">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg">{frontmatter.title}</CardTitle>
              <CardDescription className="text-sm line-clamp-2">{frontmatter.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="p-4 pt-2">
              {frontmatter.tags && frontmatter.tags.length > 0 && (
                <motion.div 
                  className="flex flex-wrap gap-1.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {frontmatter.tags.map((tag: string) => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="text-xs bg-secondary/80 hover:bg-secondary"
                    >
                      {tag}
                    </Badge>
                  ))}
                </motion.div>
              )}
            </CardContent>
            
            <CardFooter className="p-4 pt-0">
              <Button 
                asChild 
                variant="ghost" 
                size="sm"
                className="gap-2 -ml-2 transition-all duration-300 hover:gap-3 text-sm"
              >
                <Link href={`/projects/${slug}`}>
                  Read more <ArrowRightIcon className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardFooter>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}