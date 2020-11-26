export type FontFaceSet = FontFace[];

declare global {
	interface Window {
		autoFoft?: {
			isCritical?: IsCritical;
		};
	}
}

export type IsCritical = (fontFace: FontFace) => boolean;
