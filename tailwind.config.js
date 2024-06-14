/** @type {import('tailwindcss').Config} */
export default {
  content: ["index.html", "./src/**/*.{html,js,ts}"],
  theme: {
    extend: {
      container: {
        padding: "1.25rem",
        center: true,
        screens: {
          "2xl": "1286px",
        },
      },
      transitionTimingFunction: "ease-in-out",
      transitionDuration: "333ms",
      colors: {
        background: {
          DEFAULT: "rgb(var(--background))",
        },
        foreground: {
          DEFAULT: "rgb(var(--foreground))",
        },
        "button-background": {
          DEFAULT: "rgb(var(--button-background))",
        },
        "button-background-hover": {
          DEFAULT: "rgb(var(--button-background-hover))",
        },
        "button-foreground": {
          DEFAULT: "rgb(var(--button-foreground))",
        },
        "logo-text": {
          DEFAULT: "rgb(var(--logo-text))",
        },
        red: {
          DEFAULT: "rgb(var(--red))",
        },
        blue: {
          DEFAULT: "rgb(var(--blue))",
        },
        cream: {
          DEFAULT: "rgb(var(--cream))",
        },
        grey: {
          DEFAULT: "rgb(var(--grey))",
        },
        disabled: {
          DEFAULT: "rgb(var(--disabled))",
        },
      },
      fontFamily: {
        primary: "Golos Text, sans-serif",
        secondary: "Merriweather, serif",
      },
    },
  },
  plugins: [],
};
