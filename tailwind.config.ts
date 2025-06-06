import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: 'var(--primary)',
        'primary-hover': 'var(--primary-hover)',
        'container-bg': 'var(--container-bg)',
        'border-color': 'var(--border-color)',
        'flowey-neutral': 'var(--flowey-neutral)',
        'flowey-happy': 'var(--flowey-happy)',
        'flowey-sad': 'var(--flowey-sad)',
        'flowey-jumpscare': 'var(--flowey-jumpscare)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'undertale-text': 'undertale-text 0.5s ease-out forwards',
        'flowey-idle': 'flowey-idle 3s ease-in-out infinite',
        'flowey-jumpscare': 'flowey-jumpscare 0.5s ease-in-out',
        'spotlight-pulse': 'spotlight-pulse 4s ease-in-out infinite',
        'grass-sway': 'grass-sway 3s ease-in-out infinite',
      },
      keyframes: {
        'undertale-text': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'flowey-idle': {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-5px) scale(1.02)' },
        },
        'flowey-jumpscare': {
          '0%': { transform: 'scale(1) rotate(0deg)', filter: 'brightness(1)' },
          '25%': { transform: 'scale(1.3) rotate(-5deg)', filter: 'brightness(1.5) hue-rotate(180deg)' },
          '50%': { transform: 'scale(1.5) rotate(5deg)', filter: 'brightness(2) hue-rotate(270deg)' },
          '75%': { transform: 'scale(1.2) rotate(-3deg)', filter: 'brightness(1.8) hue-rotate(90deg)' },
          '100%': { transform: 'scale(1.4) rotate(0deg)', filter: 'brightness(1.5) hue-rotate(0deg)' },
        },
        'spotlight-pulse': {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.05)' },
        },
        'grass-sway': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(2deg)' },
          '75%': { transform: 'rotate(-2deg)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
