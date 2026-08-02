/**
 * weeknumber@1.2.1 ships `types/index.d.ts` and declares it via the top-level
 * `"types"` field, but its `exports` map only defines `require` and `import`
 * conditions — no `types` condition. Under `moduleResolution: "bundler"`
 * (inherited from `expo/tsconfig.base`) TypeScript respects `exports` and so
 * never reaches the declaration file, producing TS7016.
 *
 * This mirrors the upstream declarations verbatim. Remove this file if
 * weeknumber ever adds a `types` condition to its `exports` map, or if the
 * dependency is replaced.
 */
declare module "weeknumber" {
  export function dayOfYear(date?: Date): number;
  export function weekNumber(date?: Date): number;
  export function weekNumberSun(date?: Date): number;
  export function weekNumberSat(date?: Date): number;
  export function weekNumberYear(date?: Date): any;
  export function weekNumberYearSun(date?: Date): any;
  export function weekNumberYearSat(date?: Date): any;
  export function weeksPerYear(year: number): number;
  export function weeksPerYearSun(year: number): number;
  export function weeksPerYearSat(year: number): number;
}
