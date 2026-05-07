import axios from 'axios'
import { motion } from 'framer-motion'
import { CheckCheck } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Success() {
  const navigate = useNavigate()

  useEffect(() => {
    const markPaid = async () => {
      const orderId = localStorage.getItem('brandzip_orderId')
      if (!orderId) {
        navigate('/create', { replace: true })
        return
      }

      try {
        await axios.post(`/api/order/${orderId}/paid`)
      } catch (error) {
        // Keep UX smooth even if webhook/manual status already applied.
      }

      setTimeout(() => {
        navigate(`/preview?orderId=${orderId}`)
      }, 2000)
    }

    markPaid()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] px-4">
      <div className="bg-white/5 border border-green-500/20 rounded-3xl p-12 text-center max-w-md w-full">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="w-24 h-24 bg-green-500 rounded-full mx-auto flex items-center justify-center"
        >
          <CheckCheck className="w-12 h-12 text-white" />
        </motion.div>

        <h1 className="text-3xl font-bold text-white mt-6">Payment Successful! 🎉</h1>
        <p className="text-slate-400 mt-2">Preparing your download...</p>

        <div className="mt-6 flex items-center justify-center gap-2">
          <span className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce" />
          <span className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  )
}

export default Success
