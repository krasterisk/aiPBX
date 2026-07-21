const fs = require('fs')
const path = require('path')

const BUILD = path.join(__dirname, '..', 'build')
const SITE_HOST = 'aipbx.net'
const FORBIDDEN_HOST = 'aipbx.ru'

/** @type {Array<{ route: string, file: string }>} */
const ROUTES = [
  { route: '/', file: path.join(BUILD, 'index.html') },
  { route: '/voice-assistants', file: path.join(BUILD, 'voice-assistants', 'index.html') },
  { route: '/speech-analytics', file: path.join(BUILD, 'speech-analytics', 'index.html') },
  { route: '/pricing', file: path.join(BUILD, 'pricing', 'index.html') }
]

const failures = []

function fail (message) {
  failures.push(message)
  console.error(`FAIL: ${message}`)
}

function assertContains (html, needle, label) {
  if (!html.includes(needle)) {
    fail(`${label}: missing "${needle}"`)
  }
}

function assertNotContains (html, needle, label) {
  if (html.includes(needle)) {
    fail(`${label}: must not contain "${needle}"`)
  }
}

function assertFileExists (filePath, label) {
  if (!fs.existsSync(filePath)) {
    fail(`${label}: file missing at ${filePath}`)
    return false
  }
  return true
}

for (const { route, file } of ROUTES) {
  const label = `route ${route}`
  if (!assertFileExists(file, label)) {
    continue
  }
  const html = fs.readFileSync(file, 'utf8')

  assertContains(html, '<title>', label)
  assertContains(html, 'name="description"', label)
  assertContains(html, 'application/ld+json', label)
  assertContains(html, 'rel="canonical"', label)

  assertNotContains(html, 'PageLoader', label)
  assertNotContains(html, 'http://localhost', label)

  // Dotted untranslated i18n keys (namespace.Key) leaking into visible HTML
  if (/SpeechAnalyticsPage\.[A-Za-z]/.test(html) ||
      /VoiceAssistantsPage\.[A-Za-z]/.test(html) ||
      /MainPage\.[A-Za-z]/.test(html) ||
      /PricingPage\.[A-Za-z]/.test(html)) {
    fail(`${label}: contains dotted untranslated i18n keys`)
  }
}

const sitemapPath = path.join(BUILD, 'sitemap.xml')
const robotsPath = path.join(BUILD, 'robots.txt')
const ogPath = path.join(BUILD, 'assets', 'og-default.png')

if (assertFileExists(sitemapPath, 'sitemap.xml')) {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8')
  assertContains(sitemap, SITE_HOST, 'sitemap.xml')
  assertNotContains(sitemap, FORBIDDEN_HOST, 'sitemap.xml')
}

if (assertFileExists(robotsPath, 'robots.txt')) {
  const robots = fs.readFileSync(robotsPath, 'utf8')
  assertContains(robots, SITE_HOST, 'robots.txt')
  assertNotContains(robots, FORBIDDEN_HOST, 'robots.txt')
}

assertFileExists(ogPath, 'og-default.png')

if (failures.length > 0) {
  console.error(`\nverify-prerender: ${failures.length} failure(s)`)
  process.exit(1)
}

console.log('verify-prerender: OK (4 routes + sitemap/robots + og-default.png)')
process.exit(0)
