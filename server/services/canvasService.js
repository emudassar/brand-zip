import { createCanvas, loadImage, registerFont } from 'canvas'

const STYLES = {
  founder: {
    bg: ['#0D0D1A', '#1A1033', '#0D0D1A'],
    accent: '#7C3AED',
    accent2: '#3B82F6',
    text: '#FFFFFF',
    subtext: '#A78BFA',
    tag: 'STARTUP FOUNDER'
  },
  developer: {
    bg: ['#0A0F14', '#0D1821', '#0A0F14'],
    accent: '#22D3EE',
    accent2: '#10B981',
    text: '#E2E8F0',
    subtext: '#94A3B8',
    tag: 'SOFTWARE DEVELOPER'
  },
  creator: {
    bg: ['#1A0A00', '#2D1200', '#1A0A00'],
    accent: '#F97316',
    accent2: '#FBBF24',
    text: '#FFF7ED',
    subtext: '#FED7AA',
    tag: 'CONTENT CREATOR'
  },
  corporate: {
    bg: ['#05080F', '#0A1628', '#05080F'],
    accent: '#C9A84C',
    accent2: '#E2B96F',
    text: '#F8FAFC',
    subtext: '#CBD5E1',
    tag: 'PROFESSIONAL'
  },
  minimalist: {
    bg: ['#FAFAFA', '#F4F4F5', '#FAFAFA'],
    accent: '#18181B',
    accent2: '#52525B',
    text: '#18181B',
    subtext: '#52525B',
    tag: 'PROFESSIONAL'
  }
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16)
  const g = parseInt(hex.slice(3,5),16)
  const b = parseInt(hex.slice(5,7),16)
  return `${r},${g},${b}`
}

function drawBg(ctx, w, h, colors) {
  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, colors[0])
  g.addColorStop(0.5, colors[1])
  g.addColorStop(1, colors[2])
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
}

function addNoise(ctx, w, h) {
  for (let i = 0; i < 6000; i++) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.025})`
    ctx.fillRect(Math.random()*w, Math.random()*h, 1, 1)
  }
}

function drawGlow(ctx, x, y, r, hex, alpha) {
  const rgb = hexToRgb(hex)
  const g = ctx.createRadialGradient(x, y, 0, x, y, r)
  g.addColorStop(0, `rgba(${rgb},${alpha})`)
  g.addColorStop(1, `rgba(${rgb},0)`)
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fill()
}

function drawRoundedRect(ctx, x, y, w, h, r, fill, stroke, strokeWidth=1.5) {
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
  if (stroke) { 
    ctx.strokeStyle = stroke
    ctx.lineWidth = strokeWidth
    ctx.stroke() 
  }
}

function drawPills(ctx, skills, startX, y, accent) {
  let x = startX
  const rgb = hexToRgb(accent)
  ctx.font = '500 13px Arial'
  skills.slice(0,3).forEach(skill => {
    const tw = ctx.measureText(skill).width
    const pw = tw + 22
    const ph = 28
    drawRoundedRect(
      ctx, x, y, pw, ph, 14,
      `rgba(${rgb},0.12)`,
      `rgba(${rgb},0.6)`,
      1
    )
    ctx.fillStyle = accent
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText(skill, x + 11, y + 14)
    x += pw + 10
  })
}

async function placePhoto(ctx, buffer, cx, cy, radius, accent) {
  try {
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
    // outer glow ring
    ctx.beginPath()
    ctx.arc(cx, cy, radius + 14, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(${hexToRgb(accent)},0.15)`
    ctx.lineWidth = 1
    ctx.stroke()
    // main border
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    ctx.strokeStyle = accent
    ctx.lineWidth = 4
    ctx.stroke()
    // inner highlight
    ctx.beginPath()
    ctx.arc(cx, cy, radius - 7, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'
    ctx.lineWidth = 1
    ctx.stroke()
  } catch(e) {
    drawMonogram(ctx, '', cx, cy, radius, accent, accent, '#fff')
  }
}

