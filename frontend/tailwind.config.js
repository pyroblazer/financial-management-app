/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "1020px",
      xl: "1440px",
    },
    extend: {
      colors: {
        lightBlue: "hsl(220, 100%, 60%)",
        darkBlue: "hsl(210, 50%, 40%)",
        purple: "hsl(270, 80%, 55%)"
      },
      fontFamily: {
        sans: ["Verdana", "sans-serif"],
      },
      spacing: {
        180: "32rem",
      },
      transitionProperty: {
        'width': 'width',
        'height': 'height',
        'opacity': 'opacity',
        'custom': 'all',
      },
      transitionTimingFunction: {
        'ease-in-out-custom': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
