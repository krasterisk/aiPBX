const fs = require('fs')
const path = require('path')

const BUILD = path.join(__dirname, '..', 'build')
const SITE_URL = process.env.SITE_URL || 'https://aipbx.net'
const SITE_HOST = 'aipbx.net'
const FORBIDDEN_HOST = 'aipbx.ru'
const EXPECT_EN = !SITE_URL.includes('aipbx.ru')
const CYRILLIC = /[а-яА-ЯёЁ]/

/** @type {Array<{ route: string, file: string, enTitle?: string }>} */
const ROUTES = [
  {
    route: '/',
    file: path.join(BUILD, 'index.html'),
    enTitle: 'AI Voice Assistant Platform'
  },
  {
    route: '/voice-assistants',
    file: path.join(BUILD, 'voice-assistants', 'index.html'),
    enTitle: 'AI Voice Assistant for Business'
  },
  {
    route: '/speech-analytics',
    file: path.join(BUILD, 'speech-analytics', 'index.html'),
    enTitle: 'Speech Analytics Software'
  },
  {
    route: '/pricing',
    file: path.join(BUILD, 'pricing', 'index.html'),
    enTitle: 'AI PBX Pricing'
  }
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

function extractTitle (html) {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i)
  return match ? match[1].trim() : ''
}

function extractMetaDescription (html) {
  const match = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i)
  return match ? match[1].trim() : ''
}

for (const { route, file, enTitle } of ROUTES) {
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
      /PricingPage\.[A-Za-z]/.test(html) ||
      /landing\.demoCta\./.test(html)) {
    fail(`${label}: contains dotted untranslated i18n keys`)
  }

  const title = extractTitle(html)
  if (/\.meta\.(title|description)/i.test(title) || /Page\.[A-Za-z]/.test(title)) {
    fail(`${label}: <title> looks like unresolved i18n key: "${title}"`)
  }

  if (EXPECT_EN) {
    const title = extractTitle(html)
    const description = extractMetaDescription(html)

    if (!title) {
      fail(`${label}: empty <title>`)
    } else {
      if (CYRILLIC.test(title)) {
        fail(`${label}: <title> contains Cyrillic (expected EN for ${SITE_URL}): "${title}"`)
      }
      if (enTitle && !title.includes(enTitle)) {
        fail(`${label}: <title> missing EN marker "${enTitle}" (got "${title}")`)
      }
    }

    if (description && CYRILLIC.test(description)) {
      fail(`${label}: meta description contains Cyrillic (expected EN for ${SITE_URL})`)
    }

    if (!/lang=["']en["']/i.test(html) && !/<html[^>]+lang=["']en/i.test(html)) {
      // soft signal — html lang may be set late; fail only if clearly ru
      if (/lang=["']ru["']/i.test(html)) {
        fail(`${label}: html lang is ru (expected en for ${SITE_URL})`)
      }
    }
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

console.log(`verify-prerender: OK (4 routes + sitemap/robots + og-default.png${EXPECT_EN ? ', EN meta' : ''})`)
process.exit(0)
