/** Locale-aware grapheme split — i18n mətnlərdə hər hərfi ayrı animasiya üçün. */
export function splitGraphemes(text: string, locale?: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter(locale, { granularity: "grapheme" });
    return [...segmenter.segment(text)].map((part) => part.segment);
  }
  return [...text];
}
