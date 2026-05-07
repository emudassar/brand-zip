import axios from 'axios'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Loader2, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const checklist = [
  'Analysing your photo and style preferences...',
  'Writing your bios and taglines...',
  'Designing your LinkedIn banner...',
  'Designing your Twitter banner...',
  'Creating your quote graphic and business card...',
  'Packaging your complete brand kit...',
]

function Generating() {
  const location = useLocation()
  const navigate = useNavigate()
  const orderId = useMemo(() => new URLSearchParams(location.search).get('orderId'), [location.search])
  const [visibleItems, setVisibleItems] = useState(1)
  const [hasFailed, setHasFailed] = useState(false)
  const [failureMessage, setFailureMessage] = useState('')
  const [timeoutReached, setTimeoutReached] = useState(false)
  const consecutivePollErrorsRef = useRef(0)

  useEffect(() => {
    if (!orderId) {
      navigate('/create', { replace: true })
    }
  }, [navigate, orderId])

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleItems((prev) => Math.min(prev + 1, checklist.length))
    }, 7000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!orderId) return

    const poll = setInterval(async () => {
      try {
        const response = await axios.get(`/api/kit/${orderId}`)
        consecutivePollErrorsRef.current = 0
        const status = response.data?.status
        if (status === 'completed') {
          clearInterval(poll)
          navigate(`/preview?orderId=${orderId}`)
        }
        if (status === 'failed') {
          clearInterval(poll)
          setFailureMessage(response.data?.errorMessage || 'Our AI hit an issue. Please go back and try again.')
          setHasFailed(true)
        }
      } catch (error) {
        consecutivePollErrorsRef.current += 1
        if (consecutivePollErrorsRef.current >= 5) {
          clearInterval(poll)
          setFailureMessage('We could not reach the server. Please go back and try again.')
          setHasFailed(true)
        }
      }
    }, 4000)

    const timeout = setTimeout(() => {
      setTimeoutReached(true)
    }, 180000)

    return () => {
      clearInterval(poll)
      clearTimeout(timeout)
    }
  }, [navigate, orderId])

  if (hasFailed) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center px-4 text-center">
        <AlertCircle className="w-16 h-16 text-red-400" />
        <h1 className="text-3xl font-bold text-white mt-6">Something went wrong</h1>
        <p className="text-slate-400 mt-2">
          {failureMessage || 'Our AI hit an issue. Please go back and try again.'}
        </p>
        <button
          type="button"
          onClick={() => navigate('/create')}
          className="mt-8 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-full px-8 py-3 transition-all hover:scale-105"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center px-4">
      <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 animate-orb-pulse flex items-center justify-center">
        <Sparkles className="w-16 h-16 text-white" />
      </div>

      <h1 className="text-3xl font-bold text-white text-center mt-8">Creating Your Brand Kit</h1>
      <p className="text-slate-400 text-center mt-2">Our AI is designing 10 custom assets for you</p>

      <div className="max-w-sm w-full mx-auto mt-12 space-y-3">
        {checklist.slice(0, visibleItems).map((item, idx) => {
          const isCurrent = idx === visibleItems - 1 && visibleItems < checklist.length
          return (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              {isCurrent ? (
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-green-400" />
              )}
              <span className="text-slate-300 text-sm">{item}</span>
            </motion.div>
          )
        })}
      </div>

      {timeoutReached && (
        <p className="text-yellow-400 text-sm mt-8">
          This is taking longer than usual. Please wait a moment...
        </p>
      )}
    </div>
  )
}

export default Generating
