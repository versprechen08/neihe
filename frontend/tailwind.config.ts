import type { Config } from 'tailwindcss';

export default {
	content: ['./index.html', './src/**/*.{ts,tsx}'],
	theme: {
		extend: {
			colors: {
				pine: '#5B7553', // 松柏绿 — primary
				paper: '#FAF8F5', // 宣纸 — background
				ink: '#1A1A1A', // 墨 — text
				ash: '#777777', // 烟灰 — secondary text
				confucian: '#8B4513', // 儒
				daoist: '#2E5E4E', // 道
				buddhist: '#6B4C8A', // 佛
				'card-border': '#e8e4df',
				'accent-bg': '#5B755312', // reflection box background
			},
			fontFamily: {
				serif: ['"Noto Serif SC"', 'serif'],
				sans: [
					'system-ui',
					'-apple-system',
					'"Segoe UI"',
					'Roboto',
					'sans-serif',
				],
			},
		},
	},
	plugins: [],
} satisfies Config;
