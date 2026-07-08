import { siteConfig } from "@/lib/config";

const analyticsScript = (endpoint: string) => `
(() => {
  const endpoint = ${JSON.stringify(endpoint)};
  const payload = {
    path: location.pathname,
    referrer: document.referrer || "",
    title: document.title,
    language: document.documentElement.lang || navigator.language || "",
    screen: window.screen ? { width: window.screen.width, height: window.screen.height } : null,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    ts: new Date().toISOString()
  };
  const body = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    navigator.sendBeacon(endpoint, new Blob([body], { type: "application/json" }));
    return;
  }
  fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body, keepalive: true }).catch(() => {});
})();
`;

export function AnalyticsBeacon() {
  if (!siteConfig.analyticsEndpoint) return null;
  return <script dangerouslySetInnerHTML={{ __html: analyticsScript(siteConfig.analyticsEndpoint) }} />;
}
