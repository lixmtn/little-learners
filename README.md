# Bé Học · Little Learners

An offline early-math & logic game for a **2.5-year-old** and a **4-year-old**, built to run
full-screen on an iPad. Bilingual (🇻🇳 Tiếng Việt / 🇬🇧 English), no scores, no timers, no ads,
no internet needed once installed.

## What it teaches (and why)

Design is grounded in early-childhood research:

| Game | Skill | Why it matters |
|---|---|---|
| **Đếm / Count** | Subitizing + counting (1–3 toddler, 1–6 preschool) | Subitizing — seeing "how many" without counting — is the single strongest predictor of later math at ages 3–4 |
| **Học số / Numbers** | Quantity ↔ numeral | Connects the spoken number and dots to the written symbol |
| **Hình khối / Shapes** | Geometry | Early shape/spatial skill predicts later arithmetic |
| **To & Nhỏ / Big & Small** | Measurement, size comparison | Everyday math vocabulary: big/small |
| **Màu sắc / Colors** | Attribute recognition | Foundation for sorting & classifying |
| **Tìm cái khác / Odd one out** (toddler) | Logic | "Which is different?" — early reasoning |
| **Tiếp theo / What's next** (preschool) | Patterns/sequencing | Pattern recognition → logical thinking |

**Design principles used:** no fail states / no scores (self-paced, stress-free — the "Endless" model),
huge touch targets, full-hand tapping, spoken instructions & praise (kids don't read yet),
instant audio + visual reward on every tap, one concept per screen, two difficulty **profiles**
(🐣 Bé nhỏ = 2.5yo, 🧒 Bé lớn = 4yo).

**Screen-time:** follows AAP guidance for ages 2–5 (~1 hr/day, play alongside your child).
A gentle "take a break" screen appears after 10/15 min (set in the ⚙️ grown-up panel).

## How to put it on the iPad

The app is just static files, so you have two paths:

### Option A — Full offline app (recommended): host it free with HTTPS
A Progressive Web App only caches for **offline** use over **HTTPS**. Easiest free hosts:

1. **Netlify Drop** — go to https://app.netlify.com/drop and drag this whole
   `little-learners` folder onto the page. You get an `https://…netlify.app` link in seconds.
2. Open that link in **Safari on the iPad** → tap the **Share** button →
   **Add to Home Screen**. It now launches full-screen like a real app and works with WiFi off.

(GitHub Pages, Cloudflare Pages, or Vercel work the same way.)

### Option B — Quick test over your home WiFi (needs Mac on, online only)
From this folder on the Mac:
```bash
python3 -m http.server 8777
```
Find your Mac's IP (System Settings → WiFi → Details), then on the iPad open
`http://<your-mac-ip>:8777`. You can still Add to Home Screen, but true offline caching
won't work on plain http — use Option A for that.

## Grown-up settings (⚙️, top-right)
Tap ⚙️, answer the little number gate (keeps kids out), then set:
language, voice on/off, break reminder, or reset the star count.

## Notes
- Voices use the iPad's built-in speech. Make sure a **Vietnamese voice** is installed:
  Settings → Accessibility → Spoken Content → Voices → add *Tiếng Việt* (e.g. "Linh").
- No data leaves the device. Stars and settings are saved locally in the browser.
