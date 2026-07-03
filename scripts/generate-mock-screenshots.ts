/**
 * Pure-Node PNG generator for documentation screenshots (no browser required).
 * Used as fallback when Playwright browsers are unavailable.
 */
import fs from 'fs'
import path from 'path'
import { deflateSync } from 'zlib'

const WIDTH = 1280
const HEIGHT = 800

type Rgb = [number, number, number]

interface MockLayout {
  title: string
  sidebarActive: number
  variant: 'dashboard' | 'modal' | 'table' | 'wizard' | 'playground'
}

const MOCKS: Record<string, MockLayout> = {
  dashboard: { title: 'Dashboard', sidebarActive: 0, variant: 'dashboard' },
  'assistant-create': { title: 'Create Assistant', sidebarActive: 1, variant: 'modal' },
  'assistant-publish-sip': { title: 'Publish SIP', sidebarActive: 1, variant: 'modal' },
  'tool-create': { title: 'Create Tool', sidebarActive: 1, variant: 'modal' },
  playground: { title: 'Playground', sidebarActive: 2, variant: 'playground' },
  'reports-history': { title: 'Call History', sidebarActive: 3, variant: 'table' },
  'project-wizard': { title: 'Project Wizard', sidebarActive: 4, variant: 'wizard' },
  'operator-dashboard': { title: 'Operator Dashboard', sidebarActive: 4, variant: 'dashboard' },
  upload: { title: 'Upload Records', sidebarActive: 4, variant: 'wizard' },
  calls: { title: 'Calls', sidebarActive: 3, variant: 'table' },
  'knowledge-base': { title: 'Knowledge Bases', sidebarActive: 1, variant: 'modal' },
  'sip-trunks': { title: 'SIP Trunks', sidebarActive: 1, variant: 'modal' },
  widgets: { title: 'Widgets', sidebarActive: 1, variant: 'modal' },
  'analytics-api': { title: 'Analytics API', sidebarActive: 4, variant: 'table' }
}

const SIDEBAR: Rgb = [30, 30, 46]
const BG: Rgb = [244, 245, 247]
const CARD: Rgb = [255, 255, 255]
const PRIMARY: Rgb = [79, 70, 229]
const TEXT: Rgb = [26, 26, 46]
const MUTED: Rgb = [107, 114, 128]
const BORDER: Rgb = [229, 231, 235]
const DARK: Rgb = [30, 30, 46]

function setPixel (buf: Buffer, x: number, y: number, [r, g, b]: Rgb): void {
  if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT) return
  const i = (y * WIDTH + x) * 4
  buf[i] = r
  buf[i + 1] = g
  buf[i + 2] = b
  buf[i + 3] = 255
}

function fillRect (buf: Buffer, x: number, y: number, w: number, h: number, color: Rgb): void {
  for (let py = y; py < y + h; py++) {
    for (let px = x; px < x + w; px++) {
      setPixel(buf, px, py, color)
    }
  }
}

function fillRoundRect (buf: Buffer, x: number, y: number, w: number, h: number, color: Rgb, radius = 8): void {
  fillRect(buf, x + radius, y, w - radius * 2, h, color)
  fillRect(buf, x, y + radius, w, h - radius * 2, color)
  for (let py = y; py < y + radius; py++) {
    for (let px = x; px < x + w; px++) {
      const corners = [
        [x + radius, y + radius],
        [x + w - radius - 1, y + radius],
        [x + radius, y + h - radius - 1],
        [x + w - radius - 1, y + h - radius - 1]
      ]
      let inside = px >= x && px < x + w && py >= y && py < y + h
      for (const [cx, cy] of corners) {
        const dx = px - cx
        const dy = py - cy
        if (dx * dx + dy * dy > radius * radius) {
          if ((px < x + radius && py < y + radius) ||
              (px >= x + w - radius && py < y + radius) ||
              (px < x + radius && py >= y + h - radius) ||
              (px >= x + w - radius && py >= y + h - radius)) {
            inside = false
          }
        }
      }
      if (inside) setPixel(buf, px, py, color)
    }
  }
}

