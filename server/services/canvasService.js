import { createCanvas, loadImage } from 'canvas'

// ─── HELPERS ────────────────────────────────────────

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16)
  const g = parseInt(hex.slice(3,5),16)
  const b = parseInt(hex.slice(5,7),16)
  return `${r},${g},${b}`
}

function drawRoundedRect(ctx, x, y, w, h, r, fill, stroke) {
  ctx.beginPath()
  ctx.moveTo(x+r, y)
  ctx.lineTo(x+w-r, y)
  ctx.quadraticCurveTo(x+w, y, x+w, y+r)
  ctx.lineTo(x+w, y+h-r)
  ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h)
  ctx.lineTo(x+r, y+h)
  ctx.quadraticCurveTo(x, y+h, x, y+h-r)
  ctx.lineTo(x, y+r)
  ctx.quadraticCurveTo(x, y, x+r, y)
  ctx.closePath()
  if (fill) { ctx.fillStyle = fill; ctx.fill() }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.5; ctx.stroke() }
}

function addNoise(ctx, w, h) {
  for (let i = 0; i < 12000; i++) {
    const x = Math.random() * w
    const y = Math.random() * h
    const a = Math.random() * 0.045
    ctx.fillStyle = `rgba(255,255,255,${a})`
    ctx.fillRect(x, y, 1, 1)
  }
}

function drawGradientBg(ctx, w, h, colors) {
  const g = ctx.createLinearGradient(0, 0, w, h)
  colors.forEach((c, i) => g.addColorStop(i / (colors.length-1), c))
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
}

function drawGlow(ctx, x, y, r, hex, alpha) {
  const rgb = hexToRgb(hex)
  const g = ctx.createRadialGradient(x, y, 0, x, y, r)
  g.addColorStop(0, `rgba(${rgb},${alpha})`)
  g.addColorStop(1, `rgba(${rgb},0)`)
  ctx.fillStyle = g
  ctx.fillRect(x-r, y-r, r*2, r*2)
}

async function placePhoto(ctx, buffer, cx, cy, radius, borderHex) {
  const img = await loadImage(buffer)
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.closePath()
  ctx.clip()
  const aspect = img.width / img.height
  let dw, dh, dx, dy
  if (aspect >= 1) {
    dh = radius * 2
    dw = dh * aspect
    dx = cx - radius - (dw - dh) / 2
    dy = cy - radius
  } else {
    dw = radius * 2
    dh = dw / aspect
    dx = cx - radius
    dy = cy - radius - (dh - dw) / 2
  }
  ctx.drawImage(img, dx, dy, dw, dh)
  ctx.restore()
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.strokeStyle = borderHex
  ctx.lineWidth = 5
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(cx, cy, radius + 10, 0, Math.PI * 2)
  ctx.strokeStyle = `rgba(${hexToRgb(borderHex)},0.25)`
  ctx.lineWidth = 1.5
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(cx, cy, radius + 20, 0, Math.PI * 2)
  ctx.strokeStyle = `rgba(${hexToRgb(borderHex)},0.10)`
  ctx.lineWidth = 1
  ctx.stroke()
}

function drawMonogram(ctx, name, cx, cy, radius, accent1, accent2, textColor) {
  const g = ctx.createLinearGradient(cx-radius, cy-radius, cx+radius, cy+radius)
  g.addColorStop(0, accent1)
  g.addColorStop(1, accent2)
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.fillStyle = g
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.strokeStyle = `rgba(255,255,255,0.3)`
  ctx.lineWidth = 3
  ctx.stroke()
  const parts = name.trim().split(' ')
  const initials = parts.length >= 2
    ? parts[0][0].toUpperCase() + parts[1][0].toUpperCase()
    : parts[0].slice(0,2).toUpperCase()
  ctx.fillStyle = textColor
  ctx.font = `bold ${Math.floor(radius * 0.8)}px Arial`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(initials, cx, cy)
}

