import axios from 'axios'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Check,
  CheckCircle2,
  Loader2,
  UploadCloud,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'

const industries = [
  'Technology',
  'Design',
  'Marketing',
  'Finance',
  'Healthcare',
  'Education',
  'Content Creation',
  'Consulting',
  'Other',
]

const styleOptions = [
  {
    value: 'founder',
    name: 'FOUNDER',
    description: 'Bold, modern, high-energy',
    colors: ['#3B82F6', '#8B5CF6', '#FFFFFF'],
    keywords: ['Bold', 'Modern', 'Energetic'],
  },
  {
    value: 'developer',
    name: 'DEVELOPER',
    description: 'Dark, technical, sharp',
    colors: ['#10B981', '#06B6D4', '#1E293B'],
    keywords: ['Technical', 'Clean', 'Sharp'],
  },
  {
    value: 'creator',
    name: 'CREATOR',
    description: 'Warm, expressive, social',
    colors: ['#F97316', '#EC4899', '#FEF3C7'],
    keywords: ['Warm', 'Expressive', 'Creative'],
  },
  {
    value: 'corporate',
    name: 'CORPORATE',
    description: 'Formal, sharp, trustworthy',
    colors: ['#1E3A5F', '#94A3B8', '#FFFFFF'],
    keywords: ['Formal', 'Professional', 'Clean'],
  },
  {
    value: 'minimalist',
    name: 'MINIMALIST',
    description: 'Clean, refined, editorial',
    colors: ['#111111', '#6B7280', '#F9FAFB'],
    keywords: ['Minimal', 'Clean', 'Refined'],
  },
]

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Create() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [selfieFile, setSelfieFile] = useState(null)
  const [selfiePreview, setSelfiePreview] = useState('')
  const [dropzoneError, setDropzoneError] = useState('')
  const [skillInput, setSkillInput] = useState('')
  const [skills, setSkills] = useState([])
  const [selectedStyle, setSelectedStyle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [topError, setTopError] = useState('')
  const [formFields, setFormFields] = useState({
    name: '',
    title: '',
    industry: '',
    oneLiner: '',
    email: '',
  })
  const [touchedFields, setTouchedFields] = useState({
    name: false,
    title: false,
    industry: false,
    oneLiner: false,
    email: false,
    skills: false,
  })

  useEffect(() => {
    return () => {
      if (selfiePreview) {
        URL.revokeObjectURL(selfiePreview)
      }
    }
  }, [selfiePreview])

  const errors = useMemo(() => {
    const nextErrors = {}
    if (formFields.name.trim().length < 2) nextErrors.name = 'Name must be at least 2 characters'
    if (formFields.title.trim().length < 3) {
      nextErrors.title = 'Professional title must be at least 3 characters'
    }
    if (!formFields.industry) nextErrors.industry = 'Please choose an industry'
    if (skills.length < 1) nextErrors.skills = 'Add at least 1 skill'
    if (formFields.oneLiner.trim().length < 20) {
      nextErrors.oneLiner = 'One-liner must be at least 20 characters'
    }
    if (!emailRegex.test(formFields.email.trim())) nextErrors.email = 'Enter a valid email address'
    return nextErrors
  }, [formFields, skills])

  const isStepOneValid = Boolean(selfieFile) && !dropzoneError
  const isStepTwoValid = Object.keys(errors).length === 0

  const onDropAccepted = (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return

    if (selfiePreview) {
      URL.revokeObjectURL(selfiePreview)
    }

    setTopError('')
    setDropzoneError('')
    setSelfieFile(file)
    setSelfiePreview(URL.createObjectURL(file))
  }

  const onDropRejected = (fileRejections) => {
    const message =
      fileRejections[0]?.errors?.[0]?.code === 'file-too-large'
        ? 'File is too large. Please upload an image under 5MB.'
        : 'Invalid file type. Please upload JPG or PNG only.'
    setSelfieFile(null)
    setSelfiePreview('')
    setDropzoneError(message)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    onDropAccepted,
    onDropRejected,
  })

  const nextStep = () => {
    setDirection(1)
    setCurrentStep((prev) => Math.min(prev + 1, 3))
  }

  const prevStep = () => {
    setDirection(-1)
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const updateField = (field, value) => {
    setFormFields((prev) => ({ ...prev, [field]: value }))
    setTopError('')
  }

  const markTouched = (field) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }))
  }

  const addSkill = (value) => {
    const normalized = value.trim()
    if (!normalized || skills.length >= 5) return
    if (skills.some((skill) => skill.toLowerCase() === normalized.toLowerCase())) return
    setSkills((prev) => [...prev, normalized])
    setSkillInput('')
  }

  const onSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addSkill(skillInput)
      markTouched('skills')
    }
  }

  const removeSkill = (skillToRemove) => {
    setSkills((prev) => prev.filter((skill) => skill !== skillToRemove))
    markTouched('skills')
  }

  const handleGenerate = async () => {
    if (!selectedStyle || !isStepOneValid || !isStepTwoValid || isLoading) return

    setIsLoading(true)
    setTopError('')

    try {
      const payload = new FormData()
      payload.append('selfie', selfieFile)
      payload.append('name', formFields.name)
      payload.append('title', formFields.title)
      payload.append('industry', formFields.industry)
      payload.append('oneLiner', formFields.oneLiner)
      payload.append('email', formFields.email)
      payload.append('stylePreset', selectedStyle)
      payload.append('skills', JSON.stringify(skills))

      const response = await axios.post('/api/generate', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (response.status === 202 && response.data?.orderId) {
        localStorage.setItem('brandzip_orderId', response.data.orderId)
        navigate(`/generating?orderId=${response.data.orderId}`)
        return
      }

      throw new Error('Unexpected response from server')
    } catch (error) {
      setIsLoading(false)
      const message = error?.response?.data?.message || error.message || 'Generation failed'
      setTopError(message)
    }
  }

  const stepStatus = {
    1: currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : 'inactive',
    2: currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : 'inactive',
    3: currentStep === 3 ? 'active' : 'inactive',
  }

  const labelClass = 'text-sm text-slate-300 mb-2 block'
  const inputClass =
    'w-full bg-white/5 border border-white/10 focus:border-blue-500 focus:bg-white/8 rounded-xl px-4 py-3 text-white placeholder-slate-600 outline-none transition-all text-sm'

  const renderStep = () => {
    if (currentStep === 1) {
      return (
        <div className="max-w-xl mx-auto px-4 py-12">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-white text-center">Upload Your Selfie</h1>
            <p className="text-slate-400 text-center mt-2 mb-10">A clear photo of your face works best</p>

            <div
              {...getRootProps()}
              className={`border-2 rounded-2xl p-10 transition-all cursor-pointer ${
                isDragActive
                  ? 'border-blue-500 bg-blue-500/10'
                  : dropzoneError
                    ? 'border-red-500/50 bg-red-500/5'
                    : selfieFile
                      ? 'border-green-500/50 bg-green-500/5'
                      : 'border-dashed border-white/20 bg-white/5 hover:bg-white/10 hover:border-blue-500/50'
              }`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-blue-400 font-bold text-xl text-center">Drop it here!</p>
              ) : dropzoneError ? (
                <p className="text-red-400 text-sm text-center">{dropzoneError}</p>
              ) : selfieFile ? (
                <div>
                  <img
                    src={selfiePreview}
                    alt="Selfie preview"
                    className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-green-500/30"
                  />
                  <p className="text-white font-medium text-center mt-4">{selfieFile.name}</p>
                  <p className="text-slate-400 text-sm text-center">
                    {(selfieFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  <button
                    type="button"
                    className="text-red-400 text-sm underline cursor-pointer text-center mt-2 block mx-auto"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelfieFile(null)
                      setSelfiePreview('')
                      setDropzoneError('')
                    }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <UploadCloud className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-white font-medium">Drag your photo here</p>
                  <p className="text-slate-500 text-sm">or click to browse</p>
                  <p className="text-slate-600 text-xs mt-2">Accepts JPG, PNG · Max 5MB</p>
                </div>
              )}
            </div>

            <div className="bg-white/5 rounded-xl p-4 mt-6">
              <p className="text-white text-sm font-medium mb-2">Tips for best results</p>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>· Face clearly visible, looking at camera</li>
                <li>· Good lighting, avoid harsh shadows</li>
                <li>· Plain or simple background preferred</li>
              </ul>
            </div>

            <button
              type="button"
              disabled={!isStepOneValid}
              onClick={nextStep}
              className="w-full mt-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full px-8 py-3 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next: Your Info →
            </button>
          </div>
        </div>
      )
    }

    if (currentStep === 2) {
      return (
        <div className="max-w-xl mx-auto px-4 py-12">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-white text-center">Tell Us About You</h1>
            <p className="text-slate-400 text-center mt-2 mb-10">
              This powers your bios, taglines, and brand copy
            </p>

            <div className="space-y-5">
              {[
                { key: 'name', label: 'Full Name (required)', placeholder: 'e.g. Ahsan Khan' },
                {
                  key: 'title',
                  label: 'Professional Title (required)',
                  placeholder: 'e.g. Frontend Developer · Product Manager · CS Student',
                },
              ].map((field) => (
                <div key={field.key}>
                  <label className={labelClass}>{field.label}</label>
                  <div className="relative">
                    <input
                      className={inputClass}
                      value={formFields[field.key]}
                      placeholder={field.placeholder}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      onBlur={() => markTouched(field.key)}
                    />
                    {!errors[field.key] && formFields[field.key].trim().length > 0 && (
                      <CheckCircle2 className="w-5 h-5 text-green-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                  {touchedFields[field.key] && errors[field.key] && (
                    <p className="text-red-400 text-xs mt-1">{errors[field.key]}</p>
                  )}
                </div>
              ))}

              <div>
                <label className={labelClass}>Industry (required)</label>
                <div className="relative">
                  <select
                    className={inputClass}
                    value={formFields.industry}
                    onChange={(e) => updateField('industry', e.target.value)}
                    onBlur={() => markTouched('industry')}
                  >
                    <option value="" className="bg-slate-900">
                      Select your industry
                    </option>
                    {industries.map((industry) => (
                      <option key={industry} value={industry} className="bg-slate-900">
                        {industry}
                      </option>
                    ))}
                  </select>
                  {!errors.industry && formFields.industry && (
                    <CheckCircle2 className="w-5 h-5 text-green-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                </div>
                {touchedFields.industry && errors.industry && (
                  <p className="text-red-400 text-xs mt-1">{errors.industry}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Skills Tag Input (required, min 1, max 5)</label>
                <input
                  className={inputClass}
                  placeholder="Type a skill and press Enter"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={onSkillKeyDown}
                  onBlur={() => markTouched('skills')}
                  disabled={skills.length >= 5}
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-full px-3 py-1 text-xs flex items-center gap-1"
                    >
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <p className="text-slate-500 text-xs mt-2">{skills.length}/5 skills added</p>
                {touchedFields.skills && errors.skills && (
                  <p className="text-red-400 text-xs mt-1">{errors.skills}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>One-liner (required)</label>
                <div className="relative">
                  <textarea
                    rows={3}
                    maxLength={120}
                    className={inputClass}
                    placeholder="e.g. I build fast, beautiful web apps that solve real problems"
                    value={formFields.oneLiner}
                    onChange={(e) => updateField('oneLiner', e.target.value)}
                    onBlur={() => markTouched('oneLiner')}
                  />
                  {!errors.oneLiner && formFields.oneLiner.trim().length > 0 && (
                    <CheckCircle2 className="w-5 h-5 text-green-400 absolute right-3 top-4" />
                  )}
                </div>
                <p
                  className={`text-xs mt-1 ${
                    formFields.oneLiner.length >= 115
                      ? 'text-red-400'
                      : formFields.oneLiner.length >= 100
                        ? 'text-orange-400'
                        : 'text-slate-500'
                  }`}
                >
                  {formFields.oneLiner.length}/120
                </p>
                {touchedFields.oneLiner && errors.oneLiner && (
                  <p className="text-red-400 text-xs mt-1">{errors.oneLiner}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Email (required)</label>
                <div className="relative">
                  <input
                    className={inputClass}
                    placeholder="your@email.com"
                    value={formFields.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    onBlur={() => markTouched('email')}
                  />
                  {!errors.email && formFields.email.trim().length > 0 && (
                    <CheckCircle2 className="w-5 h-5 text-green-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                </div>
                <p className="text-slate-500 text-xs mt-1">Used only for order tracking</p>
                {touchedFields.email && errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="flex justify-between gap-4 mt-8">
              <button
                type="button"
                onClick={prevStep}
                className="border border-white/20 text-white hover:bg-white/10 rounded-full px-8 py-3 transition-all"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={!isStepTwoValid}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full px-8 py-3 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Your Style →
              </button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-white text-center">Choose Your Style</h1>
          <p className="text-slate-400 text-center mt-2 mb-10">
            This shapes every visual asset we create for you
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {styleOptions.map((style, idx) => {
              const isSelected = selectedStyle === style.value
              return (
                <button
                  key={style.value}
                  type="button"
                  onClick={() => setSelectedStyle(style.value)}
                  className={`text-left border-2 rounded-2xl p-6 cursor-pointer transition-all hover:scale-[1.02] relative ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20 scale-[1.02]'
                      : 'border-white/10 bg-white/5'
                  } ${idx === 4 ? 'sm:col-span-2 sm:max-w-sm sm:mx-auto w-full' : ''}`}
                >
                  {isSelected && <CheckCircle2 className="w-6 h-6 text-blue-400 absolute top-4 right-4" />}
                  <h3 className="text-xl font-bold text-white">{style.name}</h3>
                  <p className="text-slate-400 text-sm mt-1 mb-4">{style.description}</p>
                  <div className="flex gap-2">
                    {style.colors.map((color) => (
                      <span
                        key={color}
                        className="w-6 h-6 rounded-full inline-block border border-white/10"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2 flex-wrap mt-3">
                    {style.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="bg-white/10 text-xs text-white/70 px-2 py-0.5 rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </button>
              )
            })}
          </div>

          <p className="text-slate-500 text-sm text-center mt-4">
            All styles produce professional results. Pick what feels like you.
          </p>

          <div className="flex justify-between gap-4 mt-8">
            <button
              type="button"
              onClick={prevStep}
              className="border border-white/20 text-white hover:bg-white/10 rounded-full px-8 py-3 transition-all"
            >
              ← Back
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={isLoading || !selectedStyle}
          className="w-full max-w-2xl mx-auto mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full py-5 text-xl font-bold text-white transition-all hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating your kit...
            </span>
          ) : (
            'Generate My Brand Kit ✦'
          )}
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F172A] pb-10">
      <div className="sticky top-0 z-30 bg-[#0F172A] py-6 border-b border-white/10 px-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-start justify-between">
            {[1, 2, 3].map((step, idx) => {
              const status = stepStatus[step]
              const circleClass =
                status === 'completed'
                  ? 'border-green-500 bg-green-500 text-white'
                  : status === 'active'
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-white/20 text-slate-500'
              const labelColor =
                status === 'active' || status === 'completed' ? 'text-slate-200' : 'text-slate-500'

              return (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center min-w-[70px]">
                    <div
                      className={`w-9 h-9 rounded-full border flex items-center justify-center text-sm font-semibold ${circleClass}`}
                    >
                      {status === 'completed' ? <Check className="w-4 h-4" /> : step}
                    </div>
                    <span className={`text-xs mt-2 ${labelColor}`}>
                      {step === 1 ? 'Upload' : step === 2 ? 'Your Info' : 'Your Style'}
                    </span>
                  </div>
                  {idx < 2 && (
                    <div
                      className={`h-px flex-1 mx-2 mt-4 ${
                        currentStep > step ? 'bg-green-500' : currentStep === step ? 'bg-blue-500/60' : 'bg-white/10'
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {topError && (
        <div className="max-w-2xl mx-auto px-4 mt-6">
          <div className="border border-red-500/30 bg-red-500/10 text-red-300 rounded-xl px-4 py-3 text-sm">
            {topError}
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: direction * 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -direction * 60 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default Create
