import type { Metadata } from "next";
import { Comic_Neue, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const comicNeue = Comic_Neue({
  variable: "--font-handwritten",
  subsets: ["latin"],
  weight: ["400", "700"],
});


export const metadata: Metadata = {
  title: "Jamal Ferguson | Front-End Software Developer",
  description:
    "Full-stack software developer building thoughtful, responsive products with React, Next.js, Node.js, APIs, and modern web technologies.",
  metadataBase: new URL("https://jamalferguson.dev"),
  icons: {
    icon: [
      {
        url: "/jf-favicon-32.png?v=20261118",
        type: "image/png",
        sizes: "32x32",
      },
      {
        url: "/jf-favicon-64.png?v=20261118",
        type: "image/png",
        sizes: "64x64",
      },
    ],
    shortcut: "/favicon.ico?v=20261118",
    apple: [
      {
        url: "/portfolio-logo-touch-v2.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    type: "website",
    url: "https://jamalferguson.dev",
    title: "Jamal Ferguson | Front-End Software Developer",
    description:
      "Front-end software developer building thoughtful, responsive products with React, Next.js, Node.js, APIs, and modern web technologies.",
    siteName: "Jamal Ferguson",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Jamal Ferguson — Front-End Software Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jamal Ferguson | Front-End Software Developer",
    description:
      "Front-end software developer building thoughtful, responsive products with React, Next.js, Node.js, APIs, and modern web technologies.",
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${comicNeue.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
