import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  //server: {
  //  host: '192.168.0.232', // Change this to a valid IP address if needed
  //  port: 5172, // Optional, specify your desired port
 // },
});
