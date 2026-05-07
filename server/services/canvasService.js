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

const getFontFamily = (style) => {
  if (style.font === 'mono') return 'Menlo, Consolas, monospace'
  return 'Inter, Arial, sans-serif'
}

const getFontWeight = (style) => {
  if (style.font === 'light') return '300'
  if (style.font === 'regular') return '400'
  return '700'
}

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

export const drawGradientBackground = (ctx, width, height, colors) => {
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  colors.forEach((color, index) => {
    const stop = colors.length > 1 ? index / (colors.length - 1) : 0
    gradient.addColorStop(stop, color)
  })
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
}

export const drawNoise = (ctx, width, height, opacity = 0.04) => {
  const dots = Math.floor((width * height) / 1200)
  ctx.fillStyle = `rgba(255,255,255,${opacity})`
  for (let i = 0; i < dots; i += 1) {
    const x = Math.random() * width
    const y = Math.random() * height
    ctx.fillRect(x, y, 1, 1)
  }
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

const drawDecorations = (ctx, width, height, decorStyle, accentColor) => {
  if (decorStyle === 'circles') {
    const count = 4 + Math.floor(Math.random() * 3)
    for (let i = 0; i < count; i += 1) {
      const radius = 80 + Math.random() * 140
      const x = i % 2 === 0 ? Math.random() * 140 : width - Math.random() * 140
      const y = Math.random() * height
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fillStyle = withAlpha(accentColor, 0.08 + Math.random() * 0.07)
      ctx.fill()
    }
    return
  }

  if (decorStyle === 'grid') {
    ctx.fillStyle = withAlpha(accentColor, 0.15)
    for (let y = 0; y < height; y += 30) {
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath()
        ctx.arc(x, y, 1, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    return
  }

  if (decorStyle === 'waves') {
    ctx.strokeStyle = withAlpha(accentColor, 0.2)
    ctx.lineWidth = 2
    for (let i = 0; i < 3; i += 1) {
      const baseY = height - 180 + i * 55
      ctx.beginPath()
      ctx.moveTo(0, baseY)
      ctx.bezierCurveTo(width * 0.25, baseY - 40, width * 0.55, baseY + 40, width, baseY - 10)
      ctx.stroke()
    }
    return
  }

  if (decorStyle === 'lines') {
    ctx.strokeStyle = withAlpha(accentColor, 0.1)
    ctx.lineWidth = 1
    const count = 6 + Math.floor(Math.random() * 3)
    for (let i = 0; i < count; i += 1) {
      ctx.beginPath()
      const fromTop = i % 2 === 0
      const x1 = fromTop ? Math.random() * 200 : width - Math.random() * 200
      const y1 = fromTop ? 0 : height
      const x2 = fromTop ? width - Math.random() * 220 : Math.random() * 220
      const y2 = fromTop ? height : 0
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }
    return
  }

  if (decorStyle === 'dots') {
    ctx.fillStyle = withAlpha(accentColor, 0.08)
    for (let y = 30; y < height; y += 60) {
      for (let x = 30; x < width; x += 60) {
        ctx.beginPath()
        ctx.arc(x, y, 2, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }
}

const getStyle = (stylePreset) => styleConfig[stylePreset] || styleConfig.founder

const truncateOneLine = (ctx, text, maxWidth) => {
  const source = String(text || '')
  if (ctx.measureText(source).width <= maxWidth) return source
  let trimmed = source
  while (trimmed.length > 0 && ctx.measureText(`${trimmed}...`).width > maxWidth) {
    trimmed = trimmed.slice(0, -1)
  }
  return `${trimmed}...`
}

const renderSkillPills = (ctx, skills, x, y, accentColor, textColor) => {
  let offsetX = x
  skills.slice(0, 3).forEach((skill) => {
    const label = String(skill || '').slice(0, 20)
    const width = Math.max(64, ctx.measureText(label).width + 26)
    drawRoundedRect(ctx, offsetX, y, width, 30, 15, withAlpha(accentColor, 0.12))
    ctx.strokeStyle = withAlpha(accentColor, 0.8)
    ctx.lineWidth = 1
    ctx.strokeRect(offsetX + 0.5, y + 0.5, width - 1, 29)
    ctx.fillStyle = textColor
    ctx.font = '14px Inter, Arial, sans-serif'
    ctx.fillText(label, offsetX + 13, y + 19)
    offsetX += width + 10
  })
}

const drawCircularPhoto = async (ctx, imageBuffer, centerX, centerY, radius, accentColor) => {
  const image = await loadImage(imageBuffer)
  ctx.save()
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
  ctx.closePath()
  ctx.clip()
  const x = centerX - radius
  const y = centerY - radius
  ctx.drawImage(image, x, y, radius * 2, radius * 2)
  ctx.restore()
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
  ctx.strokeStyle = accentColor
  ctx.lineWidth = 4
  ctx.stroke()
}

export const generateLinkedInBanner = async (userData, selfieBuffer) => {
  const width = 1584
  const height = 396
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')
  const style = getStyle(userData.stylePreset)
  const fontFamily = getFontFamily(style)

  drawGradientBackground(ctx, width, height, style.gradientColors)
  drawDecorations(ctx, width, height, style.decorStyle, style.accentColor)
  drawNoise(ctx, width, height, 0.025)

  drawRoundedRect(ctx, 0, 0, Math.floor(width * 0.6), height, 0, 'rgba(0,0,0,0.28)')

  ctx.fillStyle = style.subtextColor
  ctx.font = `13px ${fontFamily}`
  ctx.fillText(style.tagline.toUpperCase(), 80, 80)

  ctx.fillStyle = style.accentColor
  ctx.fillRect(80, 96, 40, 2)

  ctx.fillStyle = style.textColor
  ctx.font = `700 56px ${fontFamily}`
  const displayName = truncateOneLine(ctx, userData.name, 860)
  ctx.fillText(displayName, 80, 160)

  ctx.fillStyle = style.subtextColor
  ctx.font = `24px ${fontFamily}`
  ctx.fillText(userData.title || '', 80, 210)

  ctx.font = `14px ${fontFamily}`
  renderSkillPills(ctx, userData.skills || [], 80, 250, style.accentColor, style.textColor)

  const centerX = 1300
  const centerY = 198
  ctx.beginPath()
  ctx.arc(centerX, centerY, 140, 0, Math.PI * 2)
  ctx.strokeStyle = withAlpha(style.accentColor, 0.3)
  ctx.lineWidth = 1
  ctx.stroke()

  if (selfieBuffer) {
    await drawCircularPhoto(ctx, selfieBuffer, centerX, centerY, 130, style.accentColor)
  } else {
    ctx.beginPath()
    ctx.arc(centerX, centerY, 80, 0, Math.PI * 2)
    ctx.fillStyle = withAlpha(style.accentColor2, 0.15)
    ctx.fill()

    ctx.fillStyle = style.textColor
    ctx.font = `700 80px ${fontFamily}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText((userData.name || 'B').trim().charAt(0).toUpperCase(), centerX, centerY + 6)
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
  }

  ctx.fillStyle = withAlpha(style.textColor, 0.3)
  ctx.font = `11px ${fontFamily}`
  ctx.fillText('brandzip.co', width - 130, height - 20)

  return canvas.toBuffer('image/png').toString('base64')
}

export const generateTwitterBanner = async (userData, selfieBuffer) => {
  const width = 1500
  const height = 500
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')
  const style = getStyle(userData.stylePreset)
  const fontFamily = getFontFamily(style)

  drawGradientBackground(ctx, width, height, style.gradientColors)
  drawDecorations(ctx, width, height, style.decorStyle, style.accentColor)
  drawNoise(ctx, width, height, 0.03)

  const name = userData.name || ''
  const hasSelfie = Boolean(selfieBuffer)
  const nameX = hasSelfie ? 380 : width / 2
  const maxNameWidth = hasSelfie ? 1020 : 1300
  ctx.textAlign = hasSelfie ? 'left' : 'center'
  ctx.fillStyle = style.textColor
  ctx.font = `700 72px ${fontFamily}`
  const displayName = truncateOneLine(ctx, name, maxNameWidth)
  ctx.fillText(displayName, nameX, 180)

  const lineWidth = Math.max(140, Math.min(520, ctx.measureText(displayName).width * 0.9))
  const lineStartX = hasSelfie ? nameX : width / 2 - lineWidth / 2
  const lineEndX = hasSelfie ? nameX + lineWidth : width / 2 + lineWidth / 2
  const accentLine = ctx.createLinearGradient(lineStartX, 0, lineEndX, 0)
  accentLine.addColorStop(0, style.accentColor)
  accentLine.addColorStop(1, style.accentColor2)
  ctx.fillStyle = accentLine
  drawRoundedRect(ctx, hasSelfie ? nameX : width / 2 - lineWidth / 2, 206, lineWidth, 4, 2, accentLine)

  ctx.font = `26px ${fontFamily}`
  ctx.fillStyle = style.subtextColor
  ctx.fillText(userData.title || '', nameX, 260)

  if (hasSelfie) {
    await drawCircularPhoto(ctx, selfieBuffer, 200, 250, 110, style.accentColor)
  }

  drawRoundedRect(ctx, 0, height - 60, width, 60, 0, style.accentColor)
  ctx.textAlign = 'left'
  ctx.font = `14px ${fontFamily}`
  ctx.fillStyle = '#FFFFFF'
  ctx.fillText(style.tagline, 36, height - 24)
  ctx.textAlign = 'right'
  ctx.fillText('brandzip.co', width - 36, height - 24)

  ctx.save()
  ctx.globalAlpha = 0.6
  ctx.fillStyle = style.accentColor
  ctx.translate(44, 40)
  ctx.rotate(Math.PI / 4)
  ctx.fillRect(-10, -10, 20, 20)
  ctx.restore()

  return canvas.toBuffer('image/png').toString('base64')
}

export const generateQuoteGraphic = async (userData, tagline, selfieBuffer) => {
  const width = 1080
  const height = 1080
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')
  const style = getStyle(userData.stylePreset)
  const fontFamily = getFontFamily(style)

  drawGradientBackground(ctx, width, height, style.gradientColors)
  drawDecorations(ctx, width, height, style.decorStyle, style.accentColor2)
  drawNoise(ctx, width, height, 0.05)

  ctx.fillStyle = withAlpha(style.accentColor, 0.15)
  ctx.font = `700 180px ${fontFamily}`
  ctx.fillText('"', 80, 220)

  ctx.textAlign = 'center'
  ctx.fillStyle = style.textColor
  ctx.font = `700 42px ${fontFamily}`
  const lines = wrapText(ctx, tagline || style.tagline, width / 2, 380, 820, 58).slice(0, 3)
  if (lines.length > 0) {
    const startY = 380
    lines.forEach((line, idx) => {
      ctx.fillText(line, width / 2, startY + idx * 58)
    })
  }

  drawRoundedRect(ctx, width / 2 - 30, 540, 60, 2, 1, style.accentColor)

  if (selfieBuffer) {
    await drawCircularPhoto(ctx, selfieBuffer, 440, 610, 35, style.accentColor)
    ctx.textAlign = 'left'
    ctx.fillStyle = style.subtextColor
    ctx.font = `24px ${fontFamily}`
    ctx.fillText(userData.name || '', 490, 605)

    ctx.fillStyle = withAlpha(style.subtextColor, 0.7)
    ctx.font = `18px ${fontFamily}`
    ctx.fillText(userData.title || '', 490, 628)
    ctx.textAlign = 'center'
  } else {
    ctx.fillStyle = style.subtextColor
    ctx.font = `24px ${fontFamily}`
    ctx.fillText(userData.name || '', width / 2, 580)

    ctx.fillStyle = withAlpha(style.subtextColor, 0.7)
    ctx.font = `18px ${fontFamily}`
    ctx.fillText(userData.title || '', width / 2, 615)
  }

  ctx.fillStyle = withAlpha(style.textColor, 0.35)
  ctx.font = `13px ${fontFamily}`
  ctx.fillText('brandzip.co', width / 2, height - 40)

  return canvas.toBuffer('image/png').toString('base64')
}

export const generateBusinessCard = async (userData, selfieBuffer) => {
  const width = 1050
  const height = 600
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')
  const style = getStyle(userData.stylePreset)
  const fontFamily = getFontFamily(style)

  drawRoundedRect(ctx, 0, 0, 525, height, 0, style.accentColor)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  if (selfieBuffer) {
    await drawCircularPhoto(ctx, selfieBuffer, 262, 280, 120, '#FFFFFF')
    ctx.fillStyle = '#FFFFFF'
    ctx.font = `700 20px ${fontFamily}`
    ctx.fillText(userData.name || '', 262, 450)
  } else {
    ctx.fillStyle = 'rgba(255,255,255,0.15)'
    ctx.font = `700 160px ${fontFamily}`
    ctx.fillText((userData.name || 'B').charAt(0).toUpperCase(), 262, 220)
    ctx.fillStyle = '#FFFFFF'
    ctx.font = `700 28px ${fontFamily}`
    ctx.fillText(userData.name || '', 262, 330)
    ctx.fillStyle = 'rgba(255,255,255,0.8)'
    ctx.font = `16px ${fontFamily}`
    ctx.fillText(userData.title || '', 262, 362)
  }

  const rightGradient = ctx.createLinearGradient(525, 0, width, height)
  rightGradient.addColorStop(0, style.gradientColors[1] || style.gradientColors[0])
  rightGradient.addColorStop(1, style.gradientColors[2] || style.gradientColors[1] || style.gradientColors[0])
  ctx.fillStyle = rightGradient
  ctx.fillRect(525, 0, 525, height)

  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = style.textColor
  ctx.font = `700 26px ${fontFamily}`
  ctx.fillText(userData.name || '', 570, 160)
  ctx.fillStyle = style.subtextColor
  ctx.font = `16px ${fontFamily}`
  ctx.fillText(userData.title || '', 570, 195)
  drawRoundedRect(ctx, 570, 223, 200, 2, 1, style.accentColor)
  ctx.fillStyle = style.textColor
  ctx.font = `14px ${fontFamily}`
  ctx.fillText(`@ ${userData.email || ''}`, 570, 260)
  ctx.font = `13px ${fontFamily}`
  renderSkillPills(ctx, userData.skills || [], 570, 285, style.accentColor, style.textColor)

  ctx.fillStyle = withAlpha(style.accentColor2, 0.55)
  ctx.beginPath()
  ctx.moveTo(width - 52, height - 14)
  ctx.lineTo(width - 14, height - 14)
  ctx.lineTo(width - 14, height - 52)
  ctx.closePath()
  ctx.fill()

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

  drawGradientBackground(ctx, width, height, style.gradientColors)
  drawDecorations(ctx, width, height, style.decorStyle, style.accentColor)
  drawNoise(ctx, width, height, 0.04)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  if (selfieBuffer) {
    await drawCircularPhoto(ctx, selfieBuffer, 300, 260, 180, style.accentColor)
  } else {
    ctx.beginPath()
    ctx.arc(300, 300, 200, 0, Math.PI * 2)
    ctx.fillStyle = withAlpha(style.accentColor, 0.2)
    ctx.fill()
    ctx.strokeStyle = style.accentColor
    ctx.lineWidth = 3
    ctx.stroke()

    const innerGradient = ctx.createLinearGradient(130, 130, 470, 470)
    innerGradient.addColorStop(0, withAlpha(style.accentColor, 0.4))
    innerGradient.addColorStop(1, withAlpha(style.accentColor2, 0.4))
    ctx.beginPath()
    ctx.arc(300, 300, 170, 0, Math.PI * 2)
    ctx.fillStyle = innerGradient
    ctx.fill()

    ctx.fillStyle = style.textColor
    ctx.font = `700 120px ${fontFamily}`
    ctx.fillText(makeMonogram(userData.name), 300, 305)
  }

  ctx.textBaseline = 'alphabetic'
  ctx.font = `700 28px ${fontFamily}`
  ctx.fillStyle = style.textColor
  ctx.fillText(userData.name || '', 300, selfieBuffer ? 470 : 530)
  ctx.fillStyle = style.subtextColor
  ctx.font = `16px ${fontFamily}`
  ctx.fillText(userData.title || '', 300, selfieBuffer ? 500 : 560)

  return canvas.toBuffer('image/png').toString('base64')
}

