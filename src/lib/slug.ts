const nonWordPattern = /[^\p{L}\p{N}]+/gu;

export function slugify(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(nonWordPattern, "-")
    .replace(/^-+|-+$/g, "");

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
