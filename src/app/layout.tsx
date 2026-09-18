import type { Metadata } from "next";
import { Fraunces, Outfit, Geist, Alex_Brush, Caveat } from "next/font/google";
import SmoothScroll from "@/components/providers/SmoothScroll";
import PageLoader from "@/components/providers/PageLoader";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { site } from "@/content/site";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const alexBrush = Alex_Brush({
  weight: "400",
  variable: "--font-script",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-handwriting",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        outfit.variable,
        fraunces.variable,
        alexBrush.variable,
        caveat.variable,
        "font-sans",
        geist.variable
      )}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Caveat:wght@400..700&family=Google+Sans+Flex:opsz,wght@6..144,1..1000&family=Inknut+Antiqua:wght@300;400;500;600;700;800;900&family=Roboto:ital,wght@0,100..900;1,100..900&family=Saira:ital,wght@0,100..900;1,100..900&family=Sora:wght@100..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col bg-cream font-sans text-ink" style={{ fontFamily: "'Google Sans Flex', ui-sans-serif, system-ui, sans-serif" }}>
        <PageLoader />
        <SmoothScroll>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
