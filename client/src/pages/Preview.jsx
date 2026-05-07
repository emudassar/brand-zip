import axios from 'axios'
import { CheckCircle2, Copy, Image as ImageIcon, Lock } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { downloadAllAssets } from '../utils/downloadZip'

const assetTeasers = [
  'LinkedIn Banner',
  'Twitter/X Banner',
  'Profile Picture',
  'Quote Graphic',
  'Business Card',
  '3 LinkedIn Bios',
  'Twitter/X Bio',
  '3 Taglines',
  'Elevator Pitch',
  'Color Palette',
]

const checklist = [
  '5 visual assets',
  'LinkedIn bios (3 versions)',
  'Twitter/X bio',
  'Taglines + elevator pitch',
  'Color palette + ZIP download',
]

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="text-xs border border-white/20 text-slate-300 hover:bg-white/10 rounded-full px-3 py-1"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

function Preview() {
  const location = useLocation()
  const navigate = useNavigate()
  const orderId = useMemo(() => new URLSearchParams(location.search).get('orderId'), [location.search])
  const lemonUrl = import.meta.env.VITE_LEMON_SQUEEZY_URL || ''

  const [isPaid, setIsPaid] = useState(false)
  const [assets, setAssets] = useState(null)
  const [activeBioTab, setActiveBioTab] = useState('short')
  const [loadingAssets, setLoadingAssets] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!orderId) {
      navigate('/create', { replace: true })
      return
    }

    const checkAssets = async () => {
      try {
        const response = await axios.get(`/api/kit/${orderId}/assets`)
        if (response.status === 200) {
          setAssets(response.data)
          setIsPaid(true)
        }
      } catch (err) {
        if (err?.response?.status === 404) {
          navigate('/create', { replace: true })
        }
      }
    }

    checkAssets()
  }, [navigate, orderId])

  const fetchAssets = async () => {
    setLoadingAssets(true)
    setError('')
    try {
      const response = await axios.get(`/api/kit/${orderId}/assets`)
      setAssets(response.data)
      setIsPaid(true)
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not load assets yet.')
    } finally {
      setLoadingAssets(false)
    }
  }

  const markAsPaid = async () => {
    if (!orderId) return
    setLoadingAssets(true)
    setError('')
    try {
      await axios.post(`/api/order/${orderId}/paid`)
      await fetchAssets()
    } catch (err) {
      setError(err?.response?.data?.message || 'Payment confirmation failed.')
      setLoadingAssets(false)
    }
  }

  const openPayment = () => {
    if (!lemonUrl || !orderId) {
      setError('Missing Lemon Squeezy URL. Set VITE_LEMON_SQUEEZY_URL in client env.')
      return
    }
    localStorage.setItem('brandzip_orderId', orderId)
    window.open(`${lemonUrl}?orderId=${orderId}`, '_blank')
  }

  const downloadImage = (base64, fileName) => {
    if (!base64) return
    const normalized = String(base64)
    const isDataUrl = normalized.startsWith('data:image/')
    const payload = isDataUrl ? normalized.split(',')[1] || '' : normalized
    const mimeType = isDataUrl && normalized.startsWith('data:image/svg+xml')
      ? 'image/svg+xml'
      : payload.startsWith('/9j/')
        ? 'image/jpeg'
        : payload.startsWith('UklGR')
          ? 'image/webp'
          : payload.startsWith('PHN2Zy')
            ? 'image/svg+xml'
            : 'image/png'
    const ext = mimeType === 'image/jpeg' ? 'jpg' : mimeType === 'image/webp' ? 'webp' : 'png'
    const normalizedExt = mimeType === 'image/svg+xml' ? 'svg' : ext
    const outputName = fileName.replace(/\.(png|jpg|jpeg|webp)$/i, `.${ext}`)
    const link = document.createElement('a')
    link.href = isDataUrl ? normalized : `data:${mimeType};base64,${payload}`
    link.download = outputName.replace(/\.(png|jpg|jpeg|webp)$/i, `.${normalizedExt}`)
    link.click()
  }

  const toImageSrc = (base64) => {
    const normalized = String(base64 || '')
    if (!normalized) return ''
    if (normalized.startsWith('data:image/')) return normalized
    if (normalized.startsWith('/9j/')) return `data:image/jpeg;base64,${normalized}`
    if (normalized.startsWith('UklGR')) return `data:image/webp;base64,${normalized}`
    if (normalized.startsWith('PHN2Zy')) return `data:image/svg+xml;base64,${normalized}`
    return `data:image/png;base64,${normalized}`
  }

  if (!isPaid) {
    return (
      <div className="min-h-screen bg-[#0F172A] px-4 py-14">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Your Brand Kit Is Ready! 🎉
        </h1>
        <p className="text-slate-400 text-center mt-3">Pay once to unlock and download all 10 assets</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-12 max-w-6xl mx-auto">
          {assetTeasers.map((asset) => (
            <div
              key={asset}
              className="bg-white/5 border border-white/10 rounded-xl p-4 aspect-square flex flex-col items-center justify-center relative overflow-hidden"
            >
              <div className="w-full h-20 rounded-lg mb-3 opacity-30 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-blue-500/30 animate-pulse" />
              <Lock className="w-8 h-8 text-slate-600" />
              <p className="text-slate-500 text-xs text-center mt-2">{asset}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-b from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-3xl p-8 text-center max-w-md mx-auto mt-12">
          <p className="text-6xl font-black text-white">$29</p>
          <p className="text-slate-400 text-sm mt-1">one-time · instant download</p>
          <ul className="text-left mt-6 space-y-2">
            {checklist.map((item) => (
              <li key={item} className="flex items-center gap-2 text-slate-200 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                {item}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={openPayment}
            className="w-full mt-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-bold rounded-full py-4 hover:scale-105 transition-all"
          >
            Unlock & Download My Kit →
          </button>
          <button
            type="button"
            onClick={markAsPaid}
            disabled={loadingAssets}
            className="text-slate-300 underline text-sm mt-4"
          >
            I already paid
          </button>
          <p className="text-slate-500 text-xs mt-3">Secure payment via Lemon Squeezy · SSL encrypted</p>
          {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F172A] px-4 py-14">
      <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
        Download Ready! ✓
      </h1>
      <p className="text-slate-400 text-center mt-3">Your complete brand kit has been generated</p>

      <div className="max-w-6xl mx-auto mt-12">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-blue-400" />
          VISUAL ASSETS
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-4">
          {[
            { key: 'originalSelfie', label: 'Uploaded Selfie', file: 'uploaded-selfie.png' },
            { key: 'linkedinBanner', label: 'LinkedIn Banner', file: 'linkedin-banner.png' },
            { key: 'twitterBanner', label: 'Twitter Banner', file: 'twitter-banner.png' },
            { key: 'quoteGraphic', label: 'Quote Graphic', file: 'quote-graphic.png' },
            { key: 'businessCard', label: 'Business Card', file: 'business-card.png' },
            { key: 'profilePicture', label: 'Profile Picture', file: 'profile-picture.png' },
          ].map((item) => (
            <div key={item.key} className="bg-white/5 border border-white/10 rounded-xl p-3">
              <img
                src={toImageSrc(assets[item.key])}
                alt={item.label}
                className="w-full rounded-xl object-cover"
              />
              <p className="text-slate-200 text-sm mt-3">{item.label}</p>
              <button
                type="button"
                onClick={() => downloadImage(assets[item.key], item.file)}
                className="border border-white/20 text-slate-300 hover:bg-white/10 rounded-full px-3 py-1 text-xs mt-2"
              >
                Download
              </button>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold text-white mt-12">TEXT ASSETS</h2>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-4">
          <p className="text-slate-300 text-sm mb-3">Color Palette</p>
          <div className="flex flex-wrap gap-4">
            {(assets.colorPalette || []).map((color) => (
              <div key={color.hex} className="text-center">
                <div
                  className="w-10 h-10 rounded-full border border-white/20 mx-auto"
                  style={{ backgroundColor: color.hex }}
                />
                <p className="text-xs text-slate-200 mt-1">{color.name}</p>
                <p className="text-xs text-slate-400">{color.hex}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-4">
          <div className="flex gap-2 mb-3">
            {[
              { key: 'short', label: 'Short', value: assets.linkedinBioShort || '' },
              { key: 'medium', label: 'Medium', value: assets.linkedinBioMedium || '' },
              { key: 'long', label: 'Long', value: assets.linkedinBioLong || '' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveBioTab(tab.key)}
                className={`px-3 py-1 rounded-full text-xs ${
                  activeBioTab === tab.key ? 'bg-blue-500 text-white' : 'bg-white/10 text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="bg-slate-900/50 rounded-xl p-4 text-slate-200 text-sm">
            {activeBioTab === 'short' && assets.linkedinBioShort}
            {activeBioTab === 'medium' && assets.linkedinBioMedium}
            {activeBioTab === 'long' && assets.linkedinBioLong}
          </div>
          <div className="mt-3">
            <CopyButton
              value={
                activeBioTab === 'short'
                  ? assets.linkedinBioShort
                  : activeBioTab === 'medium'
                    ? assets.linkedinBioMedium
                    : assets.linkedinBioLong
              }
            />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-4">
          <p className="text-slate-300 text-sm mb-2">Twitter/X Bio</p>
          <div className="bg-slate-900/50 rounded-xl p-4 text-slate-200 text-sm">{assets.twitterBio}</div>
          <div className="mt-3">
            <CopyButton value={assets.twitterBio} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {(assets.taglines || []).map((tagline, idx) => (
            <div key={tagline} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-slate-200 text-sm">{tagline}</p>
              <div className="mt-3">
                <CopyButton value={tagline} />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-4">
          <p className="text-slate-300 text-sm mb-2">Elevator Pitch</p>
          <div className="bg-slate-900/50 rounded-xl p-4 text-slate-200 text-sm">{assets.elevatorPitch}</div>
          <div className="mt-3">
            <CopyButton value={assets.elevatorPitch} />
          </div>
        </div>

        <button
          type="button"
          onClick={() => downloadAllAssets(assets, 'brandzip-user')}
          className="w-full max-w-md mx-auto mt-10 block bg-gradient-to-r from-blue-500 to-purple-600 rounded-full py-4 text-lg font-bold text-white hover:scale-105 transition-all"
        >
          Download Complete ZIP
        </button>
      </div>
    </div>
  )
}

export default Preview
