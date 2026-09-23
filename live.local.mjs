import pw from './node_modules/playwright/index.js'
const { chromium } = pw
const OUT = process.argv[2]
const b = await chromium.launch()
const ctx = await b.newContext({ viewport: { width: 1440, height: 950 } })
const p = await ctx.newPage()

const bad = []
p.on('response', r => {
  const u = r.url()
  if (/\.(css|js|woff2)(\?|$)/.test(u)) {
    const ct = r.headers()['content-type'] || ''
    const wanted = u.includes('.css') ? 'css' : u.includes('.js') ? 'javascript' : 'font'
    if (!ct.includes(wanted)) bad.push(`${r.status()} ${ct} <- ${u.split('/').pop()}`)
  }
})
const errs = []
p.on('pageerror', e => errs.push(e.message))
p.on('console', m => { if (m.type() === 'error') errs.push(m.text()) })

await p.goto('https://geniewep.vercel.app/', { waitUntil: 'networkidle', timeout: 60000 })
await p.waitForTimeout(1500)

const state = await p.evaluate(() => {
  const body = getComputedStyle(document.body)
  const h1 = document.querySelector('main h1')
  return {
    bg: body.backgroundColor,
    font: body.fontFamily.split(',')[0].replace(/"/g, ''),
    sheets: document.styleSheets.length,
    rules: [...document.styleSheets].reduce((n, s) => { try { return n + s.cssRules.length } catch { return n } }, 0),
    h1px: h1 ? Math.round(parseFloat(getComputedStyle(h1).fontSize)) : null,
    theme: document.documentElement.dataset.theme,
  }
})
console.log('LIVE SITE, fresh browser, no cache')
console.log('  body background :', state.bg)
console.log('  body font       :', state.font)
console.log('  stylesheets     :', state.sheets, '(' + state.rules, 'rules)')
console.log('  h1 size         :', state.h1px + 'px')
console.log('  data-theme      :', state.theme)
console.log('  wrong mime type :', bad.length ? bad.join(' | ') : 'none')
console.log('  console errors  :', errs.length ? errs[0].slice(0, 70) : 'none')
await p.screenshot({ path: `${OUT}/live-home.png` })
await b.close()
