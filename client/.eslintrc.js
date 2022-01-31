module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: ['plugin:react/recommended', 'airbnb', 'plugin:prettier/recommended'],
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 13,
		sourceType: 'module',
	},
	plugins: ['react'],
	ignorePatterns: ['public', 'build', 'node_modules'],
	rules: {
		'prettier/prettier': 'off',
		'import/prefer-default-export': 'off',
		'default-param-last': 'off',
		'react/react-in-jsx-scope': 'off',
		'react/jsx-filename-extension': [
			1,
			{
				extensions: ['.js', '.jsx'],
			},
		],
		'react/function-component-definition': [
			2,
			{
				namedComponents: 'arrow-function',
				unnamedComponents: 'arrow-function',
			},
		],
		'jsx-a11y/click-events-have-key-events': 'off',
		'jsx-a11y/no-static-element-interactions': 'off',
		'jsx-a11y/no-noninteractive-element-interactions': 'off',
		'no-use-before-define': ['error', { functions: false, variables: false }],
	},
};
