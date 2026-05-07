import JSZip from 'jszip'

const stripDataUrlPrefix = (value) => {
  if (typeof value !== 'string') return ''
  const parts = value.split(',')
  if (parts.length === 2 && parts[0].includes(';base64')) {
    return parts[1]
  }
  return value
}

const detectImageExtension = (base64Value) => {
  if (typeof base64Value === 'string' && base64Value.startsWith('data:image/svg+xml')) return 'svg'
  const base64 = stripDataUrlPrefix(base64Value)
  if (!base64) return 'png'
  if (base64.startsWith('/9j/')) return 'jpg'
  if (base64.startsWith('iVBORw0KGgo')) return 'png'
  if (base64.startsWith('UklGR')) return 'webp'
  if (base64.startsWith('PHN2Zy')) return 'svg'
  return 'png'
}

const formatTextAssets = (assets) => {
  return `BRANDZIP TEXT ASSETS
====================

LINKEDIN BIO (SHORT)
${assets.linkedinBioShort || ''}

LINKEDIN BIO (MEDIUM)
${assets.linkedinBioMedium || ''}

LINKEDIN BIO (LONG)
${assets.linkedinBioLong || ''}

TWITTER/X BIO
${assets.twitterBio || ''}

TAGLINES
${Array.isArray(assets.taglines) ? assets.taglines.map((tag, idx) => `${idx + 1}. ${tag}`).join('\n') : ''}

ELEVATOR PITCH
${assets.elevatorPitch || ''}

COLOR PALETTE
${Array.isArray(assets.colorPalette) ? assets.colorPalette.map((item) => `${item.name}: ${item.hex}`).join('\n') : ''}
`
}

export const downloadAllAssets = async (assets, name = 'creator') => {
  const zip = new JSZip()
  const folder = zip.folder('brandzip-kit')

  const imageEntries = [
    { key: 'originalSelfie', fileBase: 'uploaded-selfie' },
    { key: 'linkedinBanner', fileBase: 'linkedin-banner' },
    { key: 'twitterBanner', fileBase: 'twitter-banner' },
    { key: 'quoteGraphic', fileBase: 'quote-graphic' },
    { key: 'businessCard', fileBase: 'business-card' },
    { key: 'profilePicture', fileBase: 'profile-picture' },
  ]

  imageEntries.forEach(({ key, fileBase }) => {
    const base64 = stripDataUrlPrefix(assets[key] || '')
    if (!base64) return
    const ext = detectImageExtension(base64)
    folder.file(`${fileBase}.${ext}`, base64, { base64: true })
  })

  folder.file('brand-copy.txt', formatTextAssets(assets))

  const blob = await zip.generateAsync({ type: 'blob' })
  const link = document.createElement('a')
  const safeName = name.toLowerCase().replace(/\s+/g, '-')
  const url = URL.createObjectURL(blob)

  link.href = url
  link.download = `brandzip-kit-${safeName}.zip`
  link.click()
  URL.revokeObjectURL(url)
}
