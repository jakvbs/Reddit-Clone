module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		fontFamily: {
			body: ['Quicksand'],
		},
		extend: {
			colors: {
				dark: {
					50: '#343536',
					75: '#2A2A2B',
					100: '#D7DADC',
					200: '#C8CBCD',
					300: '#343536',
					400: '#1A1A1B',
					500: '#272729',
					600: '#030303',
					700: '#161617',
					text: '#7F8182',
					hover: '#222223',
					icon: '#818384',
					banner: '#818384',
					border: '#474748',
					icon_hover: '#2D2D2E',
				},
				google: '#df4930',
				google_dark: '#a14030',
				blue: {
					banner: '#004173',
				},
			},
			spacing: {
				70: '17.5rem',
				160: '40rem',
			},
			container: false,
		},
	},
	plugins: [
		({ addComponents }) => {
			addComponents({
				'.container': {
					width: '100%',
					marginLeft: 'auto',
					marginRight: 'auto',
					'@screen sm': { maxWidth: '640px' },
					'@screen md': { maxWidth: '768px' },
					'@screen lg': { maxWidth: '975px' },
				},
			});
		},
	],
};
