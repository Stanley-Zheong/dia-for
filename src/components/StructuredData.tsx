import { siteConfig } from "@/lib/config";

export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.primaryUrl,
    description: siteConfig.description,
    inLanguage: siteConfig.locales,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.primaryUrl,
      sameAs: siteConfig.contacts.map((contact) => contact.href).filter((href) => href !== "#"),
    },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
