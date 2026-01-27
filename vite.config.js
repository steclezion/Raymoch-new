import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react'
import fg from 'fast-glob';


const reactEntries = fg.sync('resources/js/pages/**/*.{js,jsx,ts,tsx,css,scss,sass,less}', {
  onlyFiles: true,
  unique: true,
}).filter(Boolean);


const reactcomponents_pricing = fg.sync('resources/js/components/pricing/**/*.{js,jsx,ts,tsx}', {
  onlyFiles: true,
  unique: true,
}).filter(Boolean);


const reactcomponents_signup = fg.sync('resources/js/components/signup/**/*.{js,jsx,ts,tsx}', {
  onlyFiles: true,
  unique: true,
}).filter(Boolean);

const reactcomponents_layout_master = fg.sync('resources/js//**/*.{js,jsx,ts,tsx}', {
  onlyFiles: true,
  unique: true,
}).filter(Boolean);





export default defineConfig({
     build: {
    chunkSizeWarningLimit: 1000, // 1 MB
  },
    plugins: [
        laravel({
            input: ['resources/css/app.css',
                'resources/js/app.js',
                'resources/js/app.jsx',
                 'resources/js/styles/companies.css',
                'resources/js/styles/company-detail-dialog.css',
                'resources/js/styles/companies.css',
                'resources/js/styles/company-detail-dialog.css',

                ...reactEntries,
                ...reactcomponents_pricing,
            ...reactcomponents_signup,

             ],
            refresh: true,
        }),
          react(),
    ],
});


