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
* even-column
* odd-column
* cell

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
`--nega-datatable-header-cell-color` | Header cell padding | `inherit`
`--nega-datatable-header-cell-padding` | Header cell padding | `initial`
`--nega-datatable-header-cell-white-space` | Header cell white-space | `nowrap`
`--nega-datatable-even-row-background` | Even row background | `initial`
`--nega-datatable-odd-row-background` | Odd row background | `initial`
`--nega-datatable-selected-row-background` | Selected row background | `initial`
`--nega-datatable-even-column-background` | Even column background | `initial`
`--nega-datatable-odd-column-background` | Odd row background | `initial`
`--nega-datatable-cell-color` | Cell padding | `inherit`
`--nega-datatable-cell-padding` | Cell padding | `initial`
`--nega-datatable-cell-white-space` | Cell white-space | `initial`
`--nega-datatable-cell-vertical-align` | Cell vertical-align | `inherit`

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

      if (element.hasAttribute('nega-title')) {
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

        --nega-datatable-header-cell-color: inherit;
        --nega-datatable-header-cell-padding: initial;
        --nega-datatable-header-cell-white-space: nowrap;
        --nega-datatable-even-row-background: initial;
        --nega-datatable-odd-row-background: initial;
        --nega-datatable-selected-row-background: initial;
        --nega-datatable-even-column-background: initial;
        --nega-datatable-odd-column-background: initial;
        --nega-datatable-cell-color: inherit;
        --nega-datatable-cell-padding: initial;
        --nega-datatable-cell-white-space: initial;
        --nega-datatable-cell-vertical-align: inherit;
      }

      table {
        width: 100%;
      }

      th {
        text-align: left;
        text-transform: capitalize;
        white-space: nowrap;
      }


      thead > tr {
        @apply --nega-datatable-header-row;
      }
      th {
        color: var(--nega-datatable-header-cell-color);
        padding: var(--nega-datatable-header-cell-padding);
        white-space: var(--nega-datatable-header-cell-white-space);
        @apply --nega-datatable-header-cell;
      }
      tbody > tr:nth-child(even) {
        background: var(--nega-datatable-even-row-background);
        @apply --nega-datatable-even-row;
      }
      tbody > tr:nth-child(odd) {
        background: var(--nega-datatable-odd-row-background);
        @apply --nega-datatable-odd-row;
      }
      tbody > tr[selected] {
        background: var(--nega-datatable-selected-row-background);
        @apply --nega-datatable-selected-row;
      }
      [part~=even-column] {
        background: var(--nega-datatable-even-column-background);
        @apply --nega-datatable-even-column;
      }
      [part~=odd-column] {
        background: var(--nega-datatable-odd-column-background);
        @apply --nega-datatable-odd-column;
      }
      td {
        color: var(--nega-datatable-cell-color);
        padding: var(--nega-datatable-cell-padding);
        white-space: var(--nega-datatable-cell-white-space);
        vertical-align: var(--nega-datatable-cell-vertical-align);

        @apply --nega-datatable-cell;
      }
    </style>
    <table border="0" cellspacing="0">
      <thead>
        <tr part="header-row">
          ${Array.from(this.columns).map((column, colIndex) => html`
          <th part="header-cell ${colIndex % 2 ? 'even-column' : 'odd-column'}">${this.renderColumnHeader(column)}</th>
          `)}
        </tr>
      </thead>
      <tbody>
      ${this.items.map((item, rowIndex) => html`
      <tr .item=${item} part="row ${rowIndex % 2 ? 'even-row' : 'odd-row'}" @click=${this._handleClickRow.bind(this)}>
        ${Array.from(this.columns).map((column, colIndex) => html`
        <td part="cell ${colIndex % 2 ? 'even-column' : 'odd-column'}">
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
      return this.querySelector(`[slot="${path}:header"]`).cloneNode(true);
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
      var isValueSet = false;

      if (el.hasAttribute('slot-attr')) {
        el.setAttribute(el.getAttribute('slot-attr'), item[el.getAttribute('slot')] || '');
        isValueSet = true;
      }

      if (el.hasAttribute('slot-prop')) {
        el[el.getAttribute('slot-prop')] = item[el.getAttribute('slot')] || '';
        isValueSet = true;
      }

      if (!isValueSet) {
        el.innerText = item[el.getAttribute('slot')] || '';
      }
    }

    return el;
  }

  _handleClickRow(ev) {
    ev.stopPropagation();
    ev.stopImmediatePropagation();
    this.dispatchEvent(new CustomEvent('clickItem', {
      detail: {
        value: ev.target.closest('tr').item,
        target: ev.target
      },
      composed: true,
      bubbles: true
    }));
  }

  updated(changed) {
    if (changed.has('items')) {
      // Deselect all when items have changed
      this.clear();
    }
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
        var isSelected = el.hasAttribute('selected');
        isSelected ? this._deselectRow(el) : this._selectRow(el);
        this.dispatchEvent(new CustomEvent('select', {
          detail: {
            item: item,
            value: !isSelected
          },
          composed: true,
          bubbles: true
        }));
        return !isSelected;
      }
    }
  }

  clear() {
    Array.from(this.shadowRoot.querySelector('tbody').children).forEach(el => this._deselectRow(el));
  }

  _selectRow(rowEl) {
    var part = new Set(rowEl.getAttribute('part').split(' '));
    part.add('selected-row');
    rowEl.setAttribute('part', Array.from(part).join(' '));
    rowEl.setAttribute('selected', '');
  }

  _deselectRow(rowEl) {
    var part = new Set(rowEl.getAttribute('part').split(' '));
    part.delete('selected-row');
    rowEl.setAttribute('part', Array.from(part).join(' '));
    rowEl.removeAttribute('selected');
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