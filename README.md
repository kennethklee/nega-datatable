# nega-datatable
# \<nega-datatable\>

Simple Data table webcomponent

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/kennethklee/nega-datatable)

See: [Documentation](https://www.webcomponents.org/element/nega-datatable),
  [Demo](https://kennethklee.github.io/nega-datatable/demo/).


# Usage

## Installation

```shell
npm install --save nega-datatable
```

## In an html file

```html
<html>
  <head>
    <script type="module">
      import 'nega-datatable/nega-datatable.js';
    </script>
  </head>
  <body>
    <nega-datatable>
      <span slot="name"></span>
    </nega-datatable>
    <script>
      // Fill table with data
      document.querySelector('nega-datatable').items = [
        {name: 'Kenneth'}
      ]
    </script>
  </body>
</html>
```

## In a Polymer 3 element

```js
import {PolymerElement, html} from '@polymer/polymer';
import 'nega-datatable/nega-datatable.js';

class SampleElement extends PolymerElement {
  static get properties() {
    return {
      items: Array
    }
  }
  static get template() {
    return html`
      <nega-datatable items={{items}}>
        <span slot="name"></span>
      </nega-datatable>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```


# Contributing

Feel free to fork and send over PRs. Still a lot of places this can be improved, i.e. styling, more options, or better behaviors.

## Installation

```
git clone https://github.com/kennethklee/nega-datatable
cd nega-datatable
npm install
```

## Running locally

```
$ npm start
```

## Running tests

```
$ npm test
```
