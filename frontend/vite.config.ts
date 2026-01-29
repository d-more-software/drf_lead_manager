import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	server: {
		host: true,
		port: 5173,
		proxy: {
			// proxy toutes les requêtes vers /api vers Django
			"/api": {
				target: "http://localhost:8000",
				changeOrigin: true,
				secure: false,
			},

			// proxy toutes les requêtes vers /billing vers Django
			"/billing": {
				target: "http://localhost:8000",
				changeOrigin: true,
				secure: false,
			},
		},
	},
});
