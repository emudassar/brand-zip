import { v4 as uuidv4 } from 'uuid'
import mongoose from 'mongoose'
import Order from '../models/Order.js'
import { generateTextAssets } from '../services/geminiService.js'
import {
  generateBusinessCard,
  generateLinkedInBanner,
  generateProfilePicture,
  generateQuoteGraphic,
  generateTwitterBanner,
} from '../services/canvasService.js'

const normalizeSkills = (skills) => {
  if (Array.isArray(skills)) {
    return skills
  }

  if (typeof skills === 'string') {
    try {
      const parsed = JSON.parse(skills)
      if (Array.isArray(parsed)) {
        return parsed
      }
    } catch (error) {
      return skills
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    }
  }

  return []
}

const buildFallbackTextAssets = ({ name, title, industry, oneLiner }) => ({
  linkedinBioShort: `${name} | ${title}`,
  linkedinBioMedium: `${name} is a ${title}${industry ? ` in ${industry}` : ''} focused on building meaningful results.`,
  linkedinBioLong:
    oneLiner || `${name} is a ${title}${industry ? ` in the ${industry} space` : ''} with a strong focus on consistent execution and impact.`,
  twitterBio: `${title} | ${industry || 'Professional'} | Building with purpose`,
  taglines: ['Build with clarity', 'Create with impact', 'Lead with value'],
  elevatorPitch: `${name} helps teams turn ideas into outcomes. Their work combines strategy, execution, and clear communication.`,
  colorPalette: [
    { name: 'Midnight Blue', hex: '#0F172A' },
    { name: 'Slate', hex: '#1E293B' },
    { name: 'Brand Blue', hex: '#3B82F6' },
    { name: 'Brand Purple', hex: '#8B5CF6' },
    { name: 'Soft White', hex: '#F8FAFC' },
  ],
})

const styleColors = {
  founder: { bgA: '#3B82F6', bgB: '#8B5CF6', text: '#F8FAFC' },
  developer: { bgA: '#0F172A', bgB: '#1E293B', text: '#10B981' },
  creator: { bgA: '#F97316', bgB: '#EC4899', text: '#FEF3C7' },
  corporate: { bgA: '#1E3A5F', bgB: '#94A3B8', text: '#F8FAFC' },
  minimalist: { bgA: '#111111', bgB: '#6B7280', text: '#F9FAFB' },
}

const escapeXml = (value) =>
  String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')

const makeSvgBase64 = ({ width, height, title, subtitle, stylePreset }) => {
  const colors = styleColors[stylePreset] || styleColors.founder
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${colors.bgA}" />
      <stop offset="100%" stop-color="${colors.bgB}" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)" />
  <rect x="24" y="24" width="${width - 48}" height="${height - 48}" rx="20" fill="rgba(255,255,255,0.08)" />
  <text x="50%" y="46%" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="${Math.max(
    24,
    Math.floor(width / 18),
  )}" font-weight="700" fill="${colors.text}">${escapeXml(title)}</text>
  <text x="50%" y="58%" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="${Math.max(
    16,
    Math.floor(width / 38),
  )}" fill="${colors.text}" opacity="0.9">${escapeXml(subtitle)}</text>
