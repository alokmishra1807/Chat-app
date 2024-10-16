module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}',  // Adjust paths according to your project structure
    './public/**/*.html',               // Include any HTML files if necessary
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),  // Add DaisyUI as a plugin
  ],
}