// Minimal 5×7 bitmap font for ASCII
const GLYPHS: Record<string, number[]> = {
  ' ': [0, 0, 0, 0, 0, 0, 0],
  A: [14, 17, 17, 31, 17, 17, 17],
  B: [30, 17, 17, 30, 17, 17, 30],
  C: [14, 17, 16, 16, 16, 17, 14],
  D: [30, 17, 17, 17, 17, 17, 30],
  E: [31, 16, 16, 30, 16, 16, 31],
  G: [14, 17, 16, 23, 17, 17, 14],
  H: [17, 17, 17, 31, 17, 17, 17],
  I: [14, 4, 4, 4, 4, 4, 14],
  L: [16, 16, 16, 16, 16, 16, 31],
  M: [17, 27, 21, 21, 17, 17, 17],
  N: [17, 25, 21, 19, 17, 17, 17],
  O: [14, 17, 17, 17, 17, 17, 14],
  P: [30, 17, 17, 30, 16, 16, 16],
  R: [30, 17, 17, 30, 20, 18, 17],
  S: [14, 17, 16, 14, 1, 17, 14],
  T: [31, 4, 4, 4, 4, 4, 4],
  U: [17, 17, 17, 17, 17, 17, 14],
  W: [17, 17, 17, 21, 21, 21, 10],
  Y: [17, 17, 10, 4, 4, 4, 4],
  a: [0, 0, 14, 1, 15, 17, 15],
  b: [16, 16, 30, 17, 17, 17, 30],
  c: [0, 0, 14, 17, 16, 17, 14],
  d: [1, 1, 15, 17, 17, 17, 15],
  e: [0, 0, 14, 17, 31, 16, 14],
  g: [0, 0, 15, 17, 15, 1, 14],
  h: [16, 16, 22, 25, 17, 17, 17],
  i: [4, 0, 12, 4, 4, 4, 14],
  l: [12, 4, 4, 4, 4, 4, 14],
  n: [0, 0, 22, 25, 17, 17, 17],
  o: [0, 0, 14, 17, 17, 17, 14],
  p: [0, 0, 30, 17, 17, 30, 16],
  r: [0, 0, 22, 24, 16, 16, 16],
  s: [0, 0, 14, 16, 14, 1, 30],
  t: [4, 4, 30, 4, 4, 5, 2],
  u: [0, 0, 17, 17, 17, 17, 15],
  w: [0, 0, 17, 17, 21, 21, 10],
  y: [0, 0, 17, 17, 15, 1, 14],
  '-': [0, 0, 0, 31, 0, 0, 0],
  0: [14, 17, 19, 21, 25, 17, 14],
  1: [4, 12, 4, 4, 4, 4, 14],
  2: [14, 17, 1, 2, 4, 8, 31],
  3: [14, 17, 1, 6, 1, 17, 14],
  4: [2, 6, 10, 18, 31, 2, 2],
  5: [31, 16, 30, 1, 1, 17, 14],
  6: [14, 17, 16, 30, 17, 17, 14],
  7: [31, 1, 2, 4, 4, 4, 4],
  8: [14, 17, 17, 14, 17, 17, 14],
  9: [14, 17, 17, 15, 1, 17, 14],
  '%': [17, 17, 2, 4, 8, 17, 17]
}

function drawText (buf: Buffer, text: string, x: number, y: number, color: Rgb, scale = 2): void {
  let cx = x
  for (const ch of text) {
    const glyph = GLYPHS[ch] ?? GLYPHS[' ']
    for (let row = 0; row < 7; row++) {
      const bits = glyph[row] ?? 0
      for (let col = 0; col < 5; col++) {
        if (bits & (1 << (4 - col))) {
          fillRect(buf, cx + col * scale, y + row * scale, scale, scale, color)
        }
      }
    }
    cx += 6 * scale
  }
}

