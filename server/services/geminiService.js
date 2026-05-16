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

  const skillsList = Array.isArray(skills) ? skills : skillList.split(',').map((s) => s.trim()).filter(Boolean)

  const prompt = `You are an expert personal branding 
copywriter. Generate complete brand copy for this person.

Person details:
Name: ${name}
Title: ${title}
Industry: ${industry}
Skills: ${skillsList.join(', ')}
About: ${oneLiner}
Brand style: ${stylePreset}

STRICT REQUIREMENTS — follow exactly:
- linkedinBioShort: exactly 120 characters, punchy, 
  first person, ends with impact not ellipsis
- linkedinBioMedium: exactly 280-320 characters, 
  tells their story, mentions 2 skills, has a CTA
- linkedinBioLong: exactly 480-520 characters, 
  full narrative, background, skills, mission, CTA
- twitterBio: exactly 140-155 characters, 
  punchy, uses | or · as separators between facts
- taglines: array of exactly 3 strings, each 
  between 40-65 characters, completely different 
  from each other, no generic phrases like 
  "passionate about" or "dedicated to"
- elevatorPitch: exactly 2 sentences, first sentence 
  is what they do and for whom, second is the result 
  they deliver
- colorPalette: 5 objects with name and hex, 
  colors must match the ${stylePreset} personality

Return ONLY raw JSON. No markdown. No explanation. 
No backticks. Start your response with { and end with }.`

  const result = await getTextModel().generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  })

  const rawText = result.response.text() || ''

  try {
    return safeParseGeminiJson(rawText)
  } catch (error) {
    throw new Error('Gemini returned invalid JSON')
  }
}
