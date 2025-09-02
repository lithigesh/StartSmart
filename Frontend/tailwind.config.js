module.exports = {
  content: [
    "./src/**/*.{html,js,jsx}",
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        "shades-0": "var(--shades-0)",
        // StartSmart Design System Colors
        "dark-bg": "#0d0d0d",
        "dark-bg-hover": "#151515",
        "text-primary": "#ffffff",
        "text-secondary": "#ffffff99",
        "text-muted": "#828282",
        "text-muted-hover": "#a0a0a0",
        "border-primary": "rgba(255, 255, 255, 0.2)",
        "border-hover": "rgba(255, 255, 255, 0.4)",
        "border-muted": "rgba(255, 255, 255, 0.1)",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      maxWidth: {
        content: "833px",
        section: "1200px",
        cta: "1308px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
        manrope: ["Manrope", "Helvetica", "sans-serif"],
        poppins: ["Poppins", "Helvetica", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(calc(-100% - var(--gap, 30px)))" },
        },
        "marquee-vertical": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(calc(-100% - var(--gap, 30px)))" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        marquee: "marquee var(--duration, 20s) linear infinite",
        "marquee-vertical":
          "marquee-vertical var(--duration, 20s) linear infinite",
      },
    },
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
  },
  plugins: [require("daisyui")],
  darkMode: ["class"],
  daisyui: {
    themes: [
      {
        blackwhite: {
          primary: "#ffffff",
          secondary: "#000000",
          accent: "#ffffff",
          neutral: "#000000",
          "base-100": "#000000",
          "base-200": "#0d0d0d",
          "base-300": "#1a1a1a",
          info: "#ffffff",
          success: "#ffffff",
          warning: "#ffffff",
          error: "#ffffff",
        },
      },
    ],
    base: false,
    styled: true,
    utils: true,
  },
};
