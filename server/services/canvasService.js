import { createCanvas, loadImage } from 'canvas'

const styleConfig = {
  founder: {
    gradientColors: ['#0F0C29', '#302B63', '#24243e'],
    accentColor: '#7C3AED',
    accentColor2: '#3B82F6',
    textColor: '#FFFFFF',
    subtextColor: '#C4B5FD',
    font: 'bold',
    tagline: 'Building the future',
    decorStyle: 'circles',
  },
  developer: {
    gradientColors: ['#0a0a0a', '#0d1117', '#161b22'],
    accentColor: '#00FF41',
    accentColor2: '#00B4D8',
    textColor: '#E6EDF3',
    subtextColor: '#8B949E',
    font: 'mono',
    tagline: 'Shipping clean code',
    decorStyle: 'grid',
  },
  creator: {
    gradientColors: ['#FF6B6B', '#FF8E53', '#FFA07A'],
    accentColor: '#FFFFFF',
    accentColor2: '#FFE66D',
    textColor: '#1A1A1A',
    subtextColor: '#4A4A4A',
    font: 'bold',
    tagline: 'Creating what matters',
    decorStyle: 'waves',
  },
  corporate: {
    gradientColors: ['#1a1a2e', '#16213e', '#0f3460'],
    accentColor: '#E2B96F',
    accentColor2: '#C9A84C',
    textColor: '#FFFFFF',
    subtextColor: '#CBD5E1',
    font: 'regular',
    tagline: 'Excellence in every detail',
    decorStyle: 'lines',
  },
  minimalist: {
    gradientColors: ['#FFFFFF', '#F8FAFC', '#F1F5F9'],
    accentColor: '#0F172A',
    accentColor2: '#334155',
    textColor: '#0F172A',
    subtextColor: '#64748B',
    font: 'light',
    tagline: 'Less. But better.',
    decorStyle: 'dots',
  },
}

const withAlpha = (hex, alpha = 1) => {
  const clean = String(hex || '').replace('#', '')
  if (clean.length !== 6) return `rgba(255,255,255,${alpha})`
  const r = Number.parseInt(clean.slice(0, 2), 16)
  const g = Number.parseInt(clean.slice(2, 4), 16)
  const b = Number.parseInt(clean.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const hexWithAlphaSuffix = (hex, aaHex) => {
  const clean = String(hex || '').replace('#', '')
  if (clean.length !== 6) return withAlpha(hex, Number.parseInt(aaHex, 16) / 255)
  return `#${clean}${aaHex}`
}

const channelAvg = (hex) => {
  const c = String(hex || '').replace('#', '')
  if (c.length !== 6) return 128
  const r = Number.parseInt(c.slice(0, 2), 16)
  const g = Number.parseInt(c.slice(2, 4), 16)
  const b = Number.parseInt(c.slice(4, 6), 16)
  return (r + g + b) / 3
}

const getFontFamily = (style) => {
  if (style.font === 'mono') return 'Menlo, Consolas, monospace'
  return 'Inter, Arial, sans-serif'
}

const getStyle = (stylePreset) => styleConfig[stylePreset] || styleConfig.founder

export const drawRoundedRect = (ctx, x, y, width, height, radius, color) => {
  const r = Math.min(radius, width / 2, height / 2)
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + width - r, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + r)
  ctx.lineTo(x + width, y + height - r)
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height)
  ctx.lineTo(x + r, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()
}

const roundedRectPath = (ctx, x, y, width, height, radius) => {
  const r = Math.min(radius, width / 2, height / 2)
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + width - r, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + r)
  ctx.lineTo(x + width, y + height - r)
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height)
  ctx.lineTo(x + r, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

export const drawGradientBackground = (ctx, width, height, colors) => {
  const base = colors && colors.length > 0 ? colors : ['#0F0C29', '#302B63', '#1a1a4e', '#24243e']
  const c0 = base[0]
  const c1 = base[1] ?? base[0]
  const c2 = base[2] ?? base[1] ?? base[0]
  const c3 = base[3] ?? base[2] ?? base[1] ?? base[0]
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, c0)
  gradient.addColorStop(0.4, c1)
  gradient.addColorStop(0.7, c2)
  gradient.addColorStop(1, c3)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
}

