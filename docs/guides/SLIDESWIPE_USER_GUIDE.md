# Slideswipe User Guide

Page URL
- http://localhost:3001/slideswipe

Purpose
- Visualize style transfer by revealing styled images over the original with a slideswipe animation

Data Sources
- Primary: Workers API via apiClient
  - Category 1: original image (used as base layer)
  - Category 2: style variants (revealed sequentially)
- Fallback: public/slides/ assets bundled with the app (used when backend has no data)

Controls
- Top bar
  - 返回: navigate back
  - 開始: start sequential reveal animation
- Keyboard
  - Space: start/reset animation (Shorts page supports this; Slideswipe uses button)

Animation
- Step interval: ~800ms per cell
- Transition duration: ~1200ms
- Reveal effect: CSS clip-path from left→right to show the styled image

Usage
1) Ensure Next dev is running on 3001 and Workers on 8787
2) Open the page: http://localhost:3001/slideswipe
3) Click 開始 to play the reveal sequence
4) To feed real images:
   - Upload one Category 1 original and up to 8 Category 2 style images via API/Dashboard
   - Reload the page to see live data

Troubleshooting
- No images: Page uses fallback assets under public/slides/
- Animation not smooth: Check browser performance, reduce concurrent tabs
- Backend images missing: Verify uploads endpoints and categories via API_DOCUMENTATION.md
