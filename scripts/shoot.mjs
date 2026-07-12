import { chromium } from "playwright-core";

const EXEC = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const base = process.env.BASE || "http://localhost:3000";

const shots = JSON.parse(process.argv[2] || "[]");
// shots: [{ path, out, width, height, full, reduced }]

const browser = await chromium.launch({ executablePath: EXEC, args: ["--no-sandbox"] });
for (const s of shots) {
  const ctx = await browser.newContext({
    viewport: { width: s.width, height: s.height || 900 },
    deviceScaleFactor: 2,
    reducedMotion: s.reduced ? "reduce" : "no-preference",
    javaScriptEnabled: s.nojs ? false : true,
  });
  const page = await ctx.newPage();
  await page.goto(base + s.path, { waitUntil: "networkidle" });
  await page.waitForTimeout(s.wait ?? 900);
  if (s.scrollTo) await page.evaluate((y) => window.scrollTo(0, y), s.scrollTo);
  await page.waitForTimeout(400);
  await page.screenshot({ path: s.out, fullPage: !!s.full });
  console.log("shot", s.out, s.width + "x" + (s.height || 900), s.path);
  await ctx.close();
}
await browser.close();