export const drawMeshOverlay = (ctx, width, height, accentColor, lineOpacity = 0.04) => {
  const pickEdgePoint = () => {
    const edge = Math.floor(Math.random() * 4)
    if (edge === 0) return { x: Math.random() * width, y: 0 }
    if (edge === 1) return { x: width, y: Math.random() * height }
    if (edge === 2) return { x: Math.random() * width, y: height }
    return { x: 0, y: Math.random() * height }
  }
  const lineCount = 8 + Math.floor(Math.random() * 3)
  ctx.strokeStyle = withAlpha(accentColor, lineOpacity)
  ctx.lineWidth = 1
  for (let i = 0; i < lineCount; i += 1) {
    const p1 = pickEdgePoint()
    const p2 = pickEdgePoint()
    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.stroke()
  }
}

export const drawGlowCircle = (ctx, x, y, radius, color, opacity) => {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
  gradient.addColorStop(0, withAlpha(color, opacity))
  gradient.addColorStop(0.55, withAlpha(color, opacity * 0.35))
  gradient.addColorStop(1, withAlpha(color, 0))
  ctx.save()
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fillStyle = gradient
  ctx.fill()
  ctx.restore()
}

export const drawNoise = (ctx, width, height, accentColor) => {
  const count = 8200
  for (let i = 0; i < count; i += 1) {
    const px = Math.random() * width
    const py = Math.random() * height
    const opacity = 0.02 + Math.random() * 0.04
    ctx.fillStyle = Math.random() > 0.45 ? `rgba(255,255,255,${opacity})` : withAlpha(accentColor, opacity)
    ctx.fillRect(Math.floor(px), Math.floor(py), 1, 1)
  }
}

export const drawAccentBar = (ctx, x, y, barWidth, barHeight, color1, color2) => {
  const gradient = ctx.createLinearGradient(x, y, x + barWidth, y)
  gradient.addColorStop(0, color1)
  if (color2) {
    gradient.addColorStop(0.65, color2)
    gradient.addColorStop(1, withAlpha(color2, 0))
  } else {
    gradient.addColorStop(1, withAlpha(color1, 0))
  }
  ctx.fillStyle = gradient
  ctx.fillRect(x, y, barWidth, barHeight)
}

const drawVerticalAccentBar = (ctx, x, y, barWidth, barHeight, color1) => {
  const gradient = ctx.createLinearGradient(x, y, x, y + barHeight)
  gradient.addColorStop(0, color1)
  gradient.addColorStop(0.55, withAlpha(color1, 0.45))
  gradient.addColorStop(1, withAlpha(color1, 0))
  ctx.fillStyle = gradient
  ctx.fillRect(x, y, barWidth, barHeight)
}

const drawVerticalSeparatorLine = (ctx, x, y, lineWidth, height, accentColor) => {
  const gradient = ctx.createLinearGradient(x, y, x, y + height)
  gradient.addColorStop(0, withAlpha(accentColor, 0))
  gradient.addColorStop(0.5, accentColor)
  gradient.addColorStop(1, withAlpha(accentColor, 0))
  ctx.fillStyle = gradient
  ctx.fillRect(x, y, lineWidth, height)
}

const drawBottomEdgeGradientLine = (ctx, width, y, lineHeight, accentColor, accentColor2) => {
  const gradient = ctx.createLinearGradient(0, y, width, y)
  gradient.addColorStop(0, 'rgba(255,255,255,0)')
  gradient.addColorStop(0.38, withAlpha(accentColor, 0.95))
  gradient.addColorStop(0.62, withAlpha(accentColor2, 0.95))
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, y, width, lineHeight)
}

