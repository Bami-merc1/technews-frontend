/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:          '#08111f',
        surface:     '#0d1a2d',
        'surface-2': '#0f2040',
        border:      '#1a2f4a',
        'border-hi': '#2a4a6e',
        accent:      '#00e5ff',
        live:        '#00ff88',
        critical:    '#ff4444',
        high:        '#ff8c00',
        medium:      '#f5c400',
        low:         '#00cc88',
        'text-1':    '#e8f4ff',
        'text-2':    '#7aa8c8',
        'text-3':    '#3d6080',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}