</svg>`.trim()

  return Buffer.from(svg).toString('base64')
}

const buildFallbackImageAssets = ({ name, title, email, stylePreset }) => ({
  linkedinBanner: makeSvgBase64({
    width: 1584,
    height: 396,
    title: name,
    subtitle: `${title} · LinkedIn Banner`,
    stylePreset,
  }),
  twitterBanner: makeSvgBase64({
    width: 1500,
    height: 500,
    title: name,
    subtitle: `${title} · Twitter Banner`,
    stylePreset,
  }),
  quoteGraphic: makeSvgBase64({
    width: 1080,
    height: 1080,
    title: name,
    subtitle: 'Build with clarity',
    stylePreset,
  }),
  businessCard: makeSvgBase64({
    width: 1050,
    height: 600,
    title: name,
    subtitle: `${title} · ${email}`,
    stylePreset,
  }),
  profilePicture: makeSvgBase64({
    width: 1024,
    height: 1024,
    title: name,
    subtitle: title,
    stylePreset,
  }),
})

const ensureDatabaseConnection = async () => {
  if (mongoose.connection.readyState === 1) return true
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    return mongoose.connection.readyState === 1
  } catch (error) {
    return false
  }
}

export const generateKit = async (req, res) => {
  try {
    const hasConnection = await ensureDatabaseConnection()
    if (!hasConnection) {
      return res.status(503).json({
        message: 'Database unavailable. Please try again in a moment.',
      })
    }

    const { name, email, title, industry, oneLiner, stylePreset } = req.body
    const skills = normalizeSkills(req.body.skills)
    const selfie = req.file

    if (!name || !email || !title || !stylePreset) {
      return res.status(400).json({
        message: 'Missing required fields: name, email, title, and stylePreset are required',
      })
    }

    const orderId = uuidv4()
    const order = new Order({
      orderId,
      email,
      name,
      title,
      industry,
      skills,
      oneLiner,
      stylePreset,
      status: 'generating',
      paid: false,
      generatedAssets: {},
    })

    await order.save()

    res.status(202).json({
      orderId,
      message: 'Generation started',
    })

    void (async () => {
      try {
        let textAssets
        try {
          textAssets = await generateTextAssets({
            name,
            title,
            industry,
            skills,
            oneLiner,
            stylePreset,
            selfie,
          })
        } catch (textError) {
          textAssets = buildFallbackTextAssets({ name, title, industry, oneLiner })
        }

        const quoteTagline =
          Array.isArray(textAssets.taglines) && textAssets.taglines.length > 0
            ? textAssets.taglines[0]
            : `${name} - ${title}`

        const userData = {
          name,
          title,
          email,
          stylePreset,
          skills,
          colorPalette: Array.isArray(textAssets.colorPalette) ? textAssets.colorPalette : [],
        }
        const selfieBuffer = selfie?.buffer || null
        const [linkedinBanner, twitterBanner, quoteGraphic, businessCard, profilePicture] =
          await Promise.all([
            generateLinkedInBanner(userData, selfieBuffer),
            generateTwitterBanner(userData, selfieBuffer),
            generateQuoteGraphic(userData, quoteTagline, selfieBuffer),
            generateBusinessCard(userData, selfieBuffer),
            generateProfilePicture(userData, selfieBuffer),
          ])

        const fallbackText = buildFallbackTextAssets({ name, title, industry, oneLiner })
        const originalSelfie = selfie?.buffer ? Buffer.from(selfie.buffer).toString('base64') : ''

        order.generatedAssets = {
          originalSelfie,
          linkedinBanner,
          twitterBanner,
          quoteGraphic,
          businessCard,
          profilePicture,
          linkedinBioShort: textAssets.linkedinBioShort || fallbackText.linkedinBioShort,
          linkedinBioMedium: textAssets.linkedinBioMedium || fallbackText.linkedinBioMedium,
          linkedinBioLong: textAssets.linkedinBioLong || fallbackText.linkedinBioLong,
          twitterBio: textAssets.twitterBio || fallbackText.twitterBio,
          taglines: Array.isArray(textAssets.taglines) && textAssets.taglines.length > 0
            ? textAssets.taglines
            : fallbackText.taglines,
          elevatorPitch: textAssets.elevatorPitch || fallbackText.elevatorPitch,
          colorPalette: Array.isArray(textAssets.colorPalette) && textAssets.colorPalette.length > 0
            ? textAssets.colorPalette
            : fallbackText.colorPalette,
        }
        order.status = 'completed'
        order.errorMessage = ''
        await order.save()
      } catch (error) {
        console.error('Kit generation failed:', error.message)
        order.status = 'failed'
        order.errorMessage = error.message
        await order.save()
      }
    })()

    return undefined
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to start generation',
      error: error.message,
    })
  }
}

export const getOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params
    const order = await Order.findOne({ orderId })

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    return res.status(200).json({
      orderId: order.orderId,
      status: order.status,
      createdAt: order.createdAt,
      errorMessage: order.status === 'failed' ? order.errorMessage || 'Unknown generation error' : '',
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch order status',
      error: error.message,
    })
  }
}

export const getOrderAssets = async (req, res) => {
  try {
    const { orderId } = req.params
    const order = await Order.findOne({ orderId })

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    if (!order.paid) {
      return res.status(402).json({ message: 'Payment required' })
    }

    const fallbackImages = buildFallbackImageAssets({
      name: order.name,
      title: order.title,
      email: order.email,
      stylePreset: order.stylePreset,
    })
    const fallbackText = buildFallbackTextAssets({
      name: order.name,
      title: order.title,
      industry: order.industry,
      oneLiner: order.oneLiner,
    })

    const currentAssets = order.generatedAssets || {}
    const patchedAssets = {
      ...currentAssets,
      originalSelfie: currentAssets.originalSelfie || '',
      linkedinBanner: currentAssets.linkedinBanner || fallbackImages.linkedinBanner,
      twitterBanner: currentAssets.twitterBanner || fallbackImages.twitterBanner,
      quoteGraphic: currentAssets.quoteGraphic || fallbackImages.quoteGraphic,
      businessCard: currentAssets.businessCard || fallbackImages.businessCard,
      profilePicture: currentAssets.profilePicture || fallbackImages.profilePicture,
      linkedinBioShort: currentAssets.linkedinBioShort || fallbackText.linkedinBioShort,
      linkedinBioMedium: currentAssets.linkedinBioMedium || fallbackText.linkedinBioMedium,
      linkedinBioLong: currentAssets.linkedinBioLong || fallbackText.linkedinBioLong,
      twitterBio: currentAssets.twitterBio || fallbackText.twitterBio,
      taglines:
        Array.isArray(currentAssets.taglines) && currentAssets.taglines.length > 0
          ? currentAssets.taglines
          : fallbackText.taglines,
      elevatorPitch: currentAssets.elevatorPitch || fallbackText.elevatorPitch,
      colorPalette:
        Array.isArray(currentAssets.colorPalette) && currentAssets.colorPalette.length > 0
          ? currentAssets.colorPalette
          : fallbackText.colorPalette,
    }

    order.generatedAssets = patchedAssets
    await order.save()

    return res.status(200).json(patchedAssets)
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch order assets',
      error: error.message,
    })
  }
}
