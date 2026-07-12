# Product videos

Drop the product screen recordings here. No code change is needed beyond
passing the file to the matching `VideoFrame` (`src` + `poster`) at its call
site (see the `// TODO:` comments in `ProductVideo.tsx` and `Features.tsx`).

Expected files:
- hero.mp4 / hero-poster.webp            — hero product demo (15–25s)
- feature-extract.mp4                    — "Reads what other tools can't"
- feature-library.mp4                    — "A library that already speaks Italian"
- feature-specbook.mp4                   — "Documents they keep"

Encode: MP4 (H.264), under 3MB each, muted, loop-friendly. Include a poster
frame (first frame) as .webp for each.
