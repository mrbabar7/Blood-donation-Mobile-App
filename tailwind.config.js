/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        // 'font-inter' for regular text
        // 'font-inter-bold' for headings
        inter: ["Inter_400Regular"],
        "inter-medium": ["Inter_500Medium"],
        "inter-bold": ["Inter_700Bold"],
      },
    },
  },
  plugins: [],
};
