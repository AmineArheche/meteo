/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        weather: {
          clearSky: {
            from: '#1e3a8a',
            via: '#3b82f6',
            to: '#60a5fa',
          },
          sunny: {
            from: '#d97706',
            via: '#f59e0b',
            to: '#fbbf24',
          },
          cloudy: {
            from: '#1e293b',
            via: '#334155',
            to: '#64748b',
          },
          rainy: {
            from: '#0f172a',
            via: '#1e293b',
            to: '#3b82f6',
          },
          storm: {
            from: '#090d16',
            via: '#1e1b4b',
            to: '#312e81',
          },
          snow: {
            from: '#0f172a',
            via: '#1e293b',
            to: '#93c5fd',
          },
          night: {
            from: '#030712',
            via: '#0f172a',
            to: '#1e1b4b',
          }
        }
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-reverse': 'floatReverse 7s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite linear',
        'rain': 'rain 0.8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        rain: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(120px)', opacity: '0' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
