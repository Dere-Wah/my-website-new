import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Analytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
