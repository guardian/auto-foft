/**
 * Get the stylesheet that contains auto-foft @font-face definitions (`style[data-auto-foft-fonts]`).
 * Note that this is _not_ the style element itself.
 * https://developer.mozilla.org/en-US/docs/Web/API/StyleSheet
 */

export const getFontFaceStylesheet = (): CSSStyleSheet | undefined =>
	Array.from(document.styleSheets).find((styleSheet) => {
		const ownerNode = styleSheet.ownerNode as HTMLElement;
		return typeof ownerNode.dataset.autoFoftFonts !== 'undefined';
	});