function pillRow(ctx, skills, startX, y, accentHex, textHex) {
  let x = startX
  const rgb = hexToRgb(accentHex)
  skills.slice(0,3).forEach(skill => {
    ctx.font = '500 14px Arial'
    const tw = ctx.measureText(skill).width
    const pw = tw + 24
    const ph = 28
    drawRoundedRect(ctx, x, y - 20, pw, ph, 14,
      `rgba(${rgb},0.15)`,
      `rgba(${rgb},0.5)`)
    ctx.fillStyle = accentHex
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText(skill, x + 12, y + 3)
    x += pw + 10
  })
}

// ─── STYLE CONFIG ───────────────────────────────────

const STYLES = {
  founder: {
    bg: ['#0F0C29','#302B63','#24243e'],
    a1: '#7C3AED', a2: '#3B82F6',
    text: '#FFFFFF', sub: '#C4B5FD',
    tag: 'BUILDING THE FUTURE'
  },
  developer: {
    bg: ['#0a0a0a','#0d1117','#1a2332'],
    a1: '#00FF41', a2: '#00B4D8',
    text: '#E6EDF3', sub: '#8B949E',
    tag: 'SHIPPING CLEAN CODE'
  },
  creator: {
    bg: ['#1a0533','#2d1b4e','#1a0533'],
    a1: '#F97316', a2: '#EC4899',
    text: '#FFFFFF', sub: '#FED7AA',
    tag: 'CREATING WHAT MATTERS'
  },
  corporate: {
    bg: ['#0a0f1e','#0f1e3d','#0a1628'],
    a1: '#E2B96F', a2: '#C9A84C',
    text: '#FFFFFF', sub: '#CBD5E1',
    tag: 'EXCELLENCE IN EVERY DETAIL'
  },
  minimalist: {
    bg: ['#F8FAFC','#F1F5F9','#E2E8F0'],
    a1: '#0F172A', a2: '#334155',
    text: '#0F172A', sub: '#475569',
    tag: 'LESS. BUT BETTER.'
  }
}

// ─── LINKEDIN BANNER  1584 x 396 ────────────────────

export async function generateLinkedInBanner(userData, selfieBuffer) {
  const { name='', title='', stylePreset='founder', skills=[] } = userData
  const s = STYLES[stylePreset] || STYLES.founder
  const canvas = createCanvas(1584, 396)
  const ctx = canvas.getContext('2d')

  drawGradientBg(ctx, 1584, 396, s.bg)
  drawGlow(ctx, 1400, 0,   400, s.a1, 0.18)
  drawGlow(ctx, 0,   400,  300, s.a2, 0.12)
  addNoise(ctx, 1584, 396)

  // left accent bar
  const barG = ctx.createLinearGradient(0, 60, 0, 260)
  barG.addColorStop(0, s.a1)
  barG.addColorStop(1, `rgba(${hexToRgb(s.a1)},0)`)
  ctx.fillStyle = barG
  ctx.fillRect(68, 60, 4, 200)

  // tag line
  ctx.fillStyle = s.a1
  ctx.font = '600 12px Arial'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText(s.tag, 90, 72)

  // name
  const namePx = name.length > 18 ? 48 : 62
  ctx.fillStyle = s.text
  ctx.font = `bold ${namePx}px Arial`
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(name, 90, 178)

  // underline
  const nw = ctx.measureText(name).width
  const ulG = ctx.createLinearGradient(90, 0, 90 + nw * 0.55, 0)
  ulG.addColorStop(0, s.a1)
  ulG.addColorStop(1, s.a2)
  ctx.fillStyle = ulG
  ctx.fillRect(90, 188, nw * 0.55, 3)

  // title
  ctx.fillStyle = s.sub
  ctx.font = '300 24px Arial'
  ctx.fillText(title, 92, 225)

  // skills
  if (skills.length) pillRow(ctx, skills, 90, 278, s.a1, s.text)

  // right side
  if (selfieBuffer) {
    await placePhoto(ctx, selfieBuffer, 1320, 198, 140, s.a1)
  } else {
    drawMonogram(ctx, name, 1320, 198, 140, s.a1, s.a2, s.text)
  }

  // bottom line
  const blG = ctx.createLinearGradient(0, 0, 1584, 0)
  blG.addColorStop(0,   'rgba(255,255,255,0)')
  blG.addColorStop(0.3, s.a1)
  blG.addColorStop(0.7, s.a2)
  blG.addColorStop(1,   'rgba(255,255,255,0)')
  ctx.fillStyle = blG
  ctx.fillRect(0, 391, 1584, 3)

  ctx.fillStyle = 'rgba(255,255,255,0.2)'
  ctx.font = '11px Arial'
  ctx.textAlign = 'right'
  ctx.fillText('brandzip.co', 1574, 382)

  return canvas.toBuffer('image/png').toString('base64')
}

