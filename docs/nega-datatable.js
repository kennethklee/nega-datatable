import { LitElement, html } from "./node_modules/lit-element/lit-element.js";
/**
`nega-datatable`
Simple data table component.

Slotted elements define headers and columns. Data is populated by the `items` property.

The element's `slot` attribute directly coresponds to the item key. The `innerText` is populated by the cell value unless there is a `slot-prop` attribute to signal which element attribute to fill.

Slots postfixed with `:header` defines the header element. Without one, the slot name is used, or `nega-title` attribute if provided.

As a special case, if the column has a `negaItem` property, that property will be populated with the entire item json to use as the element sees fit.

Example:

```
Basic table: <nega-datatable><span slot="name"></span></nega-datatable>
```

The following CSS ::parts are available for styling:

* header-row
* header-cell
* even-row
* odd-row
* selected-row
* row
* even-cell
* odd-cell
* cell

@element nega-datatable
@demo demo/index.html
*/

class NegaDataTable extends LitElement {
  static get properties() {
    return {
      items: Array
    };
  }

  constructor() {
    super();
    this.selectable = false;
    this.items = [];
    this.__headerTitles = {};

    this._preprocess();
  }

  _preprocess() {
    this.headers = [];
    this.columns = []; // Preprocess columns

    Array.from(this.children).forEach((element, index) => {
      if (element.hasAttribute('slot') && element.getAttribute('slot').endsWith(':header')) {
        this.headers.push(element);
      } else {
        this.columns.push(element);
      }

      if (element.hasAttribute('nega-title') && element.getAttribute('nega-title')) {
        element['nega-title'] = element.getAttribute('nega-title');
      } else if (element.hasAttribute('slot') && element.getAttribute('slot')) {
        element['nega-title'] = element.getAttribute('slot');
      }
    });
  }

  render() {
    return html`
    <style>
      table {
        width: 100%;
      }
    </style>
    <table border="0" cellspacing="0">
      <thead>
        <tr part="header-row">
          ${Array.from(this.columns).map(column => html`
          <th part="header-cell">${this.renderColumnHeader(column)}</th>
          `)}
        </tr>
      </thead>
      <tbody>
      ${this.items.map((item, rowIndex) => html`
      <tr .item=${item} part="row ${rowIndex % 2 ? 'even-row' : 'odd-row'}" @click=${this._handleClickRow.bind(this)}>
        ${Array.from(this.columns).map((column, colIndex) => html`
        <td part="cell ${colIndex % 2 ? 'even-cell' : 'odd-cell'}">
        ${this.renderColumnCell(column, item)}
        </td>
        `)}
      </tr>
      `)}
      </tbody>
    </table>
    `;
  }

  renderColumnHeader(column) {
    var path = column.hasAttribute('slot') && column.getAttribute('slot') || '';

    if (path && this.querySelector(`[slot="${path}:header"]`)) {
      return this.querySelector(`[slot="${path}:header"]`);
    }

    return html`
      ${column['nega-title'] || ''}
    `;
  }

  renderColumnCell(column, item) {
    var el = column.cloneNode(true);

    if (el.negaItem) {
      el.negaItem = item; // For specialized components
    } // given a property, auto populate cell


    if (el.hasAttribute('slot') && el.getAttribute('slot')) {
      if (el.hasAttribute('slot-prop')) {
        el[el.getAttribute('slot-prop')] = item[el.getAttribute('slot')] || '';
      } else {
        el.innerText = item[el.getAttribute('slot')] || '';
      }
    }

    return el;
  }

  _handleClickRow(ev) {
    this.dispatchEvent(new CustomEvent('clickItem', {
      detail: {
        value: ev.target.closest('tr').item,
        target: ev.target
      }
    }));
  }

  select(item) {
    return this.toggle(item, true);
  }

  deselect(item) {
    return this.toggle(item, false);
  }

  toggle(item, forceValue) {
    for (const el of this.shadowRoot.querySelector('tbody').children) {
      if (el.item === item) {
        el.toggleAttribute('selected', forceValue);
        el.part.toggle('selected-row', forceValue);
        this.dispatchEvent(new CustomEvent('select', {
          detail: {
            item: item,
            value: el.hasAttribute('selected')
          },
          composed: true,
          bubbles: true
        }));
        return el.hasAttribute('selected');
      }
    }
  }

  get selected() {
    return Array.from(this.shadowRoot.querySelector('tbody').children).reduce((result, el) => {
      if (el.hasAttribute('selected')) {
        result.push(el.item);
      }

      return result;
    }, []);
  }

}

window.customElements.define('nega-datatable', NegaDataTable);