try {
  module.exports = {
    plugins: [
      require('tailwindcss'),
      require('autoprefixer'),
    ],
  };
} catch (error) {
  console.error('PostCSS configuration error:', error);
  throw error;
}