// ─── TWITTER BANNER  1500 x 500 ─────────────────────

export async function generateTwitterBanner(userData, selfieBuffer) {
  const { name='', title='', stylePreset='founder', skills=[], taglines=[] } = userData
  const s = STYLES[stylePreset] || STYLES.founder
  const canvas = createCanvas(1500, 500)
  const ctx = canvas.getContext('2d')

  drawGradientBg(ctx, 1500, 500, s.bg)
  drawGlow(ctx, 750, 250, 500, s.a1, 0.10)
  drawGlow(ctx, 0,   500, 250, s.a2, 0.12)
  addNoise(ctx, 1500, 500)

  let textStartX = 100

  if (selfieBuffer) {
    await placePhoto(ctx, selfieBuffer, 240, 240, 155, s.a1)
    textStartX = 450
    // separator line
    const sepG = ctx.createLinearGradient(415, 80, 415, 420)
    sepG.addColorStop(0, 'rgba(255,255,255,0)')
    sepG.addColorStop(0.5, `rgba(${hexToRgb(s.a1)},0.4)`)
    sepG.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = sepG
    ctx.fillRect(415, 80, 2, 340)
  }

  // name
  const namePx = name.length > 16 ? 52 : 68
  ctx.fillStyle = s.text
  ctx.font = `bold ${namePx}px Arial`
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(name, textStartX, 230)

  const nw = ctx.measureText(name).width
  const ulG = ctx.createLinearGradient(textStartX, 0, textStartX + nw * 0.5, 0)
  ulG.addColorStop(0, s.a1); ulG.addColorStop(1, s.a2)
  ctx.fillStyle = ulG
  ctx.fillRect(textStartX, 244, nw * 0.5, 4)

  ctx.fillStyle = s.sub
  ctx.font = '300 26px Arial'
  ctx.fillText(title, textStartX, 286)

  if (taglines && taglines[0]) {
    ctx.fillStyle = s.a1
    ctx.font = 'italic 400 17px Arial'
    ctx.fillText(`"${taglines[0]}"`, textStartX, 328)
  }

  // bottom strip
  const stripG = ctx.createLinearGradient(0, 0, 1500, 0)
  stripG.addColorStop(0, s.a1 + 'DD')
  stripG.addColorStop(1, s.a2 + 'DD')
  ctx.fillStyle = stripG
  ctx.fillRect(0, 440, 1500, 60)

  const stripInfo = [skills[0], skills[1], skills[2]].filter(Boolean).join('  ·  ')
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.font = '500 14px Arial'
  ctx.textAlign = 'left'
  ctx.fillText(stripInfo, 40, 477)
  ctx.textAlign = 'right'
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.fillText('brandzip.co', 1460, 477)

  return canvas.toBuffer('image/png').toString('base64')
}

// ─── QUOTE GRAPHIC  1080 x 1080 ─────────────────────

