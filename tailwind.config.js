/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        neo: {
          50: '#e8f8ff',
          100: '#c7efff',
          200: '#98e1ff',
          300: '#5fd0ff',
          400: '#20b8ff',
          500: '#0094ff',
          600: '#0075db',
          700: '#005aa9',
          800: '#083d73',
          900: '#041f3d',
        },
        night: {
          950: '#04050a',
          900: '#070b14',
          850: '#0b1120',
          800: '#101827',
        },
      },
      boxShadow: {
        glow: '0 0 25px rgba(0, 148, 255, 0.35)',
        'glow-strong': '0 0 45px rgba(0, 148, 255, 0.5)',
      },
      backgroundImage: {
        'mesh-grid': 'radial-gradient(circle at 1px 1px, rgba(95,208,255,0.18) 1px, transparent 0)',
        'hero-radial': 'radial-gradient(circle at top, rgba(32,184,255,0.2), transparent 42%), linear-gradient(180deg, rgba(6,9,18,0.88), rgba(4,5,10,1))',
      },
      backdropBlur: {
        xs: '2px',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        pulseGlow: 'pulseGlow 3.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 rgba(0,148,255,0)' },
          '50%': { boxShadow: '0 0 32px rgba(0,148,255,0.3)' },
        },
      },
    },
  },
  plugins: [],
};
