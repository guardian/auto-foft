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

    const isInDefaultSet = (fontFace) => fontFace.style === 'normal' &&
        (fontFace.weight === 'normal' || fontFace.weight === '400');
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
    const getSets = (fontsFaces) => fontsFaces.reduce((acc, fontFace) => {
        if (isInDefaultSet(fontFace)) {
            acc.defaults.push(fontFace);
        }
        else {
            acc.extras.push(fontFace);
        }
        return acc;
    }, { defaults: [], extras: [] });

    /**
     * Fetches font files then enables @font-face definitions for each of them simultaneously.
     *
     * @param fonts Array of fontFaces to load
     */
    const loadAndApplyFonts = (fonts) => Promise.all(fonts.map((font) => {
        void font.load();
        return font.loaded;
    })).then(() => {
        requestAnimationFrame(() => {
            fonts.forEach((font) => {
                document.fonts.add(font);
            });
        });
    });

    /**
     * Selectively loads @font-face files as two sets:
     *
     * 	- defaults (normal weight and normal style)
     * 	- extras (non-normal weights and styles)
     *
     * This is basically FOFT.
     * See for more info https://www.zachleat.com/web/webfont-glossary/#foft
     *
     * This has the benefit of only repainting twice, rather when each font file arrives.
     * It has the downside that _all_ fonts are fetched, regardless of whether they are used.
     *
     * What it does:
     *
     * 1. get a list of @font-faces already declared in CSS
     * 2. disable them, rendering immediately using fallback fonts
     * 3. split the list of @font-faces into defaults and extras
     * 4. fetch defaults files and enable them in one go
     * 5. fetch extras files and enable them in one go
     */
    if ('fonts' in document) {
        // get a reference to the font styleSheet
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
                // create the default and extras sets
                const { defaults, extras } = getSets(fontsFaces);
                // load and apply the default set, and then the extras
                void loadAndApplyFonts(defaults).then(() => {
                    void loadAndApplyFonts(extras);
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