function drawMonogram(ctx, name, cx, cy, radius, a1, a2, textColor) {
  const g = ctx.createLinearGradient(cx-radius, cy-radius, cx+radius, cy+radius)
  g.addColorStop(0, `rgba(${hexToRgb(a1)},0.35)`)
  g.addColorStop(1, `rgba(${hexToRgb(a2)},0.25)`)
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI*2)
  ctx.fillStyle = g
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI*2)
  ctx.strokeStyle = a1
  ctx.lineWidth = 3
  ctx.stroke()
  const parts = (name||'').trim().split(' ').filter(Boolean)
  const initials = parts.length >= 2
    ? parts[0][0].toUpperCase() + parts[1][0].toUpperCase()
    : (parts[0]||'?').slice(0,2).toUpperCase()
  ctx.fillStyle = textColor
  ctx.font = `bold ${Math.floor(radius*0.75)}px Arial`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(initials, cx, cy)
}

function drawAccentLine(ctx, x, y, width, accent) {
  const g = ctx.createLinearGradient(x, y, x+width, y)
  g.addColorStop(0, accent)
  g.addColorStop(1, `rgba(${hexToRgb(accent)},0)`)
  ctx.fillStyle = g
  ctx.fillRect(x, y, width, 3)
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ')
  const lines = []
  let line = ''
  for (const word of words) {
    const test = line ? line + ' ' + word : word
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}

// ── LINKEDIN BANNER 1584x396 ──────────────────────────

export async function generateLinkedInBanner(userData, selfieBuffer) {
  const { name='', title='', stylePreset='founder', skills=[] } = userData
  const s = STYLES[stylePreset] || STYLES.founder
  const W = 1584, H = 396
  const canvas = createCanvas(W, H)
  const ctx = canvas.getContext('2d')

  // background
  drawBg(ctx, W, H, s.bg)
  addNoise(ctx, W, H)

  // single subtle glow top-right only
  drawGlow(ctx, W, 0, 380, s.accent, 0.08)

  // left content block — anchor x=80
  const LX = 80

  // preset label
  ctx.fillStyle = s.accent
  ctx.font = '600 12px Arial'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText(s.tag, LX, 72)

  // accent dot before label
  ctx.beginPath()
  ctx.arc(LX - 16, 78, 4, 0, Math.PI * 2)
  ctx.fillStyle = s.accent
  ctx.fill()

  // name
  const namePx = name.length > 20 ? 46 : name.length > 14 ? 54 : 62
  ctx.fillStyle = s.text
  ctx.font = `bold ${namePx}px Arial`
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(name, LX, 178)

  // accent line under name — proportional width
  const nw = ctx.measureText(name).width
  drawAccentLine(ctx, LX, 188, Math.min(nw * 0.6, 320), s.accent)

  // title — 30px below name baseline
  ctx.fillStyle = s.subtext
  ctx.font = '300 23px Arial'
  ctx.fillText(title, LX, 225)

  // skills pills — 30px below title
  if (skills.length > 0) {
    drawPills(ctx, skills, LX, 255, s.accent)
  }

  // right photo — centered vertically, 120px from right edge
  const photoX = W - 220
  const photoY = H / 2
  const photoR = 130

  if (selfieBuffer) {
    await placePhoto(ctx, selfieBuffer, photoX, photoY, photoR, s.accent)
  } else {
    drawMonogram(ctx, name, photoX, photoY, photoR, s.accent, s.accent2, s.text)
  }

  // bottom full-width line
  const blG = ctx.createLinearGradient(0, 0, W, 0)
  blG.addColorStop(0, `rgba(${hexToRgb(s.accent)},0)`)
  blG.addColorStop(0.4, s.accent)
  blG.addColorStop(0.7, s.accent2)
  blG.addColorStop(1, `rgba(${hexToRgb(s.accent2)},0)`)
  ctx.fillStyle = blG
  ctx.fillRect(0, H - 4, W, 4)

  // watermark
  ctx.fillStyle = 'rgba(255,255,255,0.18)'
  ctx.font = '11px Arial'
  ctx.textAlign = 'right'
  ctx.textBaseline = 'bottom'
  ctx.fillText('brandzip.co', W - 20, H - 10)

  return canvas.toBuffer('image/png').toString('base64')
}

// ── TWITTER BANNER 1500x500 ───────────────────────────

export async function generateTwitterBanner(userData, selfieBuffer) {
  const { name='', title='', stylePreset='founder',
          skills=[], taglines=[] } = userData
  const s = STYLES[stylePreset] || STYLES.founder
  const W = 1500, H = 500
  const canvas = createCanvas(W, H)
  const ctx = canvas.getContext('2d')

  drawBg(ctx, W, H, s.bg)
  addNoise(ctx, W, H)
  drawGlow(ctx, 0, H, 320, s.accent2, 0.09)
  drawGlow(ctx, W, 0, 280, s.accent, 0.07)

  // photo LEFT side
  const photoX = 220
  const photoY = H / 2
  const photoR = 148

  if (selfieBuffer) {
    await placePhoto(ctx, selfieBuffer, photoX, photoY, photoR, s.accent)
  } else {
    drawMonogram(ctx, name, photoX, photoY, photoR, s.accent, s.accent2, s.text)
  }

  // vertical separator line
  const sepX = photoX + photoR + 60
  const sepG = ctx.createLinearGradient(0, 80, 0, H-80)
  sepG.addColorStop(0, `rgba(${hexToRgb(s.accent)},0)`)
  sepG.addColorStop(0.5, `rgba(${hexToRgb(s.accent)},0.35)`)
  sepG.addColorStop(1, `rgba(${hexToRgb(s.accent)},0)`)
  ctx.fillStyle = sepG
  ctx.fillRect(sepX, 80, 2, H - 160)

  // right content anchor
  const RX = sepX + 50
  const maxTextW = W - RX - 60

  // name
  const namePx = name.length > 18 ? 48 : 60
  ctx.fillStyle = s.text
  ctx.font = `bold ${namePx}px Arial`
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(name, RX, 220)

  const nw = ctx.measureText(name).width
  drawAccentLine(ctx, RX, 232, Math.min(nw * 0.55, 280), s.accent)

  // title
  ctx.fillStyle = s.subtext
  ctx.font = '300 24px Arial'
  ctx.fillText(title, RX, 272)

  // tagline
  if (taglines && taglines[0]) {
    ctx.fillStyle = `rgba(${hexToRgb(s.accent)},0.85)`
    ctx.font = 'italic 400 17px Arial'
    const tgLines = wrapText(ctx, `"${taglines[0]}"`, maxTextW)
    tgLines.slice(0,2).forEach((l, i) => {
      ctx.fillText(l, RX, 315 + i * 26)
    })
  }

  // bottom strip
  const stripG = ctx.createLinearGradient(0, 0, W, 0)
  stripG.addColorStop(0, `${s.accent}CC`)
  stripG.addColorStop(1, `${s.accent2}CC`)
  ctx.fillStyle = stripG
  ctx.fillRect(0, H - 58, W, 58)

  const stripSkills = skills.slice(0,3).filter(Boolean).join('   ·   ')
  ctx.fillStyle = 'rgba(255,255,255,0.88)'
  ctx.font = '500 14px Arial'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(stripSkills, 40, H - 29)

  ctx.fillStyle = 'rgba(255,255,255,0.45)'
  ctx.font = '400 13px Arial'
  ctx.textAlign = 'right'
  ctx.fillText('brandzip.co', W - 30, H - 29)

  return canvas.toBuffer('image/png').toString('base64')
}

// ── QUOTE GRAPHIC 1080x1080 ───────────────────────────

export async function generateQuoteGraphic(userData, tagline, selfieBuffer) {
  const { name='', title='', stylePreset='founder' } = userData
  const s = STYLES[stylePreset] || STYLES.founder
  const W = 1080, H = 1080
  const canvas = createCanvas(W, H)
  const ctx = canvas.getContext('2d')

  drawBg(ctx, W, H, s.bg)
  addNoise(ctx, W, H)
  drawGlow(ctx, W/2, H/2, 500, s.accent, 0.07)
  drawGlow(ctx, 0, H, 350, s.accent2, 0.08)

  // large faded quote mark
  ctx.fillStyle = `rgba(${hexToRgb(s.accent)},0.07)`
  ctx.font = 'bold 300px Arial'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText('\u201C', 50, 80)

  // quote box — centered
  const boxX = 80, boxY = 330
  const boxW = W - 160, boxH = 330
  drawRoundedRect(ctx, boxX, boxY, boxW, boxH, 20,
    `rgba(255,255,255,0.04)`,
    `rgba(${hexToRgb(s.accent)},0.22)`,
    1.5)

  // quote text inside box
  const quoteText = tagline || 'Building something people love'
  ctx.fillStyle = s.text
  ctx.font = `bold 40px Arial`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  const qLines = wrapText(ctx, quoteText, boxW - 80)
  const qLineH = 58
  const qTotalH = qLines.length * qLineH
  let qY = boxY + (boxH - qTotalH) / 2
  qLines.slice(0,4).forEach(l => {
    ctx.fillText(l, W/2, qY)
    qY += qLineH
  })

  // accent line below box
  const alW = 200
  const alG = ctx.createLinearGradient(W/2-alW/2, 0, W/2+alW/2, 0)
  alG.addColorStop(0, `rgba(${hexToRgb(s.accent)},0)`)
  alG.addColorStop(0.5, s.accent)
  alG.addColorStop(1, `rgba(${hexToRgb(s.accent)},0)`)
  ctx.fillStyle = alG
  ctx.fillRect(W/2 - alW/2, boxY + boxH + 30, alW, 3)

  // author row
  const authorY = boxY + boxH + 70
  const authorCX = W/2

  if (selfieBuffer) {
    // small photo left of name
    const photoR = 36
    const photoX = authorCX - 120
    await placePhoto(ctx, selfieBuffer, photoX, authorY + 20, photoR, s.accent)
    ctx.fillStyle = s.text
    ctx.font = 'bold 22px Arial'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText(name, photoX + photoR + 14, authorY + 12)
    ctx.fillStyle = s.subtext
    ctx.font = '400 16px Arial'
    ctx.fillText(title, photoX + photoR + 14, authorY + 38)
  } else {
    ctx.fillStyle = s.text
    ctx.font = 'bold 22px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText(name, authorCX, authorY)
    ctx.fillStyle = s.subtext
    ctx.font = '400 16px Arial'
    ctx.fillText(title, authorCX, authorY + 30)
  }

  ctx.fillStyle = `rgba(${hexToRgb(s.text)},0.15)`
  ctx.font = '11px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'bottom'
  ctx.fillText('brandzip.co', W/2, H - 24)

  return canvas.toBuffer('image/png').toString('base64')
}

// ── BUSINESS CARD 1050x600 ────────────────────────────

export async function generateBusinessCard(userData, selfieBuffer) {
  const { name='', title='', stylePreset='founder',
          skills=[], email='', industry='' } = userData
  const s = STYLES[stylePreset] || STYLES.founder
  const W = 1050, H = 600
  const canvas = createCanvas(W, H)
  const ctx = canvas.getContext('2d')

  // full background
  drawBg(ctx, W, H, s.bg)
  addNoise(ctx, W, H)

  // LEFT PANEL — accent gradient overlay
  const LP = 400
  const lpG = ctx.createLinearGradient(0, 0, LP, H)
  lpG.addColorStop(0, `rgba(${hexToRgb(s.accent)},0.28)`)
  lpG.addColorStop(1, `rgba(${hexToRgb(s.accent2)},0.18)`)
  ctx.fillStyle = lpG
  ctx.fillRect(0, 0, LP, H)

  // left panel border right edge
  const lpBG = ctx.createLinearGradient(0, 0, 0, H)
  lpBG.addColorStop(0, `rgba(${hexToRgb(s.accent)},0)`)
  lpBG.addColorStop(0.5, `rgba(${hexToRgb(s.accent)},0.5)`)
  lpBG.addColorStop(1, `rgba(${hexToRgb(s.accent)},0)`)
  ctx.fillStyle = lpBG
  ctx.fillRect(LP - 1, 0, 1, H)

  // photo centered in left panel
  const photoCX = LP / 2
  const photoCY = H / 2 - 30
  const photoR = 110

  if (selfieBuffer) {
    await placePhoto(ctx, selfieBuffer, photoCX, photoCY, photoR, '#FFFFFF')
  } else {
    drawMonogram(ctx, name, photoCX, photoCY, photoR, s.accent, s.accent2, s.text)
  }

  // name below photo in left panel
  ctx.fillStyle = s.text
  ctx.font = 'bold 20px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText(
    name.length > 18 ? name.split(' ')[0] : name,
    photoCX,
    photoCY + photoR + 18
  )

  // RIGHT PANEL content — anchor x=LP+45
  const RX = LP + 45

  // industry label
  ctx.fillStyle = s.accent
  ctx.font = '600 11px Arial'
  ctx.textAlign = 'left'
  ctx.fillText(
    (industry || 'PROFESSIONAL').toUpperCase(),
    RX, 70
  )

  // name large
  ctx.fillStyle = s.text
  ctx.font = `bold ${name.length > 16 ? 28 : 34}px Arial`
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(name, RX, 150)

  // title
  ctx.fillStyle = s.subtext
  ctx.font = '300 20px Arial'
  ctx.fillText(title, RX, 185)

  // accent divider
  drawAccentLine(ctx, RX, 202, 220, s.accent)

  // email
  if (email) {
    ctx.beginPath()
    ctx.arc(RX + 6, 240, 4, 0, Math.PI*2)
    ctx.fillStyle = s.accent
    ctx.fill()
    ctx.fillStyle = s.subtext
    ctx.font = '400 14px Arial'
    ctx.textBaseline = 'middle'
    ctx.fillText(email, RX + 18, 240)
  }

  // skills
  if (skills.length > 0) {
    ctx.textBaseline = 'top'
    drawPills(ctx, skills, RX, 270, s.accent)
  }

  // corner decoration — 3 arcs bottom right
  for (const r of [55, 75, 95]) {
    ctx.beginPath()
    ctx.arc(W, H, r, Math.PI, Math.PI * 1.5)
    ctx.strokeStyle = `rgba(${hexToRgb(s.accent)},0.18)`
    ctx.lineWidth = 1.5
    ctx.stroke()
  }

  return canvas.toBuffer('image/png').toString('base64')
}

