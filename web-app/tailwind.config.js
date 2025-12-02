/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'brand-orange': '#FF5722',
                'brand-cream': '#FFF9E6',
                'brand-gray': '#F5F5F5',
                'cooking-dark': '#1c1917',
                'cooking-card': '#292524',
                'cooking-accent': '#f59e0b',
            }
        },
    },
    plugins: [],
}
