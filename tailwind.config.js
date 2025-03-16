/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
       colors:{
        'brand-green':'#758657',
        'brand-beige':'#F3F3E8',
        'brand-green-dark':'#465232'
       },
       fontFamily:{
        'Arial':'Arial'
       }
    },
  },
  plugins: [],
}


