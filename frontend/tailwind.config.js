/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,ts}"],
    theme: {
        extend: {
            colors: {
                primary: { DEFAULT: '#0a1628', light: '#132042', dark: '#060e1a' },
                accent: { DEFAULT: '#d4a843', light: '#e8c76a', dark: '#b8912e' },
                surface: { DEFAULT: '#111d33', light: '#1a2a45' },
            },
            fontFamily: { inter: ['Inter', 'sans-serif'] },
        },
    },
    plugins: [],
};
