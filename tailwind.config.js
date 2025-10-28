/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {backgroundColor: ["hover"],
     colors: {
      brand: {
        bronze: "#A85432",  // accent / luxury highlight
        gray: "#454e52",    // secondary text
        navy: "#0C242E",    // primary brand color (headers, navbar)
        ice: "#DDE8ED",     // background / card contrast
        ebony: "#1F1418",   // deep base (text, footer, hero bg)
      }
    }
    },
    screens: {
      sn: "648px",
      // => @media (min-width: 640px) {...}

      md: "768",
      // => @media (min-width: 768px) {...}

      lg: "1024px",
      // => @media (min-width: 1024px) {...}

      xl: "1280px",
      // => @media (min-width: 1280px) {...}

      "2xl": "1536px",
      // => @media (min-width: 1536px) {...}
    },
    // colors: {
    //   brandmint: "#3ee3d8",
    //   lightgray: "#FAFAFA",
    //   'eba': '#e12',
    //   },
  },
  plugins: [],
}

