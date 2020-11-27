import type { FontFaceSet } from './types';

/**
 * Fetches all font files in the set then adds each of them to the document in one go.
 *
 * @param fonts Array of fontFaces to load
 */
export const loadAndApplyFonts = (fonts: FontFaceSet): Promise<void> =>
	Promise.all(
		fonts.map((font) => {
			void font.load();
			return font.loaded;
		}),
	).then(
		() =>
			new Promise((resolve) => {
				requestAnimationFrame(() => {
					fonts.forEach((font) => {
						document.fonts.add(font);
					});
					resolve();
				});
			}),
	);
