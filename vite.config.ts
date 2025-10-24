import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Vercel provides the API_KEY as a build environment variable.
    // This 'define' block makes it available to your client-side code
    // as 'process.env.API_KEY', just like your code expects.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
})
