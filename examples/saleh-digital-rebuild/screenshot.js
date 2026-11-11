#!/usr/bin/env node

/**
 * Screenshot comparison script
 * Captures live saleh.digital and local rebuild at 1440px and 390px
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
const LIVE_BASE = 'https://saleh.digital';
const LOCAL_BASE = `file://${__dirname}`;

const VIEWPORTS = [
  { name: '1440', width: 1440, height: 900 },
  { name: '390', width: 390, height: 844 }
];

const PAGES = [
  { name: 'home', live: '/', local: '/index.html' },
  { name: 'article', live: '/articles/what-is-a-design-harness', local: '/inner.html' }
];

async function captureScreenshots() {
  // Ensure screenshots directory exists
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/local/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  try {
    for (const viewport of VIEWPORTS) {
      console.log(`\nCapturing at ${viewport.width}x${viewport.height}...`);

      for (const page of PAGES) {
        // Capture live site
        console.log(`  Live ${page.name}...`);
        const livePage = await browser.newPage();
        await livePage.setViewport({ width: viewport.width, height: viewport.height });
        
        try {
          await livePage.goto(`${LIVE_BASE}${page.live}`, { waitUntil: 'networkidle0', timeout: 15000 });
          await livePage.screenshot({
            path: path.join(SCREENSHOTS_DIR, `live-${page.name}-${viewport.name}.png`),
            fullPage: false
          });
        } catch (err) {
          console.error(`    Error capturing live ${page.name}: ${err.message}`);
        }
        
        await livePage.close();

        // Capture rebuild
        console.log(`  Rebuild ${page.name}...`);
        const rebuildPage = await browser.newPage();
        await rebuildPage.setViewport({ width: viewport.width, height: viewport.height });
        
        try {
          await rebuildPage.goto(`${LOCAL_BASE}${page.local}`, { waitUntil: 'load' });
          await rebuildPage.screenshot({
            path: path.join(SCREENSHOTS_DIR, `rebuild-${page.name}-${viewport.name}.png`),
            fullPage: false
          });
        } catch (err) {
          console.error(`    Error capturing rebuild ${page.name}: ${err.message}`);
        }
        
        await rebuildPage.close();
      }
    }

    console.log(`\n✓ Screenshots saved to ${SCREENSHOTS_DIR}`);
    console.log('\nScreenshot matrix:');
    console.log('  live-home-1440.png     rebuild-home-1440.png');
    console.log('  live-home-390.png      rebuild-home-390.png');
    console.log('  live-article-1440.png  rebuild-article-1440.png');
    console.log('  live-article-390.png   rebuild-article-390.png');
  } finally {
    await browser.close();
  }
}

captureScreenshots().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
