import { nextui } from '@nextui-org/react'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        "our-test-theme": {
          extend: "light", // <- inherit default values from dark theme
          colors: {
            primary: {
              50: '#dcf9ff',
              100: '#b2e9fc',
              200: '#87d9f6',
              300: '#5acaf2',
              400: '#32bbed',
              500: '#1ca1d3',
              600: '#0d7ea5',
              700: '#015a77',
              800: '#00374a',
              900: '#00141d',
              DEFAULT: "#1ca1d3",
              foreground: "#ffffff",
            },
          },
        },
      },
    }),
  ],
};



