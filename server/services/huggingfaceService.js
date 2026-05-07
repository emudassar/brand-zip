import axios from 'axios'

const BASE_URL = 'https://api-inference.huggingface.co/models/'
const MODEL = 'stabilityai/stable-diffusion-xl-base-1.0'
const NEGATIVE_PROMPT =
  'blurry, low quality, distorted text, watermark, ugly, bad anatomy, deformed'

const sleep = async (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

const isKnownImageBuffer = (buffer) => {
  if (!buffer || buffer.length < 12) return false

  // PNG
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return true
  }

  // JPEG
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return true
  }

  // WEBP: RIFF....WEBP
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return true
  }

  return false
}

export const callHuggingFace = async (prompt, negativePrompt = NEGATIVE_PROMPT) => {
  const url = `${BASE_URL}${MODEL}`

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await axios.post(
        url,
        {
          inputs: prompt,
          parameters: {
            negative_prompt: negativePrompt,
            num_inference_steps: 25,
          },
          options: {
            wait_for_model: true,
            use_cache: false,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            Accept: 'image/png',
          },
          responseType: 'arraybuffer',
        },
      )

      const contentType = String(response.headers?.['content-type'] || '').toLowerCase()
      const imageBuffer = Buffer.from(response.data)

      if (contentType.startsWith('image/') || isKnownImageBuffer(imageBuffer)) {
        return imageBuffer.toString('base64')
      }

      const apiMessage = imageBuffer.toString('utf8').slice(0, 240)
      throw new Error(`Hugging Face returned non-image response (${contentType || 'unknown'}): ${apiMessage}`)
    } catch (error) {
      const statusCode = error?.response?.status
      if ((statusCode === 503 || statusCode === 429) && attempt < 3) {
        await sleep(15000)
        continue
      }
      throw error
    }
  }

  throw new Error('Hugging Face model unavailable after retries')
}

export const buildStyleKeywords = (stylePreset) => {
  const styleMap = {
    founder: 'modern gradient blue purple bold energetic startup professional',
    developer: 'dark background green cyan terminal code monospace clean tech',
    creator: 'warm orange pink vibrant expressive creative social media',
    corporate: 'navy silver formal serif elegant business professional',
    minimalist: 'white clean minimal black grey editorial luxury whitespace',
  }

  return styleMap[stylePreset] || styleMap.founder
}

export const generateLinkedInBanner = async (name, title, stylePreset) => {
  const styleKeywords = buildStyleKeywords(stylePreset)
  const prompt = `Professional LinkedIn banner image, ${styleKeywords}, person's name '${name}' and title '${title}' shown as text overlay, horizontal banner format 4:1 ratio, high resolution digital art`
  return callHuggingFace(prompt, NEGATIVE_PROMPT)
}

export const generateTwitterBanner = async (name, title, stylePreset) => {
  const styleKeywords = buildStyleKeywords(stylePreset)
  const prompt = `Professional Twitter banner image, ${styleKeywords}, person's name '${name}' and title '${title}' shown as text overlay, horizontal banner format 3:1 ratio, high resolution digital art`
  return callHuggingFace(prompt, NEGATIVE_PROMPT)
}

export const generateQuoteGraphic = async (name, tagline, stylePreset) => {
  const styleKeywords = buildStyleKeywords(stylePreset)
  const prompt = `Professional quote graphic, ${styleKeywords}, quote card design with tagline text '${tagline}' for '${name}', square 1:1 format, high resolution digital art`
  return callHuggingFace(prompt, NEGATIVE_PROMPT)
}

export const generateBusinessCard = async (name, title, email, stylePreset) => {
  const styleKeywords = buildStyleKeywords(stylePreset)
  const prompt = `Professional business card front face, ${styleKeywords}, person's name '${name}', title '${title}', email '${email}' shown as text overlay, horizontal card layout, high resolution digital art`
  return callHuggingFace(prompt, NEGATIVE_PROMPT)
}

export const generateProfilePicture = async (name, title, stylePreset) => {
  const styleKeywords = buildStyleKeywords(stylePreset)
  const prompt = `Professional headshot style portrait avatar, ${styleKeywords}, representing '${name}' as '${title}', studio lighting, no face, AI generated avatar, round frame suggestion, high resolution digital art`
  return callHuggingFace(prompt, NEGATIVE_PROMPT)
}
