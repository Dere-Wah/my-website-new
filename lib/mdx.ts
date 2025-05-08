import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface ProjectType {
  slug: string;
  frontmatter: {
    title: string;
    date: string;
    description: string;
    tags?: string[];
    published?: boolean;
    thumbnail?: string;
    [key: string]: any;
  };
  content: string;
}

const PROJECTS_PATH = path.join(process.cwd(), 'projects');

async function readDirectory() {
  try {
    return await fs.readdir(PROJECTS_PATH);
  } catch (error) {
    // If projects directory doesn't exist, create it
    await fs.mkdir(PROJECTS_PATH, { recursive: true });
    return [];
  }
}

export async function getProjects(): Promise<ProjectType[]> {
  const files = await readDirectory();
  const mdxFiles = files.filter(file => file.endsWith('.mdx'));
  
  const projects = await Promise.all(
    mdxFiles.map(async (file) => {
      const slug = file.replace(/\.mdx$/, '');
      const project = await getProjectBySlug(slug);
      
      return project;
    })
  );
  
  // Filter out unpublished projects and sort by date (newest first)
  return projects
    .filter(project => project?.frontmatter.published !== false)
    .sort((a, b) => 
      new Date(b!.frontmatter.date).getTime() - new Date(a!.frontmatter.date).getTime()
    ) as ProjectType[];
}

export async function getProjectBySlug(slug: string): Promise<ProjectType | null> {
  try {
    const filePath = path.join(PROJECTS_PATH, `${slug}.mdx`);
    const fileContent = await fs.readFile(filePath, 'utf8');
    
    const { data, content } = matter(fileContent);
    
    return {
      slug,
      frontmatter: {
        title: data.title || slug,
        date: data.date || new Date().toISOString(),
        description: data.description || '',
        tags: data.tags || [],
        published: data.published !== false,
        thumbnail: data.thumbnail || null,
        ...data,
      },
      content,
    };
  } catch (error) {
    return null;
  }
}