import { AnimatePresence, motion } from 'framer-motion'
import {
  AtSign,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Download,
  FileText,
  Image,
  Mic,
  Palette,
  Quote,
  Sparkles,
  Upload,
  User,
  Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const includesItems = [
  {
    icon: Image,
    name: 'LinkedIn Banner',
    description: '1584x396px professional banner with your name and title',
    border: 'border-blue-500/40',
  },
  {
    icon: Image,
    name: 'Twitter/X Banner',
    description: '1500x500px matching your brand style',
    border: 'border-purple-500/40',
  },
  {
    icon: User,
    name: 'Profile Picture',
    description: 'Enhanced version of your selfie, professional look',
    border: 'border-blue-500/40',
  },
  {
    icon: Quote,
    name: 'Quote Graphic',
    description: '1080x1080px shareable card with your tagline',
    border: 'border-purple-500/40',
  },
  {
    icon: CreditCard,
    name: 'Business Card',
    description: 'Digital business card mockup, front face',
    border: 'border-blue-500/40',
  },
  {
    icon: FileText,
    name: '3 LinkedIn Bios',
    description: 'Short, medium, and long versions ready to paste',
    border: 'border-purple-500/40',
  },
  {
    icon: AtSign,
    name: 'Twitter/X Bio',
    description: '160 character punchy bio optimized for your niche',
    border: 'border-blue-500/40',
  },
  {
    icon: Zap,
    name: '3 Taglines',
    description: 'Three options for your personal brand tagline',
    border: 'border-purple-500/40',
  },
  {
    icon: Mic,
    name: 'Elevator Pitch',
    description: 'Two-sentence version of who you are and what you do',
    border: 'border-blue-500/40',
  },
  {
    icon: Palette,
    name: 'Color Palette',
    description: '5 hex codes - your personal brand colors',
    border: 'border-purple-500/40',
  },
]

const stylePresets = [
  {
    name: 'Founder',
    description: 'Bold, modern, YC-style energy.',
    dots: ['#3B82F6', '#8B5CF6', '#FFFFFF'],
    tags: ['Bold', 'Modern', 'High-energy'],
  },
  {
    name: 'Developer',
    description: 'Dark, technical, and clean.',
    dots: ['#22C55E', '#06B6D4', '#0F172A'],
    tags: ['Technical', 'Sharp', 'Terminal'],
  },
  {
    name: 'Creator',
    description: 'Warm, social, and expressive.',
    dots: ['#F97316', '#EC4899', '#FFF7ED'],
    tags: ['Warm', 'Expressive', 'Social'],
  },
  {
    name: 'Corporate',
    description: 'Professional and trustworthy.',
    dots: ['#1E3A8A', '#94A3B8', '#FFFFFF'],
    tags: ['Formal', 'Sharp', 'Trustworthy'],
  },
  {
    name: 'Minimalist',
    description: 'Editorial and refined clarity.',
    dots: ['#020617', '#94A3B8', '#FFFFFF'],
    tags: ['Clean', 'Editorial', 'Refined'],
  },
]

const faqs = [
  {
    q: 'Will my actual face appear in the banners?',
    a: 'Your uploaded photo is used for your profile picture, which gets enhanced and styled. The banners (LinkedIn, Twitter) are branded graphic designs that feature your name, title, and brand colors - not a photo of your face. This makes them look clean and professional.',
  },
  {
    q: 'How long does generation take?',
    a: 'Usually 30 to 60 seconds. Our AI is working on 10 different assets at the same time. You will see a live progress screen while it works.',
  },
  {
    q: 'What file formats will I receive?',
    a: 'All visual assets are delivered as high-quality PNG files. Text assets are included as a formatted text file. Everything arrives in a single ZIP download.',
  },
  {
    q: 'Is this really a one-time payment?',
    a: 'Yes, completely. Pay once, download your kit, done. No subscription, no monthly fees, no hidden charges.',
  },
  {
    q: 'Can I use these assets commercially?',
    a: 'Yes. Once you download your kit, the assets are yours. Use them on your LinkedIn, Twitter, portfolio, business cards, anywhere.',
  },
  {
    q: 'What if I am not happy with the results?',
    a: 'Email us and we will regenerate your kit for free. We want you to look amazing online.',
  },
]

function Landing() {
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToSection = (id) => {
    const element = document.querySelector(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="bg-[#0F172A]">
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          isScrolled ? 'backdrop-blur-md bg-slate-900/80 border-b border-white/5' : ''
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button type="button" className="text-xl font-bold" onClick={() => navigate('/')}>
            <span className="text-white">Brand</span>
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Zip
            </span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/create')}
            className="bg-blue-500 hover:bg-blue-400 text-white rounded-full px-4 sm:px-6 py-2 text-xs sm:text-sm font-semibold transition-all hover:scale-105"
          >
            Create My Kit →
          </button>
        </div>
      </nav>

      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDuration: '6s', animationDelay: '2s' }}
        />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 pt-28 sm:pt-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm rounded-full px-4 py-1.5 mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Personal Branding</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="text-5xl md:text-7xl font-black tracking-tight leading-tight"
          >
            <span className="text-white block">Your Personal Brand.</span>
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              In One Click.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mt-6 leading-relaxed"
          >
            Upload a selfie. Fill your info. Get a complete personal brand kit - LinkedIn banner,
            Twitter banner, bios, business card, and more. Ready to download in 60 seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
          >
            <button
              type="button"
              onClick={() => navigate('/create')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-full px-10 py-4 text-lg hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 transition-all"
            >
              Create My Kit - $29
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('#includes')}
              className="border border-white/20 text-white hover:bg-white/5 rounded-full px-10 py-4 text-lg transition-all"
            >
              See What&apos;s Included ↓
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-sm text-slate-500 mt-4"
          >
            No subscription · No design skills needed · Instant ZIP download
          </motion.p>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-600 animate-bounce">
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>

      <section id="how-it-works" className="py-24 bg-[#0F172A]">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm rounded-full px-4 py-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Simple Process</span>
          </div>
          <h2 className="mt-6 text-4xl md:text-5xl font-bold text-white">
            Three steps to your{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              complete brand kit
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto px-4">
          {[
            {
              number: '01',
              icon: Upload,
              iconStyle: 'text-blue-400 bg-blue-500/10',
              title: 'Upload Your Selfie',
              body: 'Just a clear photo from your phone. No professional shoot needed. We handle the rest.',
            },
            {
              number: '02',
              icon: Sparkles,
              iconStyle: 'text-purple-400 bg-purple-500/10',
              title: 'Fill Your Info',
              body: 'Your name, role, skills, and one sentence about yourself. Takes under 60 seconds.',
            },
            {
              number: '03',
              icon: Download,
              iconStyle: 'text-green-400 bg-green-500/10',
              title: 'Download Your Kit',
              body: '10+ professional brand assets, ready to copy-paste onto LinkedIn, Twitter, and everywhere else.',
            },
          ].map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center relative overflow-hidden"
            >
              <span className="absolute text-8xl font-black text-white/5 bottom-2 right-4">
                {step.number}
              </span>
              <div
                className={`rounded-2xl p-3 w-fit mx-auto mb-4 ${step.iconStyle}`}
                aria-hidden="true"
              >
                <step.icon className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold text-white">{step.title}</h3>
              <p className="text-slate-400 mt-3">{step.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="includes" className="py-24 bg-[#1E293B]">
        <h2 className="text-4xl font-bold text-center text-white">Everything You Get</h2>
        <p className="text-slate-400 text-center mt-4">
          10 professionally generated assets in one kit
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-16 max-w-5xl mx-auto px-4">
          {includesItems.map((item) => (
            <div
              key={item.name}
              className={`bg-[#0F172A] border ${item.border} rounded-xl p-6 transition-all hover:-translate-y-1`}
            >
              <item.icon className="w-6 h-6 text-slate-200 mb-3" />
              <h3 className="text-white font-semibold">{item.name}</h3>
              <p className="text-slate-400 text-sm mt-2">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-[#0F172A]">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-white">Choose Your Vibe</h2>
        <p className="text-slate-400 text-center mt-4">Every asset adapts to your chosen style</p>
        <div className="flex flex-wrap justify-center gap-4 mt-12 px-4">
          {stylePresets.map((preset) => (
            <motion.div
              key={preset.name}
              whileHover={{ y: -6 }}
              className="cursor-pointer border-2 rounded-2xl p-6 w-64 bg-white/5 border-white/10"
            >
              <h3 className="font-bold text-white">{preset.name}</h3>
              <p className="text-slate-400 text-sm mt-2">{preset.description}</p>
              <div className="flex gap-2 mt-4">
                {preset.dots.map((dot) => (
                  <span
                    key={dot}
                    className="w-5 h-5 rounded-full border border-white/20"
                    style={{ backgroundColor: dot }}
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {preset.tags.map((tag) => (
                  <span key={tag} className="bg-white/10 text-xs text-white/60 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-[#1E293B] px-4">
        <div className="max-w-lg mx-auto bg-gradient-to-b from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-3xl p-10 text-center">
          <span className="inline-block bg-blue-500/20 text-blue-300 text-sm px-3 py-1 rounded-full">
            One-time
          </span>
          <div className="mt-6">
            <span className="text-7xl font-black text-white">$29</span>
            <span className="text-slate-400">/one-time</span>
          </div>
          <div className="h-px bg-white/10 my-8" />
          <ul className="space-y-3 text-left">
            {includesItems.map((item) => (
              <li key={item.name} className="text-slate-200 flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => navigate('/create')}
            className="w-full mt-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-full px-10 py-4 text-lg hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 transition-all"
          >
            Create My Brand Kit →
          </button>
        </div>
        <p className="text-slate-500 text-sm text-center mt-6">
          Designer: $300+ · Canva: hours of work · BrandZip: 60 seconds
        </p>
      </section>

      <section className="py-24 bg-[#0F172A] max-w-3xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-white text-center">Common Questions</h2>
        <div className="mt-12">
          {faqs.map((faq, idx) => (
            <div
              key={faq.q}
              className="border-b border-white/10 py-5 cursor-pointer"
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setOpenFaq(openFaq === idx ? null : idx)
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-white font-medium">{faq.q}</h3>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    openFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </div>
              <AnimatePresence initial={false}>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="text-slate-400 leading-relaxed mt-3">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-[#0F172A] border-t border-white/5 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center md:items-end justify-between gap-4">
          <div className="text-center md:text-left">
            <div className="text-xl font-bold">
              <span className="text-white">Brand</span>
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Zip
              </span>
            </div>
            <p className="text-slate-500 text-sm mt-2">Your personal brand. In one click.</p>
          </div>
          <p className="text-slate-500 text-sm italic text-center md:text-right">
            Built for students, developers, and founders.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Landing
