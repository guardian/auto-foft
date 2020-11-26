_work in progress!_

# @guardian/auto-foft

Automatically prioritises and batches downloading fonts and triggering reflows when using CSS `@font-face` declarations.

In other words, it is automated [FOFT](https://www.zachleat.com/web/foft) for CSS.

## Example

```html
<style id="gu-font-faces">
    @font-face {
        font-family: 'my font';
        font-style: normal;
        font-weight: normal;
        src: url('my-font.woff2') format('woff2');
        /* etc */
    }
</style>
<script>
    // @guardian/auto-foft snippet
    !function(){"use strict";try{var n=function(n){return Promise.all(n.map((function(n){return n.load(),n.loaded}))).then((function(){requestAnimationFrame((function(){n.forEach((function(n){document.fonts.add(n)}))}))}))};if("fonts"in document){var t=Array.from(document.styleSheets).find((function(n){var t=n.ownerNode;if(t.id)return"gu-font-faces"===t.id}));if(t)try{var e=Array.from(document.fonts);t.disabled=!0;var r=function(n){return n.reduce((function(n,t){return function(n){return"normal"===n.style&&("normal"===n.weight||"400"===n.weight)}(t)?n.defaults.push(t):n.extras.push(t),n}),{defaults:[],extras:[]})}(e),o=r.defaults,u=r.extras;n(o).then((function(){n(u)}))}catch(n){console.error(n),t.disabled=!1}else console.warn("Could not find 'gu-font-faces' stylesheet.")}}catch(n){console.error(n)}}();
</script>
```

## Benefits

#### Prioritised requests

The font files with the highest impact on the page load first.

#### Minimal reflows

Reflows triggered by font changes are applied in two batches, rather than every time a new font is downloaded.

#### Tiny footprint

411 bytes gzipped.

#### Robust

Falls-back to the original `@font-face` mechanism if something goes wrong.

## Downsides

_All_ declared fonts are fetched, regardless of whether they are used (unlike CSS `@font-face` declarations).

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
