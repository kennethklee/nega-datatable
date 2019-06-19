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

The following custom properties and mixins are also available for styling:
Custom property | Description | Default
----------------|-------------|----------
`--nega-datatable-header-row` | Mixin for header TR | `{}`
`--nega-datatable-header-cell` | Mixin for header TH | `{}`
`--nega-datatable-even-row` | Mixin for even TR | `{}`
`--nega-datatable-odd-row` | Mixin for odd TR | `{}`
`--nega-datatable-selected-row` | Mixin for selected TR | `{}`
`--nega-datatable-even-column` | Mixin for even TD | `{}`
`--nega-datatable-odd-column` | Mixin for odd TD | `{}`
`--nega-datatable-cell` | Mixin for body TD | `{}`

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
      :host {
        --nega-datatable-header-row: {};
        --nega-datatable-header-cell: {};
        --nega-datatable-even-row: {};
        --nega-datatable-odd-row: {};
        --nega-datatable-selected-row: {};
        --nega-datatable-even-column: {};
        --nega-datatable-odd-column: {};
        --nega-datatable-cell: {};
      }

      table {
        width: 100%;
      }

      tbody > tr:nth-child(even) {
        @apply --nega-datatable-even-row;
      }

      tbody > tr:nth-child(odd) {
        @apply --nega-datatable-odd-row;
      }

      tbody > tr[selected] {
        @apply --nega-datatable-selected-row;
      }

      tbody td.odd {
        @apply --nega-datatable-odd-column;
      }
      tbody td.even {
        @apply --nega-datatable-even-column;
      }

      th {
        @apply --nega-datatable-header-cell;
      }

      thead > tr {
        @apply --nega-datatable-header-row;
      }

      tbody td {
        @apply --nega-datatable-cell;
      }
    </style>
    <table border="0" cellspacing="0">
      <thead>
        <tr>
          ${Array.from(this.columns).map(column => html`
          <th>${this.renderColumnHeader(column)}</th>
          `)}
        </tr>
      </thead>
      <tbody>
      ${this.items.map(item => html`
      <tr .item=${item} @click=${this._handleClickRow.bind(this)}>
        ${Array.from(this.columns).map((column, index) => html`
        <td class="${index % 2 ? 'even' : 'odd'}">
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