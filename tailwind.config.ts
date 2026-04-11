import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          0: '#09090b',
          1: '#121214',
          2: '#18181b',
          3: '#27272a',
          4: '#3f3f46',
        },
        border: {
          subtle: '#27272a',
          DEFAULT: '#3f3f46',
          strong: '#52525b',
        },
        text: {
          primary: '#fafafa',
          secondary: '#a1a1aa',
          tertiary: '#71717a',
          inverted: '#09090b',
        },
        accent: {
          DEFAULT: '#d4d4d8',
          muted: '#a1a1aa',
        },
        status: {
          success: '#4ade80',
          warning: '#facc15',
          error: '#f87171',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
