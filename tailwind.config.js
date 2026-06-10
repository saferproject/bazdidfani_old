/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		screens: {
			desktop: "1700px",
			tablet: "1200px",
			sm: "640px",
			md: "768px",
			lg: "1024px",
			xl: "1280px",
			"2xl": "1536px",
		},
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
			colors: {
				"primary-light": "#30eca5",
				primary: "#00eb93",
				"primary-dark": "#00be77",
				"secondary-light": "#8f9da7",
				secondary: "#212135",
				fontColor: "#262639",
			},
			fontFamily: {
				"Yekan-Bakh": '"Yekan Bakh FaNum", sans-serif',
				Rokh: '"rokh", sans-serif',
			},
		},
		keyframes: {
			rotateTop: {
				from: { transform: "rotate(0deg) translateY(0.5rem) rotate(0deg)" },
				to: { transform: "rotate(360deg) translateY(0.5rem) rotate(-360deg)" },
			},
			rotateBottom: {
				from: { transform: "rotate(0deg) translateY(-0.5rem) rotate(0deg)" },
				to: { transform: "rotate(360deg) translateY(-0.5rem) rotate(-360deg)" },
			},
			spin: {
				from: { transform: "rotate(0deg)" },
				to: { transform: "rotate(360deg)" },
			},
		},
		animation: {
			rotateTopSmall: "rotateTop 2s infinite linear",
			rotateBottomSmall: "rotateBottom 2s infinite linear",
			spin: "spin 1s infinite linear",
		},
	},
	important: true,
	plugins: [],
};
