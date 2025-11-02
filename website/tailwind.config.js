/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './docs/**/*.{md,mdx}',
    './blog/**/*.{md,mdx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // OMEGA Brotherhood Theme
        omega: {
          primary: '#0066CC',      // Deep Azure
          secondary: '#00A9E0',    // Cyber Blue
          accent: '#FFD700',       // Gold (Brotherhood)
          dark: '#0A0E27',         // Deep Space
          darker: '#050810',       // Void Black
          light: '#F8FAFC',        // Pure White
          gray: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
            400: '#9CA3AF',
            500: '#6B7280',
            600: '#4B5563',
            700: '#374151',
            800: '#1F2937',
            900: '#111827',
          },
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          '"JetBrains Mono"',
          '"Fira Code"',
          'Consolas',
          'Monaco',
          'monospace',
        ],
        display: [
          '"Space Grotesk"',
          'system-ui',
          'sans-serif',
        ],
      },
      boxShadow: {
        'omega': '0 0 20px rgba(0, 102, 204, 0.3)',
        'omega-lg': '0 0 40px rgba(0, 102, 204, 0.4)',
        'brotherhood': '0 0 30px rgba(255, 215, 0, 0.2)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 102, 204, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 102, 204, 0.8)' },
        },
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Disable Tailwind's base reset to avoid conflicts with Docusaurus
  },
};