export async function generateQuoteGraphic(userData, tagline, selfieBuffer) {
  const { name='', title='', stylePreset='founder' } = userData
  const s = STYLES[stylePreset] || STYLES.founder
  const canvas = createCanvas(1080, 1080)
  const ctx = canvas.getContext('2d')

  drawGradientBg(ctx, 1080, 1080, s.bg)
  drawGlow(ctx, 0,    0,    500, s.a1, 0.15)
  drawGlow(ctx, 1080, 1080, 500, s.a2, 0.12)
  drawGlow(ctx, 1080, 0,    400, s.a1, 0.08)
  addNoise(ctx, 1080, 1080)

  // big quote mark
  ctx.fillStyle = `rgba(${hexToRgb(s.a1)},0.08)`
  ctx.font = 'bold 320px Arial'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText('\u201C', 30, 60)

  // quote box
  drawRoundedRect(ctx, 80, 340, 920, 320, 20,
    'rgba(255,255,255,0.04)',
    `rgba(${hexToRgb(s.a1)},0.25)`)

  // quote text — wrap manually
  const quoteText = tagline || s.tag
  ctx.fillStyle = s.text
  ctx.font = 'bold 42px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  const words = quoteText.split(' ')
  const maxW = 820
  let line = '', lines = [], testY = 380
  for (const word of words) {
    const test = line + (line ? ' ' : '') + word
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line); line = word
    } else { line = test }
  }
  lines.push(line)
  const lineH = 58
  const totalH = lines.length * lineH
  let ly = 500 - totalH / 2
  for (const l of lines) { ctx.fillText(l, 540, ly); ly += lineH }

  // accent line
  const alG = ctx.createLinearGradient(390, 0, 690, 0)
  alG.addColorStop(0, s.a1); alG.addColorStop(1, s.a2)
  ctx.fillStyle = alG
  ctx.fillRect(390, 680, 300, 3)

  // author
  if (selfieBuffer) {
    await placePhoto(ctx, selfieBuffer, 430, 770, 40, s.a1)
    ctx.fillStyle = s.text
    ctx.font = 'bold 22px Arial'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText(name, 485, 762)
    ctx.fillStyle = s.sub
    ctx.font = '400 16px Arial'
    ctx.fillText(title, 485, 788)
  } else {
    ctx.fillStyle = s.text
    ctx.font = 'bold 22px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(name, 540, 755)
    ctx.fillStyle = s.sub
    ctx.font = '400 16px Arial'
    ctx.fillText(title, 540, 782)
  }

  ctx.fillStyle = 'rgba(255,255,255,0.15)'
  ctx.font = '11px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('brandzip.co', 540, 1060)

  return canvas.toBuffer('image/png').toString('base64')
}

// ─── BUSINESS CARD  1050 x 600 ──────────────────────

