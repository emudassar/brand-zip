import { GoogleGenerativeAI } from '@google/generative-ai'

const STYLE_PROMPTS = {
  founder:
    'deep navy purple gradient, modern startup, electric blue purple accents, geometric light effects, premium Silicon Valley brand design',
  developer:
    'dark mode #0d1117 background, green cyan terminal accents, code grid texture, GitHub dark theme, clean technical design',
  creator:
    'warm orange pink gradient, vibrant expressive, bold creative typography, golden accents, social media optimized',
  corporate: 'deep navy blue, gold accents, formal prestigious, executive aesthetic, luxury business design',
  minimalist:
    'pure white background, black typography, single thin accent line, massive whitespace, editorial magazine design',
}

function getGenAI() {
  const key = process.env.GEMINI_API_KEY
  if (!key) {
    throw new Error('GEMINI_API_KEY is not set')
  }
  return new GoogleGenerativeAI(key)
}

async function generateImage(prompt) {
  const genAI = getGenAI()

  const imageModel = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image'

  const model = genAI.getGenerativeModel({
    model: imageModel,
    generationConfig: { responseModalities: ['Text', 'Image'] },
  })

  const result = await model.generateContent(prompt)
  const response = result.response
  const candidates = response.candidates

  if (!candidates?.length) {
    const block = response.promptFeedback?.blockReason
    throw new Error(
      block ? `Gemini blocked the request: ${block}` : 'No candidates returned from Gemini image model',
    )
  }

  const parts = candidates[0].content?.parts
  if (!parts?.length) {
    const reason = candidates[0].finishReason
    throw new Error(reason ? `Gemini returned no content parts (finish: ${reason})` : 'Gemini returned no content parts')
  }

  for (const part of parts) {
    if (part.inlineData?.data) {
      return part.inlineData.data
    }
  }

  throw new Error('No image returned from Gemini')
}

export async function generateLinkedInBanner(userData, selfieBuffer) {
  const { name, title, stylePreset = 'founder', skills = [] } = userData
  const style = STYLE_PROMPTS[stylePreset] || STYLE_PROMPTS.founder

  return await generateImage(
    `Professional LinkedIn banner, horizontal 4:1 ratio.
     Style: ${style}
     Left side: name "${name}" in large bold premium typography, 
     title "${title}" below it, thin accent underline, 
     skill tags: ${skills.slice(0, 3).join(', ')}.
     Right side: decorative circle with layered rings and glow.
     Bottom: thin full-width gradient accent line.
     No photos, pure graphic design, premium brand quality.`,
  )
}

export async function generateTwitterBanner(userData, selfieBuffer) {
  const { name, title, stylePreset = 'founder', skills = [], taglines = [] } = userData
  const style = STYLE_PROMPTS[stylePreset] || STYLE_PROMPTS.founder

  return await generateImage(
    `Professional Twitter/X banner, horizontal 3:1 ratio.
     Style: ${style}
     Left: decorative circular frame element with elegant rings.
     Right: name "${name}" very large bold, accent underline,
     title "${title}" below, tagline "${taglines[0] || ''}" italic.
     Bottom colored strip with: ${skills.slice(0, 3).join(' · ')}.
     Premium brand design, no photos.`,
  )
}

export async function generateQuoteGraphic(userData, tagline, selfieBuffer) {
  const { name, title, stylePreset = 'founder' } = userData
  const style = STYLE_PROMPTS[stylePreset] || STYLE_PROMPTS.founder

  return await generateImage(
    `Personal brand quote graphic, perfect square 1:1.
     Style: ${style}
     Large faded decorative quotation mark top-left.
     Center: subtle rounded card containing quote text:
     "${tagline || 'Building something people love'}"
     in bold premium typography.
     Below: thin gradient line, then author section with
     small circular avatar, name "${name}", title "${title}".
     Premium LinkedIn/Instagram post quality.`,
  )
}

export async function generateBusinessCard(userData, selfieBuffer) {
  const { name, title, stylePreset = 'founder', skills = [], email = '', industry = '' } = userData
  const style = STYLE_PROMPTS[stylePreset] || STYLE_PROMPTS.founder

  return await generateImage(
    `Professional digital business card, horizontal layout.
     Style: ${style}
     Left panel 40%: solid accent color background, 
     large circular avatar frame centered, name "${name}" 
     in white below, title "${title}" lighter.
     Right panel 60%: darker background,
     industry "${industry}" small caps top,
     name "${name}" large bold, title "${title}",
     thin accent divider, email "${email}",
     skill pills: ${skills.slice(0, 3).join(', ')}.
     Decorative corner arcs bottom-right.
     No photos, pure graphic design.`,
  )
}

export async function generateProfilePicture(userData, selfieBuffer) {
  const { name, title, stylePreset = 'founder' } = userData
  const style = STYLE_PROMPTS[stylePreset] || STYLE_PROMPTS.founder
  const initials = name
    .trim()
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return await generateImage(
    `Professional personal brand profile picture, perfect square.
     Style: ${style}
     Rich gradient background, glow bloom effects.
     Center: large circular frame 65% of canvas width,
     three layered rings around it in accent color,
     inside circle: gradient fill with initials 
     "${initials}" in large bold white typography.
     Small diamond shapes at top/bottom/left/right of outer ring.
     Bottom: semi-transparent pill showing name "${name}" 
     bold and title "${title}" below it.
     Subtle grain texture overlay. Premium brand identity.`,
  )
}
