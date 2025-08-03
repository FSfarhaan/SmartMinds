/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#F7FCFC",
        primary: "#1672EC",
        secondary: "#3F51B5",
        tertiary: "#5C6BC0",
        unselected: {
          light: "#7C84A3",
          dark: "#404454"
        },
        greenShade: {
          light: "#DCFFD5",
          dark: "#50AD96"
        },
        redShade: {
          light: "#FEE3DE",
          dark: "#F4786F"
        }
      }
    },
  },
  plugins: [],
}