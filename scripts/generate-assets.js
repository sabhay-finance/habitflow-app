import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const assetsDir = path.resolve(process.cwd(), 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// 1. App Icon SVG (1024x1024)
const iconSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8b5cf6" />
      <stop offset="50%" stop-color="#7c3aed" />
      <stop offset="100%" stop-color="#4f46e5" />
    </linearGradient>
    <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="50%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#ea580c" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="30" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="24" stdDeviation="20" flood-color="#1e1b4b" flood-opacity="0.45" />
    </filter>
  </defs>

  <!-- Background Rect -->
  <rect width="1024" height="1024" fill="url(#bgGrad)" />

  <!-- Inner subtle radial glow -->
  <circle cx="512" cy="480" r="380" fill="#a78bfa" opacity="0.3" filter="url(#glow)" />

  <!-- Stylized Lightning Bolt Emblem with checkmark aesthetic -->
  <g filter="url(#shadow)">
    <path d="M 560 180 L 320 540 L 490 540 L 440 844 L 720 450 L 540 450 Z" 
          fill="url(#boltGrad)" 
          stroke="#ffffff" 
          stroke-width="14" 
          stroke-linejoin="round" 
          stroke-linecap="round" />
  </g>

  <!-- Sparkle stars -->
  <polygon points="680,240 695,280 735,295 695,310 680,350 665,310 625,295 665,280" fill="#ffffff" opacity="0.9" />
  <polygon points="320,680 332,710 362,722 332,734 320,764 308,734 278,722 308,710" fill="#fef08a" opacity="0.85" />
</svg>
`;

// 2. Splash Screen SVG (2732x2732)
const splashSvg = `
<svg width="2732" height="2732" viewBox="0 0 2732 2732" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="splashBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="50%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#ea580c" />
    </linearGradient>
    <filter id="splashGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="80" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <rect width="2732" height="2732" fill="url(#splashBg)" />

  <!-- Ambient Glow in center -->
  <circle cx="1366" cy="1200" r="600" fill="#7c3aed" opacity="0.25" filter="url(#splashGlow)" />

  <!-- Center Card -->
  <rect x="1116" y="950" width="500" height="500" rx="120" fill="#7c3aed" />

  <!-- Lightning Bolt -->
  <path d="M 1400 1020 L 1220 1260 L 1350 1260 L 1310 1480 L 1510 1190 L 1380 1190 Z" 
        fill="url(#boltGrad)" 
        stroke="#ffffff" 
        stroke-width="12" 
        stroke-linejoin="round" />

  <!-- HabitFlow Typography -->
  <text x="1366" y="1620" 
        font-family="system-ui, -apple-system, sans-serif" 
        font-weight="800" 
        font-size="96" 
        fill="#ffffff" 
        text-anchor="middle" 
        letter-spacing="4">
    HabitFlow
  </text>
  <text x="1366" y="1710" 
        font-family="system-ui, -apple-system, sans-serif" 
        font-weight="600" 
        font-size="42" 
        fill="#94a3b8" 
        text-anchor="middle" 
        letter-spacing="2">
    Daily Momentum &amp; Streaks
  </text>
</svg>
`;

// 3. Play Store Feature Graphic SVG (1024x500)
const featureSvg = `
<svg width="1024" height="500" viewBox="0 0 1024 500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="featBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#581c87" />
      <stop offset="50%" stop-color="#1e1b4b" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047" />
      <stop offset="100%" stop-color="#f97316" />
    </linearGradient>
  </defs>

  <rect width="1024" height="500" fill="url(#featBg)" />

  <!-- Left Side Typography -->
  <text x="80" y="210" font-family="system-ui, sans-serif" font-weight="900" font-size="64" fill="#ffffff">
    HabitFlow
  </text>
  <text x="80" y="270" font-family="system-ui, sans-serif" font-weight="700" font-size="28" fill="#c084fc">
    Satisfying Habits. Unstoppable Streaks.
  </text>
  <text x="80" y="320" font-family="system-ui, sans-serif" font-weight="500" font-size="20" fill="#94a3b8">
    Daily Tactile Check-offs · GitHub Heatmaps · Gamified XP
  </text>

  <!-- Right Side Floating Icon -->
  <g transform="translate(680, 80)">
    <rect width="240" height="240" rx="55" fill="#7c3aed" />
    <path d="M 135 40 L 70 140 L 120 140 L 105 210 L 180 115 L 130 115 Z" fill="url(#boltGrad)" stroke="#ffffff" stroke-width="6" />
  </g>
</svg>
`;

async function run() {
  console.log('Generating assets in /assets directory...');

  await sharp(Buffer.from(iconSvg))
    .png()
    .toFile(path.join(assetsDir, 'icon.png'));
  console.log('✔ Generated assets/icon.png (1024x1024)');

  await sharp(Buffer.from(splashSvg))
    .png()
    .toFile(path.join(assetsDir, 'splash.png'));
  console.log('✔ Generated assets/splash.png (2732x2732)');

  await sharp(Buffer.from(featureSvg))
    .png()
    .toFile(path.join(assetsDir, 'feature-graphic.png'));
  console.log('✔ Generated assets/feature-graphic.png (1024x500)');

  console.log('Assets generation complete!');
}

run().catch(console.error);
