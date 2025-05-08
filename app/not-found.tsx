import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
      <p className="mt-4 text-muted-foreground max-w-md">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      
      <Button asChild className="mt-8">
        <Link href="/" className="flex items-center gap-2">
          <HomeIcon className="h-4 w-4" />
          Return Home
        </Link>
      </Button>
    </div>
  );
}