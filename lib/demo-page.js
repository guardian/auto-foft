const prettier = require('prettier');

const fonts = {
	'guardian-headline': [
		{
			'GHGuardianHeadline-Black': {
				style: 'normal',
				weight: 900,
			},
		},
		{
			'GHGuardianHeadline-BlackItalic': {
				style: 'italic',
				weight: 900,
			},
		},
		{
			'GHGuardianHeadline-Bold': {
				style: 'normal',
				weight: 700,
			},
		},
		{
			'GHGuardianHeadline-BoldItalic': {
				style: 'italic',
				weight: 700,
			},
		},
		{
			'GHGuardianHeadline-Light': {
				style: 'normal',
				weight: 300,
			},
		},
		{
			'GHGuardianHeadline-LightItalic': {
				style: 'italic',
				weight: 300,
			},
		},
		{
			'GHGuardianHeadline-Medium': {
				style: 'normal',
				weight: 500,
			},
		},
		{
			'GHGuardianHeadline-MediumItalic': {
				style: 'italic',
				weight: 500,
			},
		},
		{
			'GHGuardianHeadline-Regular': {
				style: 'normal',
				weight: 400,
			},
		},
		{
			'GHGuardianHeadline-RegularItalic': {
				style: 'italic',
				weight: 400,
			},
		},
		{
			'GHGuardianHeadline-Semibold': {
				style: 'normal',
				weight: 600,
			},
		},
		{
			'GHGuardianHeadline-SemiboldItalic': {
				style: 'italic',
				weight: 600,
			},
		},
	],
	'guardian-textegyptian': [
		{
			'GuardianTextEgyptian-Black': {
				style: 'normal',
				weight: 900,
			},
		},
		{
			'GuardianTextEgyptian-BlackItalic': {
				style: 'italic',
				weight: 900,
			},
		},
		{
			'GuardianTextEgyptian-Bold': {
				style: 'normal',
				weight: 700,
			},
		},
		{
			'GuardianTextEgyptian-BoldItalic': {
				style: 'italic',
				weight: 700,
			},
		},
		{
			'GuardianTextEgyptian-Medium': {
				style: 'normal',
				weight: 500,
			},
		},
		{
			'GuardianTextEgyptian-MediumItalic': {
				style: 'italic',
				weight: 500,
			},
		},
		{
			'GuardianTextEgyptian-Regular': {
				style: 'normal',
				weight: 400,
			},
		},
		{
			'GuardianTextEgyptian-RegularItalic': {
				style: 'italic',
				weight: 400,
			},
		},
	],
	'guardian-textsans': [
		{ 'GuardianTextSans-Black': { style: 'normal', weight: 'normal' } },
		{
			'GuardianTextSans-BlackItalic': {
				style: 'italic',
				weight: 900,
			},
		},
		{ 'GuardianTextSans-Bold': { style: 'normal', weight: 700 } },
		{
			'GuardianTextSans-BoldItalic': {
				style: 'italic',
				weight: 700,
			},
		},
		{
			'GuardianTextSans-Medium': {
				style: 'normal',
				weight: 500,
			},
		},
		{
			'GuardianTextSans-MediumItalic': {
				style: 'italic',
				weight: 500,
			},
		},
		{
			'GuardianTextSans-Regular': {
				style: 'normal',
				weight: 400,
			},
		},
		{
			'GuardianTextSans-RegularItalic': {
				style: 'italic',
				weight: 400,
			},
		},
	],
	'guardian-titlepiece': [
		{ 'GTGuardianTitlepiece-Bold': { style: 'normal', weight: 700 } },
	],
};

const fontFace = (fontFamily, name, props) =>
	prettier.format(
		`@font-face {
			font-family: ${fontFamily};
			font-style: ${props.style};
			font-weight: ${props.weight};
			font-display: swap;
			src:
				url('//assets.guim.co.uk/static/frontend/fonts/${fontFamily}/noalts-not-hinted/${name}.woff2')
					format('woff2'),
				url('//assets.guim.co.uk/static/frontend/fonts/${fontFamily}/noalts-not-hinted/${name}.woff')
					format('woff');
		}`,
		{ parser: 'css' },
	);

module.exports = ({ bundle }) =>
	`
	<!DOCTYPE html>
	<html>
		<head>
			<title>font loading test</title>
			<style data-auto-foft-fonts>
				${Object.entries(fonts)
					.map(([fontFamily, familyFonts]) =>
						familyFonts
							.map((familyFont) =>
								Object.entries(familyFont)
									.map(([name, props]) =>
										fontFace(fontFamily, name, props),
									)
									.join(''),
							)
							.join(''),
					)
					.join('')}
			</style>
			<script>
				${bundle['snippet.js'].code}
			</script>
			<style>
				body {
					font-size: 200%;
				}
			</style>
		</head>
		<body>
			${prettier.format(
				Object.entries(fonts)
					.map(([fontFamily, familyFonts]) =>
						familyFonts
							.map((familyFont) =>
								Object.entries(familyFont)
									.map(
										([name, props]) =>
											`<span style="font-style: ${props.style}; font-weight: ${props.weight}; font-family: ${fontFamily};">${name}</span> `,
									)
									.join('\n'),
							)
							.join(''),
					)
					.join(''),
				{ parser: 'html' },
			)}

		</body>
	</html>`;
