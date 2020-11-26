import type { FontFaceSet, Tests } from './types';

type GetSets = (
	fontsFaces: FontFaceSet,
) => { defaults: FontFaceSet; extras: FontFaceSet };

const tests: Tests = window.autoFoft?.defaultRules ?? [
	(fontFace): boolean =>
		fontFace.style === 'normal' &&
		(fontFace.weight === 'normal' || fontFace.weight === '400'),
];

const isInDefaultSet = (fontFace: FontFace) =>
	tests.some((test) => {
		console.log(fontFace, test(fontFace));

		return test(fontFace);
	});

/**
 * Create the two sets of fonts:
 *
 *  - defaults (normal weight and normal style)
 * 	- extras (non-normal weights and styles)
 *
 * This is basically FOFT.
 * See for more info https://www.zachleat.com/web/webfont-glossary/#foft
 *
 * @param fontsFaces Array of fontfaces to split into sets
 */
export const getSets: GetSets = (fontsFaces) =>
	fontsFaces.reduce<{
		defaults: FontFaceSet;
		extras: FontFaceSet;
	}>(
		(acc, fontFace) => {
			if (isInDefaultSet(fontFace)) {
				acc.defaults.push(fontFace);
			} else {
				acc.extras.push(fontFace);
			}
			return acc;
		},
		{ defaults: [], extras: [] },
	);
