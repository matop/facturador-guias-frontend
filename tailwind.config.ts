import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        lucien: {
          50: '#e8eaf6',
          100: '#c5cae9',
          200: '#9fa8da',
          500: '#505daa',
          700: '#3d4a8a',
          900: '#2a3570',
        },
        danger: {
          50: '#3A1010',
          100: '#4A1515',
          600: '#DC2626',
          700: '#B91C1C',
        },
        warning: {
          50: '#332510',
          100: '#4A3517',
          600: '#F59E0B',
          700: '#B45309',
        },
        success: {
          DEFAULT: '#16A34A',
          50: '#10281B',
          100: '#1A3D28',
          600: '#22C55E',
        },
        category: {
          receptor: '#60A5FA',
          detalle: '#A78BFA',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
