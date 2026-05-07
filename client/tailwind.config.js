/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bgPrimary: '#0F172A',
        bgSecondary: '#1E293B',
        accentBlue: '#3B82F6',
        accentPurple: '#8B5CF6',
        successGreen: '#10B981',
        errorRed: '#EF4444',
        textPrimary: '#F8FAFC',
        textSecondary: '#94A3B8',
        borderColor: '#334155',
      },
    },
  },
  plugins: [],
}
