/**
 * Generates documentation screenshots for public/docs/screenshots/.
 *
 * Default mode: high-fidelity HTML mocks rendered via Playwright (1280×800).
 * Live mode: pass --base-url=http://localhost:3000 to capture real pages (requires auth).
 *
 * Usage:
 *   npx ts-node scripts/capture-docs-screenshots.ts
 *   npx ts-node scripts/capture-docs-screenshots.ts --base-url=http://localhost:3000
 */
import fs from 'fs'
import path from 'path'
import { generateAllMockPngs } from './generate-mock-screenshots'

const OUTPUT_DIR = path.resolve(__dirname, '../public/docs/screenshots')
const VIEWPORT = { width: 1280, height: 800 }

interface MockSpec {
  title: string
  subtitle: string
  variant: 'dashboard' | 'modal' | 'table' | 'wizard' | 'playground'
}

const MOCKS: Record<string, MockSpec> = {
  dashboard: {
    title: 'Дашборд',
    subtitle: 'Обзор звонков и метрик',
    variant: 'dashboard'
  },
  'assistant-create': {
    title: 'Создание ассистента',
    subtitle: 'Выберите шаблон или опишите бизнес',
    variant: 'modal'
  },
  'assistant-publish-sip': {
    title: 'Публикация SIP',
    subtitle: 'Подключение транка и номера',
    variant: 'modal'
  },
  'tool-create': {
    title: 'Создание функции',
    subtitle: 'HTTP-инструмент для ассистента',
    variant: 'modal'
  },
  playground: {
    title: 'Playground',
    subtitle: 'Тестовый звонок с ассистентом',
    variant: 'playground'
  },
  'reports-history': {
    title: 'История звонков',
    subtitle: 'CDR и записи разговоров',
    variant: 'table'
  },
  'project-wizard': {
    title: 'Мастер проекта',
    subtitle: 'Речевая аналитика — новый проект',
    variant: 'wizard'
  },
  'operator-dashboard': {
    title: 'Дашборд оператора',
    subtitle: 'KPI и метрики качества',
    variant: 'dashboard'
  },
  upload: {
    title: 'Загрузка записей',
    subtitle: 'Импорт аудио для анализа',
    variant: 'wizard'
  },
  calls: {
    title: 'Звонки',
    subtitle: 'Журнал CDR',
    variant: 'table'
  },
  'knowledge-base': {
    title: 'Базы знаний',
    subtitle: 'RAG для ассистентов',
    variant: 'modal'
  },
  'sip-trunks': {
    title: 'SIP Trunks',
    subtitle: 'Регистрация на АТС',
    variant: 'modal'
  },
  widgets: {
    title: 'Виджеты',
    subtitle: 'WebRTC на сайте',
    variant: 'modal'
  },
  'analytics-api': {
    title: 'API аналитики',
    subtitle: 'Токены и эндпоинты',
    variant: 'table'
  }
}

const LIVE_ROUTES: Record<string, string> = {
  dashboard: '/dashboard',
  'assistant-create': '/dashboard/assistants',
  'assistant-publish-sip': '/dashboard/assistants',
  'tool-create': '/dashboard/assistants',
  playground: '/dashboard/playground',
  'reports-history': '/dashboard/calls',
  'project-wizard': '/dashboard/operator-analytics',
  'operator-dashboard': '/dashboard/operator-analytics',
  upload: '/dashboard/operator-analytics',
  calls: '/dashboard/calls',
  'knowledge-base': '/dashboard/knowledge-bases',
  'sip-trunks': '/dashboard/publish/sip-trunks',
  widgets: '/dashboard/publish/widgets',
  'analytics-api': '/dashboard/operator-analytics/api'
}

