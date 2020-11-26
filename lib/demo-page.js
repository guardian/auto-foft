module.exports = ({ bundle }) => `
	<!DOCTYPE html>
	<html>
		<head>
			<title>font loading test</title>
			<style id="gu-font-faces">
				@font-face {
					font-family: 'Text Egyptian';
					font-style: normal;
					font-weight: 400;
					font-display: swap;
					src: url('//assets.guim.co.uk/static/frontend/fonts/guardian-textegyptian/noalts-not-hinted/GuardianTextEgyptian-Regular.woff2')
							format('woff2'),
						url('//assets.guim.co.uk/static/frontend/fonts/guardian-textegyptian/noalts-not-hinted/GuardianTextEgyptian-Regular.woff')
							format('woff');
				}
				@font-face {
					font-family: 'Text Egyptian';
					font-style: normal;
					font-weight: 500;
					font-display: swap;
					src: url('//assets.guim.co.uk/static/frontend/fonts/guardian-textegyptian/noalts-not-hinted/GuardianTextEgyptian-Bold.woff2')
							format('woff2'),
						url('//assets.guim.co.uk/static/frontend/fonts/guardian-textegyptian/noalts-not-hinted/GuardianTextEgyptian-Bold.woff')
							format('woff');
				}
				@font-face {
					font-family: 'Text Egyptian';
					font-style: italic;
					font-weight: 400;
					font-display: swap;
					src: url('//assets.guim.co.uk/static/frontend/fonts/guardian-textegyptian/noalts-not-hinted/GuardianTextEgyptian-RegularItalic.woff2')
							format('woff2'),
						url('//assets.guim.co.uk/static/frontend/fonts/guardian-textegyptian/noalts-not-hinted/GuardianTextEgyptian-RegularItalic.woff')
							format('woff');
				}
			</style>
			<script>
				${bundle['snippet.js'].code}
			</script>
			<style>
				body {
					font-family: 'Text Egyptian', Georgia, 'Times New Roman', Times,
						serif;
				}
			</style>
		</head>
		<body>
			<ul>
			<li>normal text</li>
			<li><strong>bold text</strong></li>
			<li><em>italic text</em></li>
			<li><strong><em>bold italic text</em></strong></li>
			</ul>
		</body>
	</html>
`;
