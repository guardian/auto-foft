(function () {
    'use strict';

    try {

    /**
     * Get the stylesheet that contains auto-foft @font-face definitions (`style[data-auto-foft-fonts]`).
     * Note that this is _not_ the style element itself.
     * https://developer.mozilla.org/en-US/docs/Web/API/StyleSheet
     */
    const getFontFaceStylesheet = () => Array.from(document.styleSheets).find((styleSheet) => {
        const ownerNode = styleSheet.ownerNode;
        return typeof ownerNode.dataset.autoFoftFonts !== 'undefined';
    });

    var _a, _b;
    const isCritical = (_b = (_a = window.autoFoft) === null || _a === void 0 ? void 0 : _a.isCritical) !== null && _b !== void 0 ? _b : (({ style, weight }) => style === 'normal' && (weight === 'normal' || weight === '400'));
    /**
     * Splits fonts into critical and deferred sets
     *
     * @param fontsFaces The fonts to test
     */
    const getSets = (fontsFaces) => fontsFaces.reduce(({ critical, deferred }, fontFace) => {
        if (isCritical(fontFace)) {
            critical.push(fontFace);
        }
        else {
            deferred.push(fontFace);
        }
        return { critical, deferred };
    }, { critical: [], deferred: [] });

    /**
     * Fetches all font files in the set then adds each of them to the document in one go.
     *
     * @param fonts Array of fontFaces to load
     */
    const loadAndApplyFonts = (fonts) => Promise.all(fonts.map((font) => {
        void font.load();
        return font.loaded;
    })).then(() => new Promise((resolve) => {
        requestAnimationFrame(() => {
            fonts.forEach((font) => {
                document.fonts.add(font);
            });
            resolve();
        });
    }));

    /**
     * Selectively loads @font-face files as two sets:
     *
     * 	- critical (normal weight and normal style)
     * 	- deferred (non-normal weights and styles)
     *
     * By default, it applies the principles of FOFT.
     * See for more info https://www.zachleat.com/web/webfont-glossary/#foft
     */
    // if we can't, or don't need to, do this, just leave it
    if ('fonts' in document && document.fonts.status !== 'loaded') {
        const stylesheet = getFontFaceStylesheet();
        if (!stylesheet) {
            console.warn("Could not find '[data-auto-foft-fonts]' stylesheet.");
        }
        else {
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
            }
            catch (e) {
                console.error(e);
                // something went wrong, re-enable the stylesheet and let the browser take over
                stylesheet.disabled = false;
            }
        }
    }

    }catch(e){console.error(e)}

}());
