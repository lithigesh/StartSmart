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
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-5px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(5px)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-30px) translateX(10px)" },
        },
        "particle-1": {
          "0%": { transform: "translate(0, 0)", opacity: "0.6" },
          "50%": { transform: "translate(50px, -80px)", opacity: "1" },
          "100%": { transform: "translate(100px, -160px)", opacity: "0" },
        },
        "particle-2": {
          "0%": { transform: "translate(0, 0)", opacity: "0.4" },
          "50%": { transform: "translate(-40px, -60px)", opacity: "0.8" },
          "100%": { transform: "translate(-80px, -120px)", opacity: "0" },
        },
        "particle-3": {
          "0%": { transform: "translate(0, 0)", opacity: "0.5" },
          "50%": { transform: "translate(60px, -70px)", opacity: "0.9" },
          "100%": { transform: "translate(120px, -140px)", opacity: "0" },
        },
        "particle-4": {
          "0%": { transform: "translate(0, 0)", opacity: "0.5" },
          "50%": { transform: "translate(-50px, -90px)", opacity: "1" },
          "100%": { transform: "translate(-100px, -180px)", opacity: "0" },
        },
        "grid-move": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "50px 50px" },
        },
        "glow-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)",
            transform: "scale(1)",
          },
          "50%": {
            boxShadow: "0 0 40px rgba(255, 255, 255, 0.2)",
            transform: "scale(1.05)",
          },
        },
        "scroll-reveal": {
          "0%": {
            opacity: "0",
            transform: "translateY(50px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "marquee-fast": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-mobile": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        marquee: "marquee var(--duration, 20s) linear infinite",
        "marquee-vertical":
          "marquee-vertical var(--duration, 20s) linear infinite",
        "marquee-fast": "marquee-fast 30s linear infinite",
        "marquee-mobile": "marquee-mobile 20s linear infinite",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "slide-up": "slide-up 0.8s ease-out forwards",
        shake: "shake 0.5s ease-in-out",
        "slide-in-right": "slide-in-right 0.3s ease-out forwards",
        float: "float 3s ease-in-out infinite",
        "float-slow": "float-slow 4s ease-in-out infinite",
        "particle-1": "particle-1 3s ease-out infinite",
        "particle-2": "particle-2 3.5s ease-out infinite",
        "particle-3": "particle-3 2.8s ease-out infinite",
        "particle-4": "particle-4 3.2s ease-out infinite",
        "grid-move": "grid-move 20s linear infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "scroll-reveal": "scroll-reveal 0.6s ease-out forwards",
      },
      transitionDelay: {
        100: "100ms",
        200: "200ms",
        300: "300ms",
        400: "400ms",
        500: "500ms",
        700: "700ms",
        1000: "1000ms",
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
