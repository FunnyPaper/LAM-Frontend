import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            "lam-frontend": path.resolve(__dirname, "./src")
        }
    },
    plugins: [
        react(), 
        dts({
            insertTypesEntry: true,
            outDir: "dist",
            tsconfigPath: path.resolve(__dirname, "tsconfig.dts.json")
        })
    ],
    build: {
        lib: {
            entry: "src/index.ts",
            name: "LAMFrontend",
            fileName: 'index',
            formats: ['es', 'cjs']
        },
        rollupOptions: {
            external: [
                'react', 
                'react-dom',
                "@mui/icons-material",
                "@mui/material",
                "@emotion/react",
                "@emotion/styled"
            ]
        },
    }
})