export async function generateBusinessCard(userData, selfieBuffer) {
  const { name='', title='', stylePreset='founder',
          skills=[], oneLiner='', email='' } = userData
  const s = STYLES[stylePreset] || STYLES.founder
  const canvas = createCanvas(1050, 600)
  const ctx = canvas.getContext('2d')

  // full background
  drawGradientBg(ctx, 1050, 600, s.bg)
  addNoise(ctx, 1050, 600)

  // LEFT PANEL solid overlay
  const lpG = ctx.createLinearGradient(0, 0, 420, 600)
  lpG.addColorStop(0, s.a1 + 'EE')
  lpG.addColorStop(1, s.a2 + 'CC')
  ctx.fillStyle = lpG
  ctx.fillRect(0, 0, 420, 600)

  drawGlow(ctx, 210, 300, 280, '#ffffff', 0.06)

  if (selfieBuffer) {
    await placePhoto(ctx, selfieBuffer, 210, 240, 130, '#FFFFFF')
    ctx.fillStyle = 'rgba(255,255,255,0.95)'
    ctx.font = 'bold 22px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'alphabetic'
    ctx.fillText(name, 210, 405)
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.font = '300 15px Arial'
    ctx.fillText(title, 210, 428)
  } else {
    drawMonogram(ctx, name, 210, 240, 130, 
      'rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)', '#FFFFFF')
    ctx.fillStyle = 'rgba(255,255,255,0.95)'
    ctx.font = 'bold 22px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(name, 210, 405)
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.font = '300 15px Arial'
    ctx.fillText(title, 210, 428)
  }

  // divider
  const divG = ctx.createLinearGradient(420, 0, 420, 600)
  divG.addColorStop(0,   'rgba(255,255,255,0)')
  divG.addColorStop(0.5, 'rgba(255,255,255,0.2)')
  divG.addColorStop(1,   'rgba(255,255,255,0)')
  ctx.fillStyle = divG
  ctx.fillRect(419, 0, 2, 600)

  // RIGHT PANEL
  const rx = 460
  ctx.fillStyle = s.a1
  ctx.font = '600 11px Arial'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText(
    (userData.industry || 'PROFESSIONAL').toUpperCase(),
    rx, 70)

  ctx.fillStyle = s.text
  ctx.font = `bold 34px Arial`
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(name, rx, 150)

  ctx.fillStyle = s.sub
  ctx.font = '300 20px Arial'
  ctx.fillText(title, rx, 185)

  const alG2 = ctx.createLinearGradient(rx, 0, rx+240, 0)
  alG2.addColorStop(0, s.a1); alG2.addColorStop(1, s.a2)
  ctx.fillStyle = alG2
  ctx.fillRect(rx, 200, 240, 2)

  if (email) {
    ctx.beginPath()
    ctx.arc(rx + 6, 244, 4, 0, Math.PI*2)
    ctx.fillStyle = s.a1
    ctx.fill()
    ctx.fillStyle = s.sub
    ctx.font = '400 15px Arial'
    ctx.fillText(email, rx + 18, 249)
  }

  if (skills.length) pillRow(ctx, skills, rx, 310, s.a1, s.text)

  ctx.fillStyle = s.a1
  ctx.font = 'italic 400 13px Arial'
  ctx.fillText(`"${s.tag.toLowerCase()}"`, rx, 380)

  // corner arcs
  for (const r of [70, 90, 110]) {
    ctx.beginPath()
    ctx.arc(1050, 600, r, Math.PI, Math.PI * 1.5)
    ctx.strokeStyle = `rgba(${hexToRgb(s.a1)},0.2)`
    ctx.lineWidth = 1.5
    ctx.stroke()
  }

  return canvas.toBuffer('image/png').toString('base64')
}

// ─── PROFILE PICTURE  600 x 600 ─────────────────────

export async function generateProfilePicture(userData, selfieBuffer) {
  const { name='', title='', stylePreset='founder' } = userData
  const s = STYLES[stylePreset] || STYLES.founder
  const canvas = createCanvas(600, 600)
  const ctx = canvas.getContext('2d')

  drawGradientBg(ctx, 600, 600, s.bg)
  drawGlow(ctx, 300, 300, 350, s.a1, 0.18)
  drawGlow(ctx, 0,   0,   200, s.a2, 0.10)
  drawGlow(ctx, 600, 600, 200, s.a1, 0.10)
  addNoise(ctx, 600, 600)

  // decorative rings
  for (const [r, alpha] of [[275,0.10],[258,0.18],[240,0.30]]) {
    ctx.beginPath()
    ctx.arc(300, 270, r, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(${hexToRgb(s.a1)},${alpha})`
    ctx.lineWidth = r === 240 ? 2 : 1
    ctx.stroke()
  }

  // photo or monogram
  if (selfieBuffer) {
    await placePhoto(ctx, selfieBuffer, 300, 270, 200, s.a1)
  } else {
    drawMonogram(ctx, name, 300, 270, 200, s.a1, s.a2, s.text)
  }

  // diamond decorations at cardinal points
  const diamonds = [[300,42],[558,270],[300,498],[42,270]]
  for (const [dx, dy] of diamonds) {
    ctx.save()
    ctx.translate(dx, dy)
    ctx.rotate(Math.PI / 4)
    ctx.fillStyle = s.a1
    ctx.fillRect(-5, -5, 10, 10)
    ctx.restore()
  }

  // name/title pill
  drawRoundedRect(ctx, 90, 492, 420, 78, 16,
    'rgba(0,0,0,0.40)',
    `rgba(${hexToRgb(s.a1)},0.35)`)
  ctx.fillStyle = s.text
  ctx.font = 'bold 22px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(name, 300, 522)
  ctx.fillStyle = s.sub
  ctx.font = '400 14px Arial'
  ctx.fillText(title, 300, 547)

  return canvas.toBuffer('image/png').toString('base64')
}
