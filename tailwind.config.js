/** @type {import('tailwindcss').Config} */
try {
  module.exports = {
    content: [
      './src/**/*.{js,jsx,ts,tsx}',
      './public/index.html',
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            white: '#FFFFFF',
            'dark-gray': '#1A202C',
          },
          secondary: {
            gray: '#4A5568',
          },
          accent: {
            blue: '#4299E1',
          },
        },
        fontFamily: {
          roboto: ['Roboto', 'sans-serif'],
        },
        spacing: {
          '8': '8px',
          '16': '16px',
          '24': '24px',
          '32': '32px',
          '40': '40px',
          '48': '48px',
          '56': '56px',
          '64': '64px',
          '72': '72px',
          '80': '80px',
          '96': '96px',
        },
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
    plugins: [],
    purge: {
      enabled: process.env.NODE_ENV === 'production',
      content: ['./src/**/*.{js,jsx,ts,tsx}'],
      options: {
        safelist: [],
      },
    },
  };
} catch (error) {
  console.error('Tailwind CSS configuration error:', error);
}