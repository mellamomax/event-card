import { LitElement, css, html, nothing } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { customElement, property, state } from 'lit/decorators.js';
import { TRASH_CARD_NAME } from '../const';

import '../items/card';

import type { BaseContainerElement } from './BaseContainerElement';
import type { TrashCardConfig } from '../trash-card-config';
import type { CalendarItem } from '../../../utils/calendarItem';
import type { HomeAssistant } from '../../../utils/ha';

@customElement(`${TRASH_CARD_NAME}-cards-container`)
class Cards extends LitElement implements BaseContainerElement {
  @state() private items?: CalendarItem[];

  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private config?: TrashCardConfig;

  public setConfig (config?: TrashCardConfig) {
    this.config = config;
  }

  public setItems (items?: CalendarItem[]) {
    this.items = items;
  }

  public setHass (hass?: HomeAssistant) {
    this.hass = hass;
  }

  public render () {
    if (!this.config || !this.hass) {
      return nothing;
    }

    if (!this.items || this.items.length === 0) {
      return html`<trash-card-item-empty .config=${this.config} .hass=${this.hass}/>`;
    }

    // Log all event titles
    console.log("Event Data:", this.items);


    // Get the hidden_titles list from the configuration
    const hiddenTitles = this.config.hidden_titles || [];

    // Filter the items based on hidden_titles
    const displayedItems = this.items.filter(
      (item) => !hiddenTitles.includes(item.label)
    );

    if (displayedItems.length === 0) {
      return html`<trash-card-item-empty .config=${this.config} .hass=${this.hass}/>`;
    }

    const itemsPerRow = this.config.items_per_row ?? 1;

    const cssStyleMap = styleMap({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'grid-template-columns': `repeat(${itemsPerRow}, calc(calc(100% - calc(${itemsPerRow - 1} * var(--ha-section-grid-column-gap, 8px))) / ${itemsPerRow}))`
    });

    return html`
        <div style=${cssStyleMap} class="card-container">
          ${displayedItems.map((item, idx) => html`
              <trash-card-item-card
                key=${`card-${idx}-${item.content.uid}`}
                .item=${item}
                .config=${this.config}
                .hass=${this.hass}
              >
              </trash-card-item-card>
            `)}
        </div>
      `;
  }

  public static get styles () {
    return [
      css`
        .card-container {
          display: grid;
          grid-gap: var(--ha-section-grid-column-gap, 8px);
          grid-columns: auto;
        }
        trash-card-item-card {
          grid-row: auto / span 1;
        }
      `
    ];
  }
}

export {
  Cards
};
