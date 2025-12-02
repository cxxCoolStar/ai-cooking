/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'cooking-dark': '#1c1917', // stone-900
                'cooking-card': '#292524', // stone-800
                'cooking-accent': '#f59e0b', // amber-500
                'cooking-light': '#f5f5f4', // stone-100
                'cooking-muted': '#a8a29e', // stone-400
            }
        },
    },
    plugins: [],
}
