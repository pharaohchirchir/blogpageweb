// tailwind.config.js
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}", // or wherever your files are
    ],
    theme: {
      extend: {},
    },
    plugins: [
      require('@tailwindcss/line-clamp'),
    ],
  };
  