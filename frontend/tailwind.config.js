/** @type {import('tailwindcss').Config} */
const svgToDataUri = require("mini-svg-data-uri");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");
module.exports = {
  content: ["./src/**/*.{ts,tsx}", "./_app.tsx"],
  theme: {
    extend: {
      animation: {
        "text-shimmer": "text-shimmer 2.5s ease-out infinite alternate",
      },
      keyframes: {
        "text-shimmer": {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "-100% 0" },
        },
      },
      colors: {
        primary: "#f59e0b",
        secondary: "#3C4048", 
        tertiary: "#B2B2B2",
        quaternary: "#EAEAEA",
        darkbg: "#171717",
        darktext: "#e5e7eb",
        darkaccent: "#262626",
        vulcan: {
          50: "#f4f4f4",
          100: "#e8e8e9",
          200: "#c6c6c8",
          300: "#a4a4a7",
          400: "#605f64",
          500: "#1c1b22",
          600: "#19181f",
          700: "#15141a",
          800: "#111014",
          900: "#0e0d11",
        },
      },
    },
  },
  darkMode: 'class',
  daisyui: {
    themes: ["light"]
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require('daisyui'),
    function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "bg-grid": (value) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
            )}")`,
          }),
          "bg-dot": (value) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
            )}")`,
          }),
          "bg-grid-large": (value) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="64" height="64" fill="none" stroke="${value}" stroke-width="0.5"><path d="M0 .5H31.5V32"/></svg>`
            )}")`,
          }),
          "bg-grid-extrasmall": (value) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
            )}")`,
          }),
        },
        {
          values: flattenColorPalette(theme("backgroundColor")),
          type: "color",
        }
      );
    },
    function({ addVariant }) {
      addVariant('group-grandparent-hover', ':merge(.group-grandparent):hover &');
      addVariant('group-parent-hover', ':merge(.group-parent):hover &');
    },
  ],
};
