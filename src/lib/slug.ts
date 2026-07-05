const nonAsciiPattern = /[^\x00-\x7F]/;
const nonAsciiWordPattern = /[^a-z0-9]+/g;

function shortHash(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(36).slice(0, 6);
}

function asciiSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(nonAsciiWordPattern, "-")
    .replace(/^-+|-+$/g, "");
}

export function slugify(value: string): string {
  const normalized = value.trim();
  const slug = asciiSlug(normalized);

  if (nonAsciiPattern.test(normalized)) {
    return slug ? `${slug}-u-${shortHash(normalized)}` : `u-${shortHash(normalized)}`;
  }

  return slug || "untitled";
}

export function uniqueSlug(base: string, existing: Set<string>): string {
  let candidate = slugify(base);
  let suffix = 2;

  while (existing.has(candidate)) {
    candidate = `${slugify(base)}-${suffix}`;
    suffix += 1;
  }

  existing.add(candidate);
  return candidate;
}
