import { llmsText } from "@/lib/seo";

export const dynamic = "force-static";

export function GET() {
  return new Response(llmsText(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
