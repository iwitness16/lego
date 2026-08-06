/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1180px",
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        paper: "#F5F7FB",
        surface: "#FFFFFF",
        ink: {
          DEFAULT: "#182338",
          soft: "#3C4A64",
          muted: "#6B7690",
        },
        line: "#E4E8F1",
        brand: {
          50: "#EEF3FC",
          100: "#DCE8F8",
          200: "#B3CBEE",
          300: "#7FA6E0",
          400: "#4C7FCF",
          500: "#2A5FB8",
          600: "#1E4694",
          700: "#183876",
          800: "#152D5D",
          900: "#0F1E3E",
        },
        stud: {
          DEFAULT: "#FFC94D",
          dark: "#EAA412",
        },
        clay: {
          DEFAULT: "#E1543B",
          dark: "#C13F29",
        },
        leaf: "#3E9C6F",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        data: ["var(--font-data)", "monospace"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15, 30, 62, 0.04), 0 8px 24px -12px rgba(15, 30, 62, 0.14)",
        card: "0 1px 2px rgba(15, 30, 62, 0.05), 0 12px 28px -14px rgba(15, 30, 62, 0.18)",
        lift: "0 20px 45px -18px rgba(15, 30, 62, 0.28)",
      },
      backgroundImage: {
        "stud-row":
          "radial-gradient(circle, rgba(255,255,255,0.55) 0 2px, transparent 2.5px)",
      },
    },
  },
  plugins: [],
};
