import type { FontFaceSet } from './types';

/**
 * Fetches font files then enables @font-face definitions for each of them simultaneously.
 *
 * @param fonts Array of fontFaces to load
 */
export const loadAndApplyFonts = (fonts: FontFaceSet): Promise<void> =>
	Promise.all(
		fonts.map((font) => {
			void font.load();
			return font.loaded;
		}),
	).then(() => {
		requestAnimationFrame(() => {
			fonts.forEach((font) => {
				document.fonts.add(font);
			});
		});
	});
