# auto-foft

> Automated [FOFT](https://www.zachleat.com/web/foft) for CSS fonts (`@font-face`).

## Example

### Default behaviour

1. `my-font.woff2` will be downloaded and applied first
2. `my-font-bold.woff2` and `my-font-italic.woff2` will be downloaded and applied second

```html
<style data-auto-foft-fonts>
    @font-face {
        font-family: 'my font';
        font-style: normal;
        font-weight: normal;
        src: url('my-font.woff2') format('woff2');
    }
    @font-face {
        font-family: 'my font';
        font-style: normal;
        font-weight: bold;
        src: url('my-font-bold.woff2') format('woff2');
    }
    @font-face {
        font-family: 'my font';
        font-style: italic;
        font-weight: normal;
        src: url('my-font-italic.woff2') format('woff2');
    }
</style>
<script>
    // auto-foft snippet – 497 bytes (gzipped)
    !function(){"use strict";try{const e=()=>Array.from(document.styleSheets).find((o=>void 0!==o.ownerNode.dataset.autoFoftFonts));var o,t;const s=null!==(t=null===(o=window.autoFoft)||void 0===o?void 0:o.defaultRules)&&void 0!==t?t:[o=>"normal"===o.style&&("normal"===o.weight||"400"===o.weight)],n=o=>s.some((t=>(console.log(o,t(o)),t(o)))),a=o=>o.reduce(((o,t)=>(n(t)?o.defaults.push(t):o.extras.push(t),o)),{defaults:[],extras:[]}),d=o=>Promise.all(o.map((o=>(o.load(),o.loaded)))).then((()=>{requestAnimationFrame((()=>{o.forEach((o=>{document.fonts.add(o)}))}))}));if("fonts"in document){const o=e();if(o)try{const t=Array.from(document.fonts);o.disabled=!0;const{defaults:e,extras:s}=a(t);d(e).then((()=>{d(s)}))}catch(t){console.error(t),o.disabled=!1}else console.warn("Could not find '[data-auto-foft-fonts]' stylesheet.")}}catch(o){console.error(o)}}();
</script>
```

### Custom behaviour

You can override the default behaviour by providing an array of functions to test each font with:

```js
window.autoFoft = {
    defaultRules: [({ style }) => style === 'italic'],
};
```

If `auto-foft` finds this config, it will test fonts against each of the rules you provide. If a rule returns `true`, the font will be added to the _defaults_ set.

Functions are passed the [`FontFace`](https://developer.mozilla.org/en-US/docs/Web/API/FontFace) object for each font, and should return `true` or `false`.

With this config:

1. `my-font-italic.woff2` will be downloaded and applied first
2. `my-font.woff2` and `my-font-bold.woff2` will be downloaded and applied second

Note that this disables the default behaviour. You can recreate the default by adding matching rule:

```js
window.autoFoft = {
    defaultRules: [
        ({ style }) => style === 'italic',

        // default rule
        ({ style }) =>
            style === 'normal' && (weight === 'normal' || weight === '400'),
    ],
};
```

## Usage

1. Put your `@font-face` rules (and only them) in a `<style data-auto-foft-fonts>` element.
2. Add any config, then [the snippet](dist/snippet.min.js), immediately after.

```html
<style data-auto-foft-fonts>
    /* @font-faces in here */
</style>
<script>
    // - optional config here
    // - then the snippet here
</script>
```

## Benefits

#### Prioritised requests

The font files with the highest impact on the page load first.

#### Minimal reflows

Reflows triggered by font changes are applied in two batches, rather than every time a new font is downloaded.

#### Tiny footprint

497 bytes (gzipped).

#### Unobtrusive

No `.font-loaded`-style classes needed.

#### Robust

Falls-back to the original `@font-face` mechanism if something goes wrong.

## Downsides

_All_ declared fonts are fetched, regardless of whether they are used (unlike pure CSS `@font-face` declarations).

## How it works

-   gets a list of fonts already declared in CSS and divides them into two sets:
    -   _defaults_ (`font-weight: normal` and `font-style: normal`)
    -   _extras_ (all other weights and styles)
-   disables the CSS-connected fonts – the page will render using fallback fonts (initial flow)
-   downloads the _defaults_ set
-   applies the fonts in the _defaults_ set in one pass (first reflow)
    -   **bold** and _italic_ styles will be rendered using faux styles
-   downloads the _extras_ set
-   applies the fonts in the _extras_ set in one pass (second reflow)

As with CSS `@font-face` declarations, if the font files are cached locally the browser can use them immediately (initial flow only).

## Further options

To speed up the initial display even further, [`<link rel="preload" as="font" />`](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content) the fonts that you know will fall into the _defaults_ set.
