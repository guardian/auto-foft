# auto-foft

> Automated [FOFT](https://www.zachleat.com/web/foft) for CSS fonts (`@font-face`).

## Example

### Default behaviour

1. `my-font.woff2` will be downloaded and applied first (_critical_)
2. `my-font-bold.woff2` and `my-font-italic.woff2` will be downloaded and applied second (_deferred_)

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
    // auto-foft snippet – 512 bytes (gzipped)
    !function(){"use strict";try{const t=()=>Array.from(document.styleSheets).find((e=>void 0!==e.ownerNode.dataset.autoFoftFonts));var e,o;const r=null!==(o=null===(e=window.autoFoft)||void 0===e?void 0:e.isCritical)&&void 0!==o?o:({style:e,weight:o})=>"normal"===e&&("normal"===o||"400"===o),d=e=>e.reduce((({critical:e,deferred:o},t)=>(r(t)?e.push(t):o.push(t),{critical:e,deferred:o})),{critical:[],deferred:[]}),n=e=>Promise.all(e.map((e=>(e.load(),e.loaded)))).then((()=>new Promise((o=>{requestAnimationFrame((()=>{e.forEach((e=>{document.fonts.add(e)})),o()}))}))));if("fonts"in document&&"loaded"!==document.fonts.status){const e=t();if(e)try{const o=Array.from(document.fonts);e.disabled=!0;const{critical:t,deferred:r}=d(o);n(t).then((()=>n(r))).then((()=>{e.disabled=!1}))}catch(o){console.error(o),e.disabled=!1}else console.warn("Could not find '[data-auto-foft-fonts]' stylesheet.")}}catch(e){console.error(e)}}();
</script>
```

### Custom behaviour

You can override the default behaviour by providing your own definition of _critical_ to test each font against:

```js
window.autoFoft = {
    isCritical: ({ style }) => style === 'italic',
};
```

With this definition:

1. `my-font-italic.woff2` will be downloaded and applied first (_critical_)
2. `my-font.woff2` and `my-font-bold.woff2` will be downloaded and applied second (_deferred_)

`isCritical` is called with the [`FontFace`](https://developer.mozilla.org/en-US/docs/Web/API/FontFace) object for each font.

Note that this will disable the default behaviour. You can recreate the default behaviour by adding a matching condition:

```js
window.autoFoft = {
    isCritical: ({ style, weight }) => {
        switch (style) {
            // default condition
            case 'normal':
                return weight === 'normal' || weight === '400';
            case 'italic':
                return true;
            default:
                return false;
        }
    },
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

Reflows triggered by font changes are applied in two batches, rather than every time a new font downloads.

#### Tiny footprint

512 bytes (gzipped).

#### Unobtrusive

No `font-loaded`-style class toggling required.

#### Robust

Falls-back to the original `@font-face` mechanism if something goes wrong.

## Downsides

_All_ declared fonts are fetched, regardless of whether they are used (unlike pure CSS `@font-face` declarations).

## How it works

1. gets a list of fonts already declared in CSS and divides them into two sets:
    1. _critical_ (`font-weight: normal` and `font-style: normal` by default)
    2. _deferred_ (all the others)
2. disables the CSS-connected fonts – the page will render using fallback fonts (_initial flow_)
3. downloads the _critical_ set
4. applies the fonts in the _critical_ set in one pass (_first reflow_)
    - missing **bold** and _italic_ fonts will be rendered using faux styles
5. downloads the _deferred_ set
6. applies the fonts in the _deferred_ set in one pass (_second reflow_)

As with pure CSS `@font-face` declarations, if the font files are cached locally the browser can use them immediately (_initial flow_ only).

## Further options

To minimise the time that fallback fonts are used, [`<link rel="preload" as="font" />`](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content) the fonts that you know will fall into the _critical_ set.