function shellCss (): string {
  return `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f4f5f7;
      color: #1a1a2e;
      height: 800px;
      overflow: hidden;
    }
    .layout { display: flex; height: 100%; }
    .sidebar {
      width: 240px;
      background: linear-gradient(180deg, #1e1e2e 0%, #16162a 100%);
      padding: 24px 16px;
      flex-shrink: 0;
    }
    .logo { color: #fff; font-weight: 700; font-size: 18px; margin-bottom: 32px; }
    .nav-item {
      color: #a0a0b8;
      padding: 10px 12px;
      border-radius: 8px;
      margin-bottom: 4px;
      font-size: 14px;
    }
    .nav-item.active { background: rgba(79, 70, 229, 0.2); color: #fff; }
    .main { flex: 1; padding: 24px 32px; overflow: hidden; }
    .page-title { font-size: 24px; font-weight: 600; margin-bottom: 4px; }
    .page-sub { color: #6b7280; font-size: 14px; margin-bottom: 24px; }
    .card {
      background: #fff;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      padding: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }
    .btn-primary {
      background: #4f46e5;
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 10px 20px;
      font-size: 14px;
      font-weight: 500;
    }
    .btn-outline {
      background: #fff;
      color: #4f46e5;
      border: 1px solid #4f46e5;
      border-radius: 8px;
      padding: 10px 20px;
      font-size: 14px;
    }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
    .stat-value { font-size: 28px; font-weight: 700; color: #4f46e5; }
    .stat-label { font-size: 12px; color: #6b7280; margin-top: 4px; }
    .modal-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.4);
      display: flex; align-items: center; justify-content: center;
    }
    .modal { width: 520px; background: #fff; border-radius: 16px; padding: 28px; }
    .modal h2 { font-size: 20px; margin-bottom: 8px; }
    .field { margin: 16px 0; }
    .field label { display: block; font-size: 13px; color: #6b7280; margin-bottom: 6px; }
    .field input, .field select {
      width: 100%; padding: 10px 12px;
      border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px;
    }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { text-align: left; padding: 10px 12px; background: #f9fafb; color: #6b7280; font-weight: 500; }
    td { padding: 10px 12px; border-top: 1px solid #e5e7eb; }
    .badge { background: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 12px; font-size: 12px; }
    .wizard-steps { display: flex; gap: 8px; margin-bottom: 24px; }
    .step { flex: 1; height: 4px; border-radius: 2px; background: #e5e7eb; }
    .step.done { background: #4f46e5; }
    .playground-area {
      height: 320px; background: #1e1e2e; border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      color: #a0a0b8; font-size: 16px; margin-bottom: 16px;
    }
    .mic-btn {
      width: 64px; height: 64px; border-radius: 50%;
      background: #4f46e5; border: none;
      box-shadow: 0 4px 14px rgba(79,70,229,0.4);
    }
  `
}

function renderMockHtml (spec: MockSpec): string {
  const { title, subtitle, variant } = spec

  let bodyContent = ''

  if (variant === 'dashboard') {
    bodyContent = `
      <div class="page-title">${title}</div>
      <div class="page-sub">${subtitle}</div>
      <div class="grid-3">
        <div class="card"><div class="stat-value">1 247</div><div class="stat-label">Звонков за месяц</div></div>
        <div class="card"><div class="stat-value">94%</div><div class="stat-label">Успешных диалогов</div></div>
        <div class="card"><div class="stat-value">4.2</div><div class="stat-label">CSAT</div></div>
      </div>
      <div class="card" style="height:280px;display:flex;align-items:flex-end;gap:8px;padding-bottom:16px;">
        ${[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 50].map((h, i) =>
    `<div style="flex:1;background:linear-gradient(180deg,#818cf8,#4f46e5);height:${h}%;border-radius:4px 4px 0 0;opacity:${0.5 + i * 0.04}"></div>`
  ).join('')}
      </div>
    `
  } else if (variant === 'modal') {
    bodyContent = `
      <div class="page-title">${title}</div>
      <div class="page-sub">${subtitle}</div>
      <div class="modal-overlay">
        <div class="modal">
          <h2>${title}</h2>
          <p style="color:#6b7280;font-size:14px;margin-bottom:16px;">${subtitle}</p>
          <div class="field"><label>Название</label><input value="Ассистент продаж" /></div>
          <div class="field"><label>Описание</label><input value="Отвечает на вопросы о тарифах" /></div>
          <div style="display:flex;gap:12px;margin-top:24px;">
            <button class="btn-primary">Создать</button>
            <button class="btn-outline">Отмена</button>
          </div>
        </div>
      </div>
    `
  } else if (variant === 'table') {
    bodyContent = `
      <div class="page-title">${title}</div>
      <div class="page-sub">${subtitle}</div>
      <div class="card">
        <table>
          <thead><tr><th>Дата</th><th>Номер</th><th>Длительность</th><th>Статус</th></tr></thead>
          <tbody>
            <tr><td>25.06.2026 14:32</td><td>+7 999 123-45-67</td><td>3:42</td><td><span class="badge">Успех</span></td></tr>
            <tr><td>25.06.2026 13:15</td><td>+7 999 987-65-43</td><td>1:18</td><td><span class="badge">Успех</span></td></tr>
            <tr><td>25.06.2026 11:08</td><td>+7 495 111-22-33</td><td>5:01</td><td><span class="badge">Успех</span></td></tr>
            <tr><td>24.06.2026 18:44</td><td>+7 916 555-00-11</td><td>2:27</td><td><span class="badge">Успех</span></td></tr>
          </tbody>
        </table>
      </div>
    `
  } else if (variant === 'wizard') {
    bodyContent = `
      <div class="page-title">${title}</div>
      <div class="page-sub">${subtitle}</div>
      <div class="wizard-steps">
        <div class="step done"></div><div class="step done"></div><div class="step"></div><div class="step"></div>
      </div>
      <div class="card" style="max-width:640px;">
        <div class="field"><label>Название проекта</label><input value="Контакт-центр Q2" /></div>
        <div class="field"><label>Тип анализа</label><select><option>Операторская аналитика</option></select></div>
        <div class="field"><label>Файлы</label>
          <div style="border:2px dashed #d1d5db;border-radius:8px;padding:32px;text-align:center;color:#6b7280;">
            Перетащите аудиофайлы или нажмите для выбора
          </div>
        </div>
        <button class="btn-primary" style="margin-top:16px;">Продолжить</button>
      </div>
    `
  } else if (variant === 'playground') {
    bodyContent = `
      <div class="page-title">${title}</div>
      <div class="page-sub">${subtitle}</div>
      <div class="playground-area">🎙 Нажмите для начала тестового звонка</div>
      <div style="display:flex;align-items:center;gap:16px;">
        <button class="mic-btn"></button>
        <span style="color:#6b7280;font-size:14px;">Ассистент «Продажи» готов к разговору</span>
      </div>
    `
  }

  const navItems = ['Дашборд', 'Ассистенты', 'Playground', 'Звонки', 'Аналитика']
  const activeNav = title.includes('ассистент') || title.includes('Playground') || title.includes('SIP') || title.includes('функци')
    ? 'Ассистенты'
    : title.includes('оператор') || title.includes('проект') || title.includes('Загрузка')
      ? 'Аналитика'
      : 'Дашборд'

  return `<!DOCTYPE html><html><head><style>${shellCss()}</style></head><body>
    <div class="layout">
      <aside class="sidebar">
        <div class="logo">aiPBX</div>
        ${navItems.map((item) =>
    `<div class="nav-item${item === activeNav ? ' active' : ''}">${item}</div>`
  ).join('')}
      </aside>
      <main class="main">${bodyContent}</main>
    </div>
  </body></html>`
}

