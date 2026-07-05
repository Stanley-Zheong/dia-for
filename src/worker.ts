type Env = {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
};

function canTryDirectoryIndex(url: URL) {
  const lastSegment = url.pathname.split("/").pop() ?? "";
  return !url.pathname.endsWith("/") && !lastSegment.includes(".");
}

function candidateRequests(request: Request) {
  const url = new URL(request.url);
  const paths = new Set([url.pathname]);

  try {
    paths.add(decodeURIComponent(url.pathname));
  } catch {
    // Keep the original encoded path if decoding fails.
  }

  for (const path of Array.from(paths)) {
    const pathUrl = new URL(url);
    pathUrl.pathname = path;
    paths.add(pathUrl.pathname);

    if (canTryDirectoryIndex(pathUrl)) {
      pathUrl.pathname = `${pathUrl.pathname}/`;
      paths.add(pathUrl.pathname);
    }
  }

  return Array.from(paths).map((pathname) => {
    const candidateUrl = new URL(url);
    candidateUrl.pathname = pathname;
    return new Request(candidateUrl, request);
  });
}

async function isNextErrorHtml(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) {
    return false;
  }

  const html = await response.clone().text();
  return html.includes('<html id="__next_error__"');
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== "GET") {
      return env.ASSETS.fetch(request);
    }

    let fallback: Response | null = null;

    for (const candidate of candidateRequests(request)) {
      const response = await env.ASSETS.fetch(candidate);

      if (response.status === 404 || (await isNextErrorHtml(response))) {
        fallback ??= response;
        continue;
      }

      return response;
    }

    return fallback ?? env.ASSETS.fetch(request);
  },
};

export default worker;
