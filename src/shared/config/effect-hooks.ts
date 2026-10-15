export const HOOK = {
  site: "site",
  page: "page",
  fx: "fx",
  bar: "bar",
  name: "name",
  intro: "intro",
  big: "big",
  mid: "mid",
  caseH: "case-h",
  mail: "mail",
  cutlist: "cutlist",
  label: "label",
  meta: "meta",
  sub: "sub",
  role: "role",
  go: "go",
  code: "code",
  row: "row",
  rows: "rows",
  tile: "tile",
  demo: "demo",
} as const;

export const anyOf = (...hooks: (typeof HOOK)[keyof typeof HOOK][]) =>
  hooks.map((hook) => `.${hook}`).join(", ");

export const HERO_PART = "Hero";
