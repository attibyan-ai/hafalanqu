import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#0F7B53",
          50: "#E7F6EE",
          100: "#C5EAD8",
          200: "#8DD5B1",
          300: "#55C08A",
          400: "#1DAB63",
          500: "#0F7B53",
          600: "#0C6344",
          700: "#094B33",
          800: "#063322",
          900: "#031B11",
          foreground: "#FFFFFF",
        },
        dark: {
          DEFAULT: "#071A17",
          50: "#E8EDEC",
          100: "#B8C8C4",
          200: "#88A39C",
          300: "#587E74",
          400: "#28594C",
          500: "#071A17",
          600: "#061513",
          700: "#05100E",
          800: "#030B0A",
          900: "#020605",
        },
        accent: {
          DEFAULT: "#E7F6EE",
          foreground: "#0F7B53",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          light: "hsl(var(--success-light))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          light: "hsl(var(--warning-light))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          light: "hsl(var(--info-light))",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        amiri: ["var(--font-amiri)", "serif"],
      },
      fontSize: {
        "display-lg": ["3.5rem", { lineHeight: "1.1", fontWeight: "700", letterSpacing: "-0.02em" }],
        "display": ["3rem", { lineHeight: "1.15", fontWeight: "700", letterSpacing: "-0.02em" }],
        "display-sm": ["2.25rem", { lineHeight: "1.2", fontWeight: "700", letterSpacing: "-0.01em" }],
        "heading-lg": ["1.875rem", { lineHeight: "1.3", fontWeight: "600" }],
        "heading": ["1.5rem", { lineHeight: "1.35", fontWeight: "600" }],
        "heading-sm": ["1.25rem", { lineHeight: "1.4", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        "body": ["1rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5" }],
        "caption": ["0.75rem", { lineHeight: "1.5" }],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        "soft": "0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 4px 16px -4px rgba(0, 0, 0, 0.08)",
        "soft-md": "0 4px 12px -2px rgba(0, 0, 0, 0.06), 0 8px 24px -4px rgba(0, 0, 0, 0.1)",
        "soft-lg": "0 8px 24px -4px rgba(0, 0, 0, 0.08), 0 16px 48px -8px rgba(0, 0, 0, 0.12)",
        "glow-primary": "0 0 20px -4px rgba(15, 123, 83, 0.3)",
      },
      spacing: {
        "4.5": "1.125rem",
        "13": "3.25rem",
        "15": "3.75rem",
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out forwards",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "slide-in-left": "slide-in-left 0.4s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
        "shimmer": "shimmer 2s infinite linear",
        "float": "float 6s ease-in-out infinite",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
      },
      transitionDuration: {
        "250": "250ms",
        "350": "350ms",
        "400": "400ms",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
};

export default config;