export const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
  const words = String(text || '').split(/\s+/).filter(Boolean)
  const lines = []
  let currentLine = ''
  words.forEach((word) => {
    const candidate = currentLine ? `${currentLine} ${word}` : word
    if (ctx.measureText(candidate).width <= maxWidth) {
      currentLine = candidate
    } else {
      if (currentLine) lines.push(currentLine)
      currentLine = word
    }
  })
  if (currentLine) lines.push(currentLine)
  return lines
}

const truncateOneLine = (ctx, text, maxWidth) => {
  const source = String(text || '')
  if (ctx.measureText(source).width <= maxWidth) return source
  let trimmed = source
  while (trimmed.length > 0 && ctx.measureText(`${trimmed}...`).width > maxWidth) {
    trimmed = trimmed.slice(0, -1)
  }
  return `${trimmed}...`
}

const drawLetterSpacedText = (ctx, text, startX, y, extraGap = 1.5) => {
  let x = startX
  const chars = String(text || '').split('')
  chars.forEach((char) => {
    ctx.fillText(char, x, y)
    x += ctx.measureText(char).width + extraGap
  })
  return x
}

const drawSkillPillsPremium = (ctx, skills, startX, y, accentColor) => {
  let x = startX
  ctx.textBaseline = 'middle'
  skills.slice(0, 3).forEach((skill) => {
    const label = String(skill || '').trim().slice(0, 22)
    if (!label) return
    ctx.font = '500 13px Inter, Arial, sans-serif'
    const tw = ctx.measureText(label).width
    const w = Math.max(56, tw + 28)
    const h = 34
    const r = 20
    roundedRectPath(ctx, x, y, w, h, r)
    ctx.fillStyle = withAlpha(accentColor, 0.15)
    ctx.fill()
    ctx.strokeStyle = withAlpha(accentColor, 0.38)
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.fillStyle = accentColor
    ctx.textAlign = 'left'
    ctx.fillText(label, x + 14, y + h / 2)
    x += w + 10
  })
  ctx.textBaseline = 'alphabetic'
}

export const drawCircularPhoto = async (
  ctx,
  imageBuffer,
  centerX,
  centerY,
  radius,
  borderColor,
  borderWidth,
  glowColor,
) => {
  const img = await loadImage(imageBuffer)
  drawGlowCircle(ctx, centerX, centerY, radius + 30, glowColor, 0.15)

  ctx.save()
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
  ctx.clip()

  const size = radius * 2
  const imgAspect = img.width / img.height
  let drawW
  let drawH
  let drawX
  let drawY
  if (imgAspect > 1) {
    drawH = size
    drawW = size * imgAspect
    drawX = centerX - radius - (drawW - size) / 2
    drawY = centerY - radius
  } else {
    drawW = size
    drawH = size / imgAspect
    drawX = centerX - radius
    drawY = centerY - radius - (drawH - size) / 2
  }
  ctx.drawImage(img, drawX, drawY, drawW, drawH)
  ctx.restore()

  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
  ctx.strokeStyle = borderColor
  ctx.lineWidth = borderWidth || 4
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(centerX, centerY, radius - 6, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'
  ctx.lineWidth = 1
  ctx.stroke()
}

const fillCircleGradient = (ctx, cx, cy, radius, color1, color2) => {
  const g = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, 0, cx, cy, radius)
  g.addColorStop(0, color1)
  g.addColorStop(1, color2)
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.fillStyle = g
  ctx.fill()
  ctx.restore()
}

const drawDiamond = (ctx, cx, cy, size, fillStyle) => {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(Math.PI / 4)
  ctx.fillStyle = fillStyle
  ctx.fillRect(-size / 2, -size / 2, size, size)
  ctx.restore()
}

const drawDashedRing = (ctx, cx, cy, radius, color, opacity) => {
  const segments = 56
  ctx.strokeStyle = withAlpha(color, opacity)
  ctx.lineWidth = 1
  for (let i = 0; i < segments; i += 2) {
    const start = (i / segments) * Math.PI * 2
    const sweep = (Math.PI * 2) / segments - 0.04
    ctx.beginPath()
    ctx.arc(cx, cy, radius, start, start + sweep)
    ctx.stroke()
  }
}

