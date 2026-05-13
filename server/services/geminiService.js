import { GoogleGenerativeAI } from '@google/generative-ai'

function getTextModel() {
  const key = process.env.GEMINI_API_KEY
  if (!key) {
    throw new Error('GEMINI_API_KEY is not set')
  }
  const genAI = new GoogleGenerativeAI(key)
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
}

const SYSTEM_PROMPT =
  'You are a professional personal branding expert. Return ONLY valid JSON. No markdown. No explanation. No code blocks. Raw JSON only.'

const safeParseGeminiJson = (rawText) => {
  const cleaned = (rawText || '').replace(/```json|```/gi, '').trim().replace(/^json\s*/i, '')

  try {
    return JSON.parse(cleaned)
  } catch (firstError) {
    const firstBrace = cleaned.indexOf('{')
    const lastBrace = cleaned.lastIndexOf('}')

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const possibleJson = cleaned.slice(firstBrace, lastBrace + 1)
      return JSON.parse(possibleJson)
    }

    throw firstError
  }
}

export const generateTextAssets = async (userData) => {
  const { name, title, industry, skills, oneLiner, stylePreset } = userData
  const skillList = Array.isArray(skills) ? skills.join(', ') : String(skills || '')

  const userPrompt = `Create a complete personal brand identity text kit for this person:
Name: ${name}
Title: ${title}
Industry: ${industry}
Skills: ${skillList}
About them: ${oneLiner}
Brand style: ${stylePreset} (founder=bold/energetic, developer=technical/sharp, creator=warm/expressive, corporate=formal/trustworthy, minimalist=clean/refined)

Return this exact JSON structure, nothing else:
{
  linkedinBioShort: string under 120 characters,
  linkedinBioMedium: string under 300 characters,
  linkedinBioLong: string under 500 characters,
  twitterBio: string under 160 characters,
  taglines: array of exactly 3 strings each under 60 characters,
  elevatorPitch: string of exactly 2 sentences,
  colorPalette: array of exactly 5 objects each with name string and hex string
}`

  const result = await getTextModel().generateContent({
    contents: [{ role: 'user', parts: [{ text: `${SYSTEM_PROMPT}\n\n${userPrompt}` }] }],
  })

  const rawText = result.response.text() || ''

  try {
    return safeParseGeminiJson(rawText)
  } catch (error) {
    throw new Error('Gemini returned invalid JSON')
  }
}
