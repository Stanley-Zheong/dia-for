import type { Metadata } from "next";

import "@/app/globals.css";
import { AnalyticsBeacon } from "@/components/AnalyticsBeacon";
import { StructuredData } from "@/components/StructuredData";
import { siteConfig } from "@/lib/config";
import { languageAlternates } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.primaryUrl),
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: {
    canonical: siteConfig.primaryUrl,
    languages: languageAlternates("/"),
  },
  openGraph: {
    type: "website",
    url: siteConfig.primaryUrl,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    locale: "zh_CN",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <StructuredData />
        {children}
        <AnalyticsBeacon />
      </body>
    </html>
  );
}