function drawShell (buf: Buffer, layout: MockLayout): void {
  fillRect(buf, 0, 0, WIDTH, HEIGHT, BG)
  fillRect(buf, 0, 0, 240, HEIGHT, SIDEBAR)

  drawText(buf, 'aiPBX', 24, 28, [255, 255, 255], 2)

  const nav = ['Dashboard', 'Assistants', 'Playground', 'Calls', 'Analytics']
  nav.forEach((item, i) => {
    const y = 100 + i * 44
    if (i === layout.sidebarActive) {
      fillRoundRect(buf, 12, y - 4, 216, 36, [79, 70, 229], 8)
      drawText(buf, item, 24, y + 4, [255, 255, 255], 2)
    } else {
      drawText(buf, item, 24, y + 4, [160, 160, 184], 2)
    }
  })

  const mx = 272
  drawText(buf, layout.title, mx, 32, TEXT, 3)

  if (layout.variant === 'dashboard') {
    for (let i = 0; i < 3; i++) {
      fillRoundRect(buf, mx + i * 320, 100, 296, 100, CARD, 12)
      fillRect(buf, mx + i * 320, 100, 296, 1, BORDER)
      drawText(buf, ['1247', '94%', '4.2'][i], mx + 20 + i * 320, 130, PRIMARY, 3)
      drawText(buf, ['Calls', 'Success', 'CSAT'][i], mx + 20 + i * 320, 170, MUTED, 2)
    }
    fillRoundRect(buf, mx, 220, 960, 280, CARD, 12)
    for (let i = 0; i < 12; i++) {
      const h = [120, 200, 140, 240, 160, 260, 200, 230, 170, 210, 270, 150][i]
      fillRoundRect(buf, mx + 20 + i * 76, 220 + 280 - h, 56, h, [129, 140, 248], 4)
    }
  } else if (layout.variant === 'modal') {
    fillRect(buf, 0, 0, WIDTH, HEIGHT, [0, 0, 0])
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        setPixel(buf, x, y, [0, 0, 0])
      }
    }
    fillRect(buf, 0, 0, WIDTH, HEIGHT, [0, 0, 0])
    // semi-transparent overlay simulated
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 240; x < WIDTH; x++) {
        setPixel(buf, x, y, [180, 180, 190])
      }
    }
    fillRoundRect(buf, 380, 180, 520, 360, CARD, 16)
    drawText(buf, layout.title, 420, 220, TEXT, 3)
    fillRoundRect(buf, 420, 300, 440, 40, BG, 8)
    fillRect(buf, 420, 299, 440, 2, BORDER)
    drawText(buf, 'Name field', 430, 312, MUTED, 2)
    fillRoundRect(buf, 420, 360, 440, 40, BG, 8)
    fillRect(buf, 420, 359, 440, 2, BORDER)
    fillRoundRect(buf, 420, 440, 120, 44, PRIMARY, 8)
    drawText(buf, 'Create', 450, 454, [255, 255, 255], 2)
  } else if (layout.variant === 'table') {
    fillRoundRect(buf, mx, 100, 960, 400, CARD, 12)
    fillRect(buf, mx, 140, 960, 1, BORDER)
    const headers = ['Date', 'Number', 'Duration', 'Status']
    headers.forEach((h, i) => { drawText(buf, h, mx + 20 + i * 220, 115, MUTED, 2) })
    for (let row = 0; row < 4; row++) {
      const y = 160 + row * 50
      fillRect(buf, mx, y + 48, 960, 1, BORDER)
      drawText(buf, '2026-06-25', mx + 20, y + 12, TEXT, 2)
      drawText(buf, '+79991234567', mx + 240, y + 12, TEXT, 2)
      drawText(buf, '3:42', mx + 460, y + 12, TEXT, 2)
      fillRoundRect(buf, mx + 680, y + 8, 80, 28, [220, 252, 231], 14)
      drawText(buf, 'OK', mx + 700, y + 14, [22, 101, 52], 2)
    }
  } else if (layout.variant === 'wizard') {
    for (let i = 0; i < 4; i++) {
      fillRoundRect(buf, mx + i * 244, 100, 220, 4, i < 2 ? PRIMARY : BORDER, 2)
    }
    fillRoundRect(buf, mx, 130, 640, 360, CARD, 12)
    drawText(buf, 'Project name', mx + 24, 160, MUTED, 2)
    fillRoundRect(buf, mx + 24, 190, 580, 40, BG, 8)
    fillRect(buf, mx + 24, 189, 580, 2, BORDER)
    fillRoundRect(buf, mx + 24, 280, 580, 120, BG, 8)
    fillRect(buf, mx + 24, 279, 580, 2, BORDER)
    drawText(buf, 'Drop files here', mx + 200, 330, MUTED, 2)
    fillRoundRect(buf, mx + 24, 420, 140, 44, PRIMARY, 8)
    drawText(buf, 'Continue', mx + 44, 434, [255, 255, 255], 2)
  } else if (layout.variant === 'playground') {
    fillRoundRect(buf, mx, 100, 960, 320, DARK, 12)
    drawText(buf, 'Test call ready', mx + 340, 240, [160, 160, 184], 2)
    fillRoundRect(buf, mx + 20, 450, 64, 64, PRIMARY, 32)
    drawText(buf, 'Assistant ready', mx + 100, 470, MUTED, 2)
  }
}

function encodePng (pixels: Buffer): Buffer {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(WIDTH, 0)
  ihdr.writeUInt32BE(HEIGHT, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0

  const rowSize = 1 + WIDTH * 4
  const raw = Buffer.alloc(rowSize * HEIGHT)
  for (let y = 0; y < HEIGHT; y++) {
    raw[y * rowSize] = 0
    pixels.copy(raw, y * rowSize + 1, y * WIDTH * 4, (y + 1) * WIDTH * 4)
  }

  const chunk = (type: string, data: Buffer): Buffer => {
    const len = Buffer.alloc(4)
    len.writeUInt32BE(data.length, 0)
    const typeBuf = Buffer.from(type)
    const crc = crc32(Buffer.concat([typeBuf, data]))
    const crcBuf = Buffer.alloc(4)
    crcBuf.writeUInt32BE(crc >>> 0, 0)
    return Buffer.concat([len, typeBuf, data, crcBuf])
  }

  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0))
  ])
}

function crc32 (buf: Buffer): number {
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i]
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0)
    }
  }
  return (crc ^ 0xffffffff) >>> 0
}

export function generateMockPng (filename: string, outputDir: string): void {
  const layout = MOCKS[filename]
  if (!layout) throw new Error(`Unknown mock: ${filename}`)

  const pixels = Buffer.alloc(WIDTH * HEIGHT * 4)
  drawShell(pixels, layout)
  const png = encodePng(pixels)
  fs.writeFileSync(path.join(outputDir, `${filename}.png`), png)
}

export function generateAllMockPngs (outputDir: string): string[] {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  const files = Object.keys(MOCKS)
  for (const name of files) {
    generateMockPng(name, outputDir)
  }
  return files.map((f) => `${f}.png`)
}

if (require.main === module) {
  const out = path.resolve(__dirname, '../public/docs/screenshots')
  const files = generateAllMockPngs(out)
  console.log(`Generated ${files.length} PNG mocks in ${out}`)
  files.forEach((f) => { console.log(`  ✓ ${f}`) })
}
