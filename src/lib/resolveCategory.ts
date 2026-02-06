import { CATEGORY_MAP, CategoryKey } from "./categories";

export function resolveCategoryFromUrl(
  slug: string | null | undefined,
  lang: "tr" | "en"
): CategoryKey | null {
  if (!slug) return null;

  const entry = Object.entries(CATEGORY_MAP).find(
    ([, value]) => value[lang] === slug
  );

  return entry ? (entry[0] as CategoryKey) : null;
}

export function resolveCategory(
  slug: string | null | undefined
): CategoryKey | null {
  if (!slug) return null;

  const s = slug.toLowerCase();
  return (
    (Object.keys(CATEGORY_MAP) as CategoryKey[]).find(
      (k) => CATEGORY_MAP[k].tr === s || CATEGORY_MAP[k].en === s
    ) ?? null
  );
}
