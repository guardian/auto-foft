/**
 * Selectively loads @font-face files as two sets:
 *
 * 	- critical (normal weight and normal style)
 * 	- deferred (non-normal weights and styles)
 *
 * By default, it applies the principles of FOFT.
 * See for more info https://www.zachleat.com/web/webfont-glossary/#foft
 */

//  n.b. bundled output is wrapped in try/catch by rollup

import { getFontFaceStylesheet } from './getFontFaceStylesheet';
import { getSets } from './getSets';
import { loadAndApplyFonts } from './loadAndApplyFonts';

// if we can't, or don't need to, do this, just leave it
if ('fonts' in document && document.fonts.status !== 'loaded') {
	const stylesheet = getFontFaceStylesheet();

	if (!stylesheet) {
		console.warn("Could not find '[data-auto-foft-fonts]' stylesheet.");
	} else {
		try {
			// get a list of the currently defined @font-faces
			const fontsFaces = Array.from(document.fonts);

			// disable the existing CSS-connected @font-face definitions
			stylesheet.disabled = true;

			// get the critical and deferred sets
			const { critical, deferred } = getSets(fontsFaces);

			// load and apply the critical set, and then the deferred
			void loadAndApplyFonts(critical)
				.then(() => loadAndApplyFonts(deferred))
				.then(() => {
					// belt and braces, to keep some safaris happy
					stylesheet.disabled = false;
				});
		} catch (e) {
			console.error(e);

			// something went wrong, re-enable the stylesheet and let the browser take over
			stylesheet.disabled = false;
		}
	}
}