// ── PROFILE PICTURE 600x600 ───────────────────────────

export async function generateProfilePicture(userData, selfieBuffer) {
  const { name='', title='', stylePreset='founder' } = userData
  const s = STYLES[stylePreset] || STYLES.founder
  const W = 600, H = 600
  const canvas = createCanvas(W, H)
  const ctx = canvas.getContext('2d')

  drawBg(ctx, W, H, s.bg)
  addNoise(ctx, W, H)
  drawGlow(ctx, W/2, H/2, 320, s.accent, 0.14)
  drawGlow(ctx, 0, 0, 180, s.accent2, 0.07)
  drawGlow(ctx, W, H, 180, s.accent, 0.07)

  // decorative outer rings
  const rings = [[268, 0.08, 1], [252, 0.15, 1], [235, 0.28, 2]]
  for (const [r, alpha, lw] of rings) {
    ctx.beginPath()
    ctx.arc(W/2, 265, r, 0, Math.PI*2)
    ctx.strokeStyle = `rgba(${hexToRgb(s.accent)},${alpha})`
    ctx.lineWidth = lw
    ctx.stroke()
  }

  // photo or monogram
  if (selfieBuffer) {
    await placePhoto(ctx, selfieBuffer, W/2, 265, 200, s.accent)
  } else {
    drawMonogram(ctx, name, W/2, 265, 200, s.accent, s.accent2, s.text)
  }

  // diamond decorations at cardinal points of outer ring
  const dpts = [[W/2, 265-270], [W/2+270, 265], [W/2, 265+270], [W/2-270, 265]]
  for (const [dx, dy] of dpts) {
    if (dy < 0 || dy > H) continue
    ctx.save()
    ctx.translate(dx, dy)
    ctx.rotate(Math.PI/4)
    ctx.fillStyle = s.accent
    ctx.fillRect(-5, -5, 10, 10)
    ctx.restore()
  }

  // bottom name/title pill
  drawRoundedRect(ctx, 80, 490, 440, 82, 16,
    'rgba(0,0,0,0.45)',
    `rgba(${hexToRgb(s.accent)},0.40)`,
    1.5)

  ctx.fillStyle = s.text
  ctx.font = 'bold 22px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(name, W/2, 518)

  ctx.fillStyle = s.subtext
  ctx.font = '400 14px Arial'
  ctx.fillText(title, W/2, 544)

  return canvas.toBuffer('image/png').toString('base64')
}
