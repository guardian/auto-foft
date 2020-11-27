import type { FontFaceSet, IsCritical } from './types';

type GetSets = (
	fontsFaces: FontFaceSet,
) => { critical: FontFaceSet; deferred: FontFaceSet };

const isCritical: IsCritical =
	window.autoFoft?.isCritical ??
	(({ style, weight }: FontFace): boolean =>
		style === 'normal' && (weight === 'normal' || weight === '400'));

/**
 * Splits fonts into critical and deferred sets
 *
 * @param fontsFaces The fonts to test
 */
export const getSets: GetSets = (fontsFaces) =>
	fontsFaces.reduce<{
		critical: FontFaceSet;
		deferred: FontFaceSet;
	}>(
		(acc, fontFace) => {
			if (isCritical(fontFace)) {
				acc.critical.push(fontFace);
			} else {
				acc.deferred.push(fontFace);
			}
			return acc;
		},
		{ critical: [], deferred: [] },
	);