const paletteHexes = (colorPalette) => {
  if (!Array.isArray(colorPalette) || colorPalette.length === 0) return []
  return colorPalette
    .map((entry) => {
      if (entry && typeof entry === 'object' && entry.hex) return String(entry.hex)
      if (typeof entry === 'string') return entry
      return null
    })
    .filter(Boolean)
}

export const generateLinkedInBanner = async (userData, selfieBuffer) => {
  const width = 1584
  const height = 396
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')
  const style = getStyle(userData.stylePreset)
  const fontFamily = getFontFamily(style)
  const { accentColor, accentColor2, textColor, subtextColor } = style

  drawGradientBackground(ctx, width, height, style.gradientColors)
  drawMeshOverlay(ctx, width, height, accentColor, 0.04)
  drawGlowCircle(ctx, 1400, -50, 350, accentColor, 0.12)
  drawGlowCircle(ctx, 100, 450, 280, accentColor2, 0.08)
  drawNoise(ctx, width, height, accentColor)

  drawVerticalAccentBar(ctx, 68, 60, 4, 180, accentColor)

  ctx.font = `500 13px ${fontFamily}`
  ctx.fillStyle = accentColor
  drawLetterSpacedText(ctx, style.tagline.toUpperCase(), 90, 95, 1.5)

  const rawName = userData.name || ''
  const nameFontSize = rawName.length > 18 ? 48 : 62
  ctx.font = `700 ${nameFontSize}px ${fontFamily}`
  ctx.fillStyle = textColor
  const displayName = truncateOneLine(ctx, rawName, 900)
  ctx.fillText(displayName, 90, 175)

  const nameWidth = ctx.measureText(displayName).width
  drawAccentBar(ctx, 90, 190, nameWidth * 0.6, 3, accentColor, accentColor2)

  ctx.font = `300 26px ${fontFamily}`
  ctx.fillStyle = subtextColor
  ctx.fillText(userData.title || '', 92, 230)

  drawSkillPillsPremium(ctx, userData.skills || [], 90, 275, accentColor)

  const photoCx = 1340
  const photoCy = 198

  ctx.save()
  ctx.strokeStyle = withAlpha(accentColor, 0.2)
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(photoCx, photoCy, 155, 0, Math.PI * 2)
  ctx.stroke()
  ctx.strokeStyle = withAlpha(accentColor, 0.1)
  ctx.beginPath()
  ctx.arc(photoCx, photoCy, 175, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()

  if (selfieBuffer) {
    await drawCircularPhoto(ctx, selfieBuffer, photoCx, photoCy, 140, accentColor, 5, accentColor)
  } else {
    fillCircleGradient(ctx, photoCx, photoCy, 140, accentColor, accentColor2)
    ctx.fillStyle = textColor
    ctx.font = `700 100px ${fontFamily}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText((rawName || 'B').trim().charAt(0).toUpperCase(), photoCx, photoCy + 4)
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
  }

  drawBottomEdgeGradientLine(ctx, width, 390, 3, accentColor, accentColor2)

  ctx.font = `11px ${fontFamily}`
  ctx.fillStyle = 'rgba(255,255,255,0.2)'
  ctx.textAlign = 'right'
  ctx.fillText('brandzip.co', 1540, 385)
  ctx.textAlign = 'left'

  return canvas.toBuffer('image/png').toString('base64')
}

export const generateTwitterBanner = async (userData, selfieBuffer) => {
  const width = 1500
  const height = 500
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')
  const style = getStyle(userData.stylePreset)
  const fontFamily = getFontFamily(style)
  const { accentColor, accentColor2, textColor, subtextColor } = style

  drawGradientBackground(ctx, width, height, style.gradientColors)
  drawGlowCircle(ctx, 750, 250, 400, accentColor, 0.08)
  drawMeshOverlay(ctx, width, height, accentColor, 0.04)
  drawNoise(ctx, width, height, accentColor)

  const hasSelfie = Boolean(selfieBuffer)
  const contentX = hasSelfie ? 430 : width / 2

  if (hasSelfie) {
    await drawCircularPhoto(ctx, selfieBuffer, 220, 250, 150, accentColor, 6, accentColor)
    drawVerticalSeparatorLine(ctx, 395, 80, 2, 340, accentColor)
  } else {
    ctx.save()
    ctx.strokeStyle = withAlpha(accentColor, 0.25)
    ctx.lineWidth = 2
    const dx = 120
    ctx.translate(200, 250)
    ctx.rotate(Math.PI / 4)
    ctx.strokeRect(-dx, -dx, dx * 2, dx * 2)
    ctx.restore()
  }

  const name = userData.name || ''
  ctx.textAlign = hasSelfie ? 'left' : 'center'
  ctx.font = `700 68px ${fontFamily}`
  ctx.fillStyle = textColor
  const maxName = hasSelfie ? 1000 : 1200
  const displayName = truncateOneLine(ctx, name, maxName)
  ctx.fillText(displayName, contentX, 210)

  const measured = ctx.measureText(displayName).width
  const underlineW = measured * 0.5
  const ux = hasSelfie ? contentX : contentX - underlineW / 2
  drawAccentBar(ctx, ux, 225, underlineW, 4, accentColor, accentColor2)

  ctx.font = `300 28px ${fontFamily}`
  ctx.fillStyle = subtextColor
  const titleY = 270
  if (hasSelfie) {
    ctx.fillText(userData.title || '', 432, titleY)
  } else {
    ctx.fillText(userData.title || '', contentX, titleY)
  }

  const taglineText = userData.geminiTagline || style.tagline
  ctx.font = `italic 400 18px ${fontFamily}`
  ctx.globalAlpha = 0.8
  ctx.fillStyle = accentColor
  if (hasSelfie) {
    ctx.textAlign = 'left'
    ctx.fillText(taglineText, 432, 315)
  } else {
    ctx.textAlign = 'center'
    const tw = ctx.measureText(taglineText).width
    const maxW = 900
    if (tw <= maxW) {
      ctx.fillText(taglineText, contentX, 315)
    } else {
      const lines = wrapText(ctx, taglineText, contentX, 315, maxW, 22)
      lines.slice(0, 2).forEach((line, i) => {
        ctx.fillText(line, contentX, 305 + i * 22)
      })
    }
  }
  ctx.globalAlpha = 1

  const accentsVeryLight = channelAvg(accentColor) > 200 && channelAvg(accentColor2) > 200
  const stripC1 = accentsVeryLight ? style.gradientColors[1] || style.gradientColors[0] : accentColor
  const stripC2 = accentsVeryLight ? style.gradientColors[2] || style.gradientColors[1] : accentColor2

  const stripGradient = ctx.createLinearGradient(0, 440, width, 500)
  stripGradient.addColorStop(0, hexWithAlphaSuffix(stripC1, 'CC'))
  stripGradient.addColorStop(1, hexWithAlphaSuffix(stripC2, 'CC'))
  ctx.fillStyle = stripGradient
  ctx.fillRect(0, 440, width, 60)

  const stripParts = [userData.industry, userData.skills?.[0], userData.skills?.[1]]
    .map((s) => (s ? String(s).trim() : ''))
    .filter(Boolean)
  ctx.textAlign = 'left'
  ctx.font = `500 14px ${fontFamily}`
  ctx.fillStyle = '#FFFFFF'
  ctx.fillText(stripParts.join(' · '), 40, 477)

  ctx.textAlign = 'right'
  ctx.font = `400 13px ${fontFamily}`
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.fillText('brandzip.co', 1460, 477)
  ctx.textAlign = 'left'

  return canvas.toBuffer('image/png').toString('base64')
}

export const generateQuoteGraphic = async (userData, tagline, selfieBuffer) => {
  const width = 1080
  const height = 1080
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')
  const style = getStyle(userData.stylePreset)
  const fontFamily = getFontFamily(style)
  const { accentColor, accentColor2, textColor, subtextColor } = style

  drawGradientBackground(ctx, width, height, style.gradientColors)
  drawGlowCircle(ctx, 80, 80, 320, accentColor, 0.12)
  drawGlowCircle(ctx, 1000, 200, 280, accentColor2, 0.1)
  drawGlowCircle(ctx, 200, 980, 360, accentColor, 0.09)
  drawMeshOverlay(ctx, width, height, accentColor, 0.06)
  drawNoise(ctx, width, height, accentColor)

  ctx.save()
  ctx.globalAlpha = 0.08
  ctx.fillStyle = accentColor
  ctx.font = `700 280px Georgia, 'Times New Roman', serif`
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText('"', 40, 280)
  ctx.restore()

  const boxX = 80
  const boxY = 340
  const boxW = 920
  const boxH = 340
  roundedRectPath(ctx, boxX, boxY, boxW, boxH, 20)
  ctx.fillStyle = 'rgba(255,255,255,0.04)'
  ctx.fill()
  ctx.strokeStyle = hexWithAlphaSuffix(accentColor, '30')
  ctx.lineWidth = 1
  ctx.stroke()

  const quoteText = tagline || style.tagline
  ctx.font = `700 44px ${fontFamily}`
  ctx.fillStyle = textColor
  ctx.textAlign = 'center'
  const lines = wrapText(ctx, quoteText, width / 2, 0, 820, 52).slice(0, 5)
  const lineHeight = 52
  const blockH = lines.length * lineHeight
  const startY = 420 + (260 - blockH) / 2
  lines.forEach((line, idx) => {
    ctx.fillText(line, 540, startY + idx * lineHeight)
  })

  drawAccentBar(ctx, 440, 660, 200, 3, accentColor, accentColor2)

  const authorPhotoX = 440
  const authorPhotoY = 760
  if (selfieBuffer) {
    await drawCircularPhoto(ctx, selfieBuffer, authorPhotoX, authorPhotoY, 38, accentColor, 3, accentColor)
    ctx.textAlign = 'left'
    ctx.fillStyle = textColor
    ctx.font = `700 22px ${fontFamily}`
    ctx.fillText(userData.name || '', 495, 752)
    ctx.font = `400 16px ${fontFamily}`
    ctx.fillStyle = subtextColor
    ctx.fillText(userData.title || '', 495, 778)
  } else {
    fillCircleGradient(ctx, authorPhotoX, authorPhotoY, 38, accentColor, accentColor2)
    ctx.fillStyle = textColor
    ctx.font = `700 34px ${fontFamily}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText((userData.name || 'B').trim().charAt(0).toUpperCase(), authorPhotoX, authorPhotoY + 2)
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
    ctx.fillStyle = textColor
    ctx.font = `700 22px ${fontFamily}`
    ctx.fillText(userData.name || '', 495, 752)
    ctx.font = `400 16px ${fontFamily}`
    ctx.fillStyle = subtextColor
    ctx.fillText(userData.title || '', 495, 778)
  }

  ctx.textAlign = 'center'
  ctx.font = `11px ${fontFamily}`
  ctx.fillStyle = 'rgba(255,255,255,0.22)'
  ctx.fillText('brandzip.co', width / 2, height - 36)

  return canvas.toBuffer('image/png').toString('base64')
}

export const generateBusinessCard = async (userData, selfieBuffer) => {
  const width = 1050
  const height = 600
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')
  const style = getStyle(userData.stylePreset)
  const fontFamily = getFontFamily(style)
  const { accentColor, accentColor2, textColor, subtextColor } = style
  const leftW = 420

  const leftGrad = ctx.createLinearGradient(0, 0, leftW, height)
  leftGrad.addColorStop(0, accentColor)
  leftGrad.addColorStop(1, withAlpha(accentColor, 0.75))
  ctx.fillStyle = leftGrad
  ctx.fillRect(0, 0, leftW, height)

  ctx.save()
  ctx.beginPath()
  ctx.rect(0, 0, leftW, height)
  ctx.clip()
  drawGlowCircle(ctx, 80, 120, 200, '#FFFFFF', 0.08)
  drawGlowCircle(ctx, 320, 480, 220, accentColor2, 0.12)
  drawMeshOverlay(ctx, leftW, height, '#FFFFFF', 0.05)
  ctx.restore()

  const photoCx = 210
  const photoCy = 230
  if (selfieBuffer) {
    await drawCircularPhoto(ctx, selfieBuffer, photoCx, photoCy, 120, 'rgba(255,255,255,0.9)', 5, '#FFFFFF')
    ctx.textAlign = 'center'
    ctx.fillStyle = '#FFFFFF'
    ctx.font = `700 22px ${fontFamily}`
    ctx.fillText(userData.name || '', 210, 385)
    ctx.font = `300 15px ${fontFamily}`
    ctx.fillStyle = 'rgba(255,255,255,0.75)'
    ctx.fillText(userData.title || '', 210, 412)
  } else {
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = 'rgba(255,255,255,0.08)'
    ctx.font = `700 180px ${fontFamily}`
    ctx.fillText((userData.name || 'B').trim().charAt(0).toUpperCase(), 210, 230)
    ctx.textBaseline = 'alphabetic'
    ctx.fillStyle = '#FFFFFF'
    ctx.font = `700 22px ${fontFamily}`
    ctx.fillText(userData.name || '', 210, 385)
    ctx.font = `300 15px ${fontFamily}`
    ctx.fillStyle = 'rgba(255,255,255,0.75)'
    ctx.fillText(userData.title || '', 210, 412)
  }

  const hexes = paletteHexes(userData.colorPalette)
  const dotYs = 560
  const dotR = 6
  const gap = 10
  const dotsToShow = hexes.length >= 3 ? hexes.slice(0, 3) : [accentColor, accentColor2, style.gradientColors[1] || textColor]
  const totalW = dotsToShow.length * (dotR * 2) + (dotsToShow.length - 1) * gap
  let dotX = 210 - totalW / 2 + dotR
  dotsToShow.slice(0, 3).forEach((hex) => {
    ctx.beginPath()
    ctx.arc(dotX, dotYs, dotR, 0, Math.PI * 2)
    ctx.fillStyle = hex
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'
    ctx.lineWidth = 1
    ctx.stroke()
    dotX += dotR * 2 + gap
  })

  const divGrad = ctx.createLinearGradient(420, 30, 420, 570)
  divGrad.addColorStop(0, 'rgba(255,255,255,0)')
  divGrad.addColorStop(0.5, 'rgba(255,255,255,0.15)')
  divGrad.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = divGrad
  ctx.fillRect(420, 30, 1, 540)

  const rightGrad = ctx.createLinearGradient(430, 0, width, height)
  if (userData.stylePreset === 'minimalist') {
    rightGrad.addColorStop(0, '#CBD5E1')
    rightGrad.addColorStop(0.55, '#94A3B8')
    rightGrad.addColorStop(1, '#64748B')
  } else {
    rightGrad.addColorStop(0, style.gradientColors[2] || style.gradientColors[1] || '#0F0C29')
    rightGrad.addColorStop(0.55, style.gradientColors[1] || style.gradientColors[0])
    rightGrad.addColorStop(1, style.gradientColors[0])
  }
  ctx.fillStyle = rightGrad
  ctx.fillRect(430, 0, width - 430, height)

  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  const industryLabel = (userData.industry || style.tagline).toUpperCase()
  ctx.font = `500 11px ${fontFamily}`
  const industryMuted =
    channelAvg(accentColor) > 200 && userData.stylePreset !== 'minimalist' ? subtextColor : accentColor
  ctx.fillStyle = userData.stylePreset === 'minimalist' ? accentColor : industryMuted
  drawLetterSpacedText(ctx, industryLabel, 460, 80, 1.2)

  ctx.fillStyle = textColor
  ctx.font = `700 36px ${fontFamily}`
  ctx.fillText(userData.name || '', 460, 140)

  ctx.font = `300 20px ${fontFamily}`
  ctx.fillStyle = subtextColor
  ctx.fillText(userData.title || '', 460, 175)

  drawAccentBar(ctx, 460, 200, 240, 2, accentColor, accentColor2)

  ctx.beginPath()
  ctx.arc(460, 236, 4, 0, Math.PI * 2)
  ctx.fillStyle = accentColor
  ctx.fill()

  ctx.font = `400 15px ${fontFamily}`
  ctx.fillStyle = subtextColor
  ctx.fillText(userData.email || '', 475, 246)

  drawSkillPillsPremium(ctx, userData.skills || [], 460, 290, accentColor)

  ctx.font = `italic 400 14px ${fontFamily}`
  ctx.fillStyle = withAlpha(accentColor, 0.7)
  ctx.fillText(style.tagline, 460, 360)

  ctx.strokeStyle = withAlpha(accentColor, 0.2)
  ctx.lineWidth = 1
  ;[60, 80, 100].forEach((r) => {
    ctx.beginPath()
    ctx.arc(1050, 600, r, Math.PI, Math.PI * 1.5, false)
    ctx.stroke()
  })

  return canvas.toBuffer('image/png').toString('base64')
}

const makeMonogram = (name) => {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'BZ'
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase()
}

export const generateProfilePicture = async (userData, selfieBuffer) => {
  const width = 600
  const height = 600
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')
  const style = getStyle(userData.stylePreset)
  const fontFamily = getFontFamily(style)
  const { accentColor, accentColor2, textColor, subtextColor } = style

  drawGradientBackground(ctx, width, height, style.gradientColors)
  drawGlowCircle(ctx, 300, 300, 350, accentColor, 0.15)
  drawGlowCircle(ctx, 40, 40, 120, accentColor2, 0.1)
  drawGlowCircle(ctx, 560, 40, 120, accentColor, 0.08)
  drawGlowCircle(ctx, 40, 560, 120, accentColor2, 0.09)
  drawGlowCircle(ctx, 560, 560, 120, accentColor, 0.08)
  drawNoise(ctx, width, height, accentColor)

  const cx = 300
  const cy = 270

  ctx.strokeStyle = withAlpha(accentColor, 0.12)
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(cx, cy, 265, 0, Math.PI * 2)
  ctx.stroke()

  drawDashedRing(ctx, cx, cy, 248, accentColor, 0.2)

  ctx.strokeStyle = withAlpha(accentColor, 0.3)
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(cx, cy, 230, 0, Math.PI * 2)
  ctx.stroke()

  if (selfieBuffer) {
    await drawCircularPhoto(ctx, selfieBuffer, cx, cy, 200, accentColor, 6, accentColor)
  } else {
    fillCircleGradient(ctx, cx, cy, 200, accentColor, accentColor2)
    ctx.fillStyle = textColor
    ctx.font = `700 120px ${fontFamily}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(makeMonogram(userData.name), cx, cy + 4)
    ctx.textBaseline = 'alphabetic'
  }

  const pillX = 100
  const pillY = 480
  const pillW = 400
  const pillH = 80
  roundedRectPath(ctx, pillX, pillY, pillW, pillH, 16)
  ctx.fillStyle = 'rgba(0,0,0,0.35)'
  ctx.fill()
  ctx.strokeStyle = withAlpha(accentColor, 0.3)
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.textAlign = 'center'
  ctx.fillStyle = textColor
  ctx.font = `700 22px ${fontFamily}`
  ctx.fillText(userData.name || '', 300, 507)
  ctx.font = `400 14px ${fontFamily}`
  ctx.fillStyle = subtextColor
  ctx.fillText(userData.title || '', 300, 530)

  const dFill = accentColor
  drawDiamond(ctx, 300, 35, 8, dFill)
  drawDiamond(ctx, 565, 270, 8, dFill)
  drawDiamond(ctx, 300, 505, 8, dFill)
  drawDiamond(ctx, 35, 270, 8, dFill)

  return canvas.toBuffer('image/png').toString('base64')
}
