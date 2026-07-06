type Env = {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
};

function canTryDirectoryIndex(url: URL) {
  const lastSegment = url.pathname.split("/").pop() ?? "";
  return !url.pathname.endsWith("/") && !lastSegment.includes(".");
}

function isStaticAssetPath(pathname: string) {
  const lastSegment = pathname.split("/").pop() ?? "";
  return pathname.startsWith("/_next/") || pathname.startsWith("/assets/") || lastSegment.includes(".");
}

function hasLocalePrefix(pathname: string) {
  return pathname === "/zh" || pathname === "/en" || pathname.startsWith("/zh/") || pathname.startsWith("/en/");
}

function preferredLocale(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const cookieMatch = cookie.match(/(?:^|;\s*)locale=(zh|en)(?:;|$)/);
  if (cookieMatch) {
    return cookieMatch[1];
  }

  const acceptLanguage = request.headers.get("accept-language")?.toLowerCase() ?? "";
  return acceptLanguage.includes("en") && !acceptLanguage.includes("zh") ? "en" : "zh";
}

function localizedRedirect(request: Request) {
  const url = new URL(request.url);
  if (isStaticAssetPath(url.pathname) || hasLocalePrefix(url.pathname)) {
    return null;
  }

  const locale = preferredLocale(request);
  url.pathname = `/${locale}${url.pathname === "/" ? "" : url.pathname}`;
  return Response.redirect(url.toString(), 302);
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

    const redirect = localizedRedirect(request);
    if (redirect) {
      return redirect;
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
