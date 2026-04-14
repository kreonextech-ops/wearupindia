/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Semantic Theme Colors
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        border: 'var(--border)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        
        // Brand Colors (remain constant)
        'wu-red': '#E8161B',
        'wu-red-dark': '#B81015',
        'wu-red-glow': 'rgba(232,22,27,0.15)',
        
        // Legacy colors (phasing out)
        'wu-black': '#0A0A0A',
        'wu-dark': '#111111',
        'wu-white': '#F5F5F5',
        'wu-gray': '#888888',
        'wu-light': '#CCCCCC',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Impact', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E\")",
        'grid-pattern': "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
      },
      keyframes: {
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fadeUp': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-red': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(232,22,27,0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(232,22,27,0)' },
        },
      },
      animation: {
        'marquee': 'marquee 35s linear infinite',
        'marquee-slow': 'marquee 55s linear infinite',
        'fadeUp': 'fadeUp 0.6s ease forwards',
        'pulse-red': 'pulse-red 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
