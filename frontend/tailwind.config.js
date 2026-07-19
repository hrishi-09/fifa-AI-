/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0B0F14",
        panel: "#121924",
        panel2: "#19222F",
        border: "#232E3D",
        text: "#F2F5F8",
        muted: "#8394A6",
        muted2: "#5C6B7D",
        pitch: "#39D98A",
        pitchDim: "#1C4A34",
        amber: "#FFB53D",
        amberDim: "#4A3A17",
        red: "#FF5468",
        redDim: "#4A1E26",
        blue: "#4FA9FF",
        blueDim: "#173350",
      },
      fontFamily: {
        display: ["Rajdhani", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: { xl2: "14px" },
    },
  },
  plugins: [],
}
