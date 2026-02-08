/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'brand-purple': '#8B5CF6',
                'brand-coral': '#FF6B6B',
                'brand-sidebar': '#0F0F14',
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
