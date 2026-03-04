import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1B2A4A',
          light: '#2A3F6A',
          dark: '#111C33',
        },
        orange: {
          DEFAULT: '#E8702A',
          light: '#F09050',
          dark: '#C55A1A',
        },
        warm: {
          white: '#F7F5F2',
          gray: '#E8E6E3',
          dark: '#666666',
        },
        risk: {
          low: '#22C55E',
          medium: '#F59E0B',
          high: '#EF4444',
        },
        status: {
          draft: '#94A3B8',
          generated: '#3B82F6',
          sent: '#F59E0B',
          signed: '#22C55E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
