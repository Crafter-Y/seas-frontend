/**
 * TypeScript 6 (arrived with Expo SDK 56) errors on side-effect imports that
 * have no type declarations — TS2882. `app/_layout.tsx` does
 * `import "@/nativewind.css"`, and neither nativewind nor
 * react-native-css-interop ships a `*.css` module declaration, so declare it here.
 */
declare module "*.css";
