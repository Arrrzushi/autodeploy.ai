/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Premium color palette
        electricCyan: '#00E0FF',
        neonPurple: '#9D00FF',
        magentaAccent: '#FF00D4',
        bgDark: {
          DEFAULT: '#05050A',
          lighter: '#0A0B14',
        },
        textGrey: '#8A8FA3',
        lime: '#00FF88',
        aqua: '#00E5FF',
        // Legacy compatibility
        primary: {
          DEFAULT: '#00E0FF',
          dark: '#00B8D4'
        },
        secondary: {
          DEFAULT: '#9D00FF',
          dark: '#7B00CC'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Space Grotesk', 'Inter Tight', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #00E0FF 0%, #9D00FF 100%)',
        'gradient-cyan-purple': 'linear-gradient(135deg, #00E0FF 0%, #9D00FF 50%, #FF00D4 100%)',
        'gradient-text': 'linear-gradient(135deg, #00E0FF 0%, #9D00FF 100%)',
        'mesh-gradient': 'radial-gradient(at 40% 20%, rgba(0, 224, 255, 0.1) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(157, 0, 255, 0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(255, 0, 212, 0.1) 0px, transparent 50%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-neon': 'pulse-neon 3s ease-in-out infinite',
        'gradient-text': 'gradient-text 3s ease infinite',
        'particle-float': 'particle-float 20s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { 
            boxShadow: '0 0 5px rgba(0, 224, 255, 0.5), 0 0 10px rgba(0, 224, 255, 0.3)',
            textShadow: '0 0 10px rgba(0, 224, 255, 0.5)',
          },
          '100%': { 
            boxShadow: '0 0 20px rgba(0, 224, 255, 0.8), 0 0 30px rgba(157, 0, 255, 0.6)',
            textShadow: '0 0 20px rgba(0, 224, 255, 0.8), 0 0 30px rgba(157, 0, 255, 0.6)',
          },
        },
        'pulse-neon': {
          '0%, 100%': { 
            opacity: 1,
            filter: 'brightness(1)',
          },
          '50%': { 
            opacity: 0.8,
            filter: 'brightness(1.2)',
          },
        },
        'gradient-text': {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
        'particle-float': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '25%': { transform: 'translate(20px, -20px) rotate(90deg)' },
          '50%': { transform: 'translate(-20px, 20px) rotate(180deg)' },
          '75%': { transform: 'translate(20px, 20px) rotate(270deg)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 224, 255, 0.5)',
        'glow-purple': '0 0 20px rgba(157, 0, 255, 0.5)',
        'glow-neon': '0 0 20px rgba(0, 224, 255, 0.5), 0 0 40px rgba(157, 0, 255, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      letterSpacing: {
        'wide-heading': '0.1em',
      },
      transitionDuration: {
        '400': '400ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [
    // Note: daisyUI requires CommonJS format
    // If using ES modules, import it separately or convert this file to CommonJS
  ],
}
