/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
    animation: {
      spin: "spin calc(var(--speed) * 2) infinite linear",
      slide: "slide var(--speed) ease-in-out infinite alternate",
    },
    keyframes: {
      spin: {
        "0%": {
          rotate: "0deg",
        },
        "15%, 35%": {
          rotate: "90deg",
        },
        "65%, 85%": {
          rotate: "270deg",
        },
        "100%": {
          rotate: "360deg",
        },
      },
      slide: {
        to: {
          transform: "translate(calc(100cqw - 100%), 0)",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require('@tailwindcss/typography'), require('@tailwindcss/forms')]
}