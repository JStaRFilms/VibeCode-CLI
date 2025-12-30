/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eff6ff',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                },
                secondary: {
                    50: '#f1f5f9',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                },
                background: {
                    50: '#ffffff',
                    100: '#f8fafc',
                },
                text: {
                    50: '#1e293b',
                    100: '#0f172a',
                },
                accent: {
                    50: '#ecfdf5',
                    500: '#10b981',
                    600: '#059669',
                    700: '#047857',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                DEFAULT: '12px',
                lg: '16px',
            },
            boxShadow: {
                DEFAULT: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                md: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            },
            animation: {
                'spin-slow': 'spin 2s linear infinite',
            },
        },
    },
    plugins: [],
}