# Modal

[![npm Module](https://badge.fury.io/js/@byojs%2Fmodal.svg)](https://www.npmjs.org/package/@byojs/modal)
[![License](https://img.shields.io/badge/license-MIT-a1356a)](LICENSE.txt)

**Modal** makes it easy to create nice, accessible modal dialogs (using the widely used and popular [SweetAlert 2](https://sweetalert2.github.io) library).

```js
import { showNotice } from "..";

showNotice("Hello, friend.");
```

----

[Library Tests (Demo)](https://byojs.dev/modal/)

----

## Overview

The main purpose of **Modal** is to provide a simple set of wrappers (and default behaviors) around [SweetAlert 2](https://sweetalert2.github.io).

In addition to standard modals and prompt-dialogs, **Modal** also provides time-limited *Toast* popups (non-modal) as well as a debounced (UX-optimized) spinnner (modal) for blocking asynchronous operations in your UI.

## Deployment / Import

```cmd
npm install @byojs/modal
```

The [**@byojs/modal** npm package](https://npmjs.com/package/@byojs/modal) includes a `dist/` directory with all files you need to deploy **Modal** (and its dependencies) into your application/project.

**Note:** If you obtain this library via git instead of npm, you'll need to [build `dist/` manually](#re-building-dist) before deployment.

### Using a bundler

If you are using a bundler (Astro, Vite, Webpack, etc) for your web application, you should not need to manually copy any files from `dist/`.

Just `import` the methods of your choice, like so:

```js
import { showNotice, showError } from "@byojs/modal";
```

The bundler tool should pick up and find whatever files (and dependencies) are needed.

### Without using a bundler

If you are not using a bundler (Astro, Vite, Webpack, etc) for your web application, and just deploying the contents of `dist/` as-is without changes (e.g., to `/path/to/js-assets/modal/`), you'll need an [Import Map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) in your app's HTML:

```html
<script type="importmap">
{
    "imports": {
        "modal": "/path/to/js-assets/modal/modal.mjs"
    }
}
</script>
```

Now, you'll be able to `import` the library in your app in a friendly/readable way:

```js
import { showNotice, showError } from "modal";
```

**Note:** If you omit the above *modal* import-map entry, you can still `import` **Modal** by specifying the proper full path to the `modal.mjs` file.

## Modal API

The API provided by **Modal** includes a variety of methods for displaying different types of modals.

### Spinner

When asynchronous (but "blocking") behavior is happening on a page -- such as loading important data or behavior -- it can be useful to show a modal spinner to the user to indicate they shouldn't try to interact with the page temporarily.

But more importantly, spinners should be carefully managed to avoid detractive and distracting UX. For example, if an operation is going to complete pretty quickly, flashing up a spinner for only a fraction of a second might not be helpful. It's therefore preferable to [*debounce*](https://github.com/byojs/scheduler?tab=readme-ov-file#debouncing) (i.e., delaying briefly) the spinner being shown.

On the other hand, once a spinner has been shown, the underlying operation might finish a few milliseconds later, which would then hide the spinner quickly, causing the same unfortunate UX flash. Even worse, a series of async operations could cause the spinner to flicker on and off repeatedly. So the closing of an open spinner *also* needs to be briefly debounced, even though that *technically* delays the user slightly longer than strictly required.

**Note:** This extra *delay* is only UX perceptible, it's not actually a delay that the underlying code would experience. It's also possible to call another **Modal** method to popup another type of modal, which will immediately hide the spinner.

Since all this spinner timing is highly UX dependent, the amount of delay is configurable, for both the debounce on showing the spinner (default: `300`ms) and the debounce on hiding the spinner (default: `500`ms).

Importantly, **Modal** makes all this complicated spinner timing management easy.

```js
import {
    configSpinner,
    startSpinner,
    stopSpinner
} from "..";

// override the spinner timing defaults
configSpinner(
    /*showDelay=*/150,
    /*hideDelay=*/225
);

// schedule the spinner to show up
// (after its debounce delay)
startSpinner();

// later, schedule the spinner to hide
// (after its debounce delay)
stopSpinner();
```

**Note:** Even though the `startSpinner()` and `stopSpinner()` functions fire off asynchronous behavior (spinner modal dependent on debounce delays), the function themselves are synchronous (not promise returning).

Both `startSpinner()` and `stopSpinner()` are idempotently safe, meaning you *could* call `startSpinner()` twice before calling `stopSpinner()`, or vice versa, and you still just get the one scheduled action (showing or hiding).

Also, if you call `stopSpinner()` after `startSpinner()` but *before* the show-debounce delay has transpired, the spinner showing will be canceled. Likewise, if you call `showSpinner()` after `stopSpinner()` but *before* the hide-debounce delay has transpired, the spinner hiding will be canceled.

### Toast

A *toast* is a briefly displayed notice, in the upper right corner of the page, that only displays for a period of time then auto-hides itself. Toasts do have a "X" close button to dismiss them early.

**Note:** Toasts are not *technically* "modal" -- they don't actually block the rest of the page. But they're included with this library since they're so closely related.

To display a toast:

```js
import { showToast } from "..";

// wait 5s (default)
showToast("Quick heads-up!");

// wait 15s
showToast("Longer message...",15000);
```

The minimum value for the delay is `250`ms (1/4 of a second).

### Notice

A *notice* is a standard modal that presents textual information. To display a notice modal:

```js
import { showNotice } from "..";

showNotice("This is important information.");
```

**Note:** This modal requires a user to click "OK", or dismiss the dialog with `<ESCAPE>` key or by clicking the "X" icon.

### Error

An *error* is a standard modal that presents textual information that represents something that went wrong. To display an error modal:

```js
import { showError } from "..";

showError("Oops, that request failed. Please try again.");
```

**Note:** This modal requires a user to click "OK", or dismiss the dialog with `<ESCAPE>` key or by clicking the "X" icon.

### Simple Prompt

An *simple prompt* is a standard modal asks the user to input one piece of information, such as an email address. To display a simple-prompt modal:

```js
import { promptSimple } from "..";

promptSimple({
    title: "We need your information...",
    text: "Please enter your email:",
    input: "email",
    inputPlaceholder: "someone@whatever.tld"
});
```

The options available to `promptSimple()` are [passed directly through to SweetAlert2](https://sweetalert2.github.io/#configuration). **Modal** provides a few sensible defaults, but pretty much everything can be overridden here, as you see fit.

**Note:** This modal requires a user to click the confirm button (default: "Submit"), or dismiss the dialog with `<ESCAPE>` key or by clicking the cancel button (default: "Cancel") or "X" icon.

## Re-building `dist/*`

If you need to rebuild the `dist/*` files for any reason, run:

```cmd
# only needed one time
npm install

npm run build:all
```

## Tests

This library only works in a browser, so its test suite must also be run in a browser.

Visit [`https://byojs.dev/modal/`](https://byojs.dev/modal/) and click the "run tests" button.

### Run Locally

To instead run the tests locally, first make sure you've [already run the build](#re-building-dist), then:

```cmd
npm test
```

This will start a static file webserver (no server logic), serving the interactive test page from `http://localhost:8080/`; visit this page in your browser and click the "run tests" button.

By default, the `test/test.js` file imports the code from the `src/*` directly. However, to test against the `dist/*` files (as included in the npm package), you can modify `test/test.js`, updating the `/src` in its `import` statements to `/dist` (see the import-map in `test/index.html` for more details).

## License

[![License](https://img.shields.io/badge/license-MIT-a1356a)](LICENSE.txt)

All code and documentation are (c) 2024 Kyle Simpson and released under the [MIT License](http://getify.mit-license.org/). A copy of the MIT License [is also included](LICENSE.txt).
