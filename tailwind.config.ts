/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#6366f1', // Indigo 500
            foreground: '#ffffff', // White
          },
          secondary: {
            DEFAULT: '#d1d5db', // Gray 300
            foreground: '#374151', // Gray 800
          },
          destructive: {
            DEFAULT: '#dc2626',  // Red 600
            foreground: '#fff',
          },
          muted: {
            DEFAULT: '#f3f4f6', // Gray 100
            foreground: '#6b7280', // Gray 500
          },
          accent: {
            DEFAULT: '#f9fafb', // Gray 50
            foreground: '#1f2937' // Gray 900
          },
          card: {
            DEFAULT: '#fff',
            foreground: '#1f2937'
          },
          border: '#e5e7eb', // Gray 200
          input: '#f9fafb', // Gray 50
        },
        borderRadius: {
          md: '0.375rem', // 6px
          lg: '0.5rem'    // 8px
        }
      },
    },
    plugins: [],
  }