/**
 * Get the stylesheet that contains guardian @font-face definitions (id='gu-font-faces').
 * Note that this is _not_ the style element itself.
 * https://developer.mozilla.org/en-US/docs/Web/API/StyleSheet
 */

export const getFontFaceStylesheet = (): CSSStyleSheet | undefined =>
	Array.from(document.styleSheets).find((styleSheet) => {
		const ownerNode = styleSheet.ownerNode as Element;
		if (ownerNode.id) {
			return ownerNode.id === 'gu-font-faces';
		}
	});
