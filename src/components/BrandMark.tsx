/*
 * Placeholder brand mark, shared by the hero overlay and the floating dock.
 * This is the ONE swap point for a real logo: drop an SVG into public/ and
 * replace this whole node with an <img> / <svg> of it — nothing that uses it
 * depends on its internals, only on the wrapper's size.
 */
export function BrandMark() {
  return (
    <svg viewBox="0 0 120 96" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M8 88V12h34c13 0 21 7 21 18 0 9-5 15-14 17l17 23"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path d="M74 88V12M74 48h34M108 12v76" stroke="currentColor" strokeWidth="9" strokeLinecap="square" />
    </svg>
  );
}
