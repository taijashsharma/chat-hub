/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",

        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",

        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",

        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",

        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",

        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",

        saffron: "var(--saffron)",
        "india-green": "var(--india-green)",
        "camo-dark": "var(--camo-dark)"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      }
    },
  },
  
}
