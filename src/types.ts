export type FontFaceSet = FontFace[];

declare global {
	interface Window {
		autoFoft?: {
			defaultRules?: Tests;
		};
	}
}

export type Tests = Array<(fontFace: FontFace) => boolean>;
