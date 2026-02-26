/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#FF4D0D",
                "primary-hover": "#E83D00",
                cobalt: "#2c3892",
                cobalthover: "#1e266b",
                background: "#F7F5F0",
                surface: "#FFFFFF",
                sidebar: "#111111",
                "sidebar-text": "#F7F5F0",
                border: "#E2E0DA",
                "text-primary": "#111111",
                "text-secondary": "#717171",
            },
            fontFamily: {
                sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
                mono: ['"DM Mono"', 'monospace'],
            },
        },
    },
    plugins: [],
}