async function captureWithPlaywright (baseUrl?: string): Promise<boolean> {
  try {
    const { chromium } = await import('playwright')
    const browser = await chromium.launch({ headless: true })
    const page = await browser.newPage({ viewport: VIEWPORT })

    if (baseUrl) {
      for (const [filename, route] of Object.entries(LIVE_ROUTES)) {
        try {
          await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle', timeout: 15000 })
          await page.screenshot({ path: path.join(OUTPUT_DIR, `${filename}.png`) })
          console.log(`✓ ${filename}.png (live)`)
        } catch {
          console.warn(`⚠ Live capture failed for ${filename}, using HTML mock`)
          const spec = MOCKS[filename]
          if (spec) {
            await page.setContent(renderMockHtml(spec), { waitUntil: 'networkidle' })
            await page.screenshot({ path: path.join(OUTPUT_DIR, `${filename}.png`) })
            console.log(`✓ ${filename}.png (html mock)`)
          }
        }
      }
    } else {
      for (const [filename, spec] of Object.entries(MOCKS)) {
        await page.setContent(renderMockHtml(spec), { waitUntil: 'networkidle' })
        await page.screenshot({ path: path.join(OUTPUT_DIR, `${filename}.png`) })
        console.log(`✓ ${filename}.png`)
      }
    }

    await browser.close()
    return true
  } catch (err) {
    console.warn('Playwright unavailable, using pure-Node PNG fallback:', (err as Error).message)
    return false
  }
}

async function main (): Promise<void> {
  const baseUrlArg = process.argv.find((a) => a.startsWith('--base-url='))
  const baseUrl = baseUrlArg?.split('=')[1]
  const forceNode = process.argv.includes('--node-only')

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  let ok = false
  if (!forceNode) {
    console.log(baseUrl ? `Capturing from ${baseUrl}...` : 'Generating UI mocks via Playwright (1280×800)...')
    ok = await captureWithPlaywright(baseUrl)
  }

  if (!ok) {
    console.log('Generating high-fidelity static mocks (1280×800, pure Node)...')
    const files = generateAllMockPngs(OUTPUT_DIR)
    files.forEach((f) => { console.log(`✓ ${f}`) })
    for (const filename of Object.keys(MOCKS)) {
      if (!files.includes(`${filename}.png`)) {
        console.warn(`⚠ Missing mock PNG for ${filename} — add to generate-mock-screenshots.ts`)
      }
    }
  }

  console.log(`\nDone — screenshots in ${OUTPUT_DIR}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
