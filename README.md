# auto-foft

> Automated [FOFT](https://www.zachleat.com/web/foft) for CSS fonts (`@font-face`).

## Example

```html
<style data-auto-foft-fonts>
    @font-face {
        font-family: 'my font';
        font-style: normal;
        font-weight: normal;
        src: url('my-font.woff2') format('woff2');
        /* etc */
    }
</style>
<script>
    // auto-foft snippet – 416 bytes (gzipped)
    !function(){"use strict";try{const e=()=>Array.from(document.styleSheets).find((e=>{const t=e.ownerNode;if(t.id)return"gu-font-faces"===t.id})),t=e=>"normal"===e.style&&("normal"===e.weight||"400"===e.weight),o=e=>e.reduce(((e,o)=>(t(o)?e.defaults.push(o):e.extras.push(o),e)),{defaults:[],extras:[]}),s=e=>Promise.all(e.map((e=>(e.load(),e.loaded)))).then((()=>{requestAnimationFrame((()=>{e.forEach((e=>{document.fonts.add(e)}))}))}));if("fonts"in document){const t=e();if(t)try{const e=Array.from(document.fonts);t.disabled=!0;const{defaults:n,extras:r}=o(e);s(n).then((()=>{s(r)}))}catch(e){console.error(e),t.disabled=!1}else console.warn("Could not find 'gu-font-faces' stylesheet.")}}catch(e){console.error(e)}}();
</script>
```

[Get the snippet](dist/snippet.min.js)

## Benefits

#### Prioritised requests

The font files with the highest impact on the page load first.

#### Minimal reflows

Reflows triggered by font changes are applied in two batches, rather than every time a new font is downloaded.

#### Tiny footprint

411 bytes (gzipped).

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
