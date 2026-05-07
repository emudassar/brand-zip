import { useNavigate } from 'react-router-dom'

function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          404
        </h1>
        <p className="text-slate-300 mt-4">Page not found</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-8 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-full px-8 py-3 transition-all hover:scale-105"
        >
          Go Home
        </button>
      </div>
    </div>
  )
}

export default NotFound
