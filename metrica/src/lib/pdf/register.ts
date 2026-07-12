import { Font } from "@react-pdf/renderer";
import path from "path";

const dir = path.join(process.cwd(), "src/lib/pdf/fonts");
let registered = false;

/** Register the self-hosted Satoshi weights with React-PDF (server-side only). */
export function registerFonts() {
  if (registered) return;
  Font.register({
    family: "Satoshi",
    fonts: [
      { src: path.join(dir, "Satoshi-400.ttf"), fontWeight: 400 },
      { src: path.join(dir, "Satoshi-500.ttf"), fontWeight: 500 },
      { src: path.join(dir, "Satoshi-600.ttf"), fontWeight: 600 },
      { src: path.join(dir, "Satoshi-700.ttf"), fontWeight: 700 },
    ],
  });
  // No hyphenation — cleaner justified spec text.
  Font.registerHyphenationCallback((word) => [word]);
  registered = true;
}
