import { LitElement, css, html, nothing } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { customElement, property, state } from 'lit/decorators.js';
import { EVENT_CARD_NAME } from '../const';

import '../items/icon';

import type { BaseContainerElement } from './BaseContainerElement';
import type { EventCardConfig } from '../event-card-config';
import type { CalendarItem } from '../../../utils/calendarItem';
import type { HomeAssistant } from '../../../utils/ha';

@customElement(`${EVENT_CARD_NAME}-icons-container`)
class Icons extends LitElement implements BaseContainerElement {
  @state() private items?: CalendarItem[];

  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private config?: EventCardConfig;

  public setConfig (config?: EventCardConfig) {
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
      return html`<event-card-item-empty .config=${this.config} .hass=${this.hass}/>`;
    }

    const itemsPerRow = this.items.length;

    const cssStyleMap = styleMap({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'grid-template-columns': `repeat(${itemsPerRow}, calc(calc(100% - calc(${itemsPerRow - 1} * var(--ha-section-grid-column-gap, 8px))) / ${itemsPerRow}))`
    });

    return html`
        <div style=${cssStyleMap} class="icons-container">
          ${this.items.map((item, idx) => html`
              <event-card-icon-card
                key=${`card-${idx}-${item.content.uid}`}
                .item=${{ ...item, nextEvent: idx === 0 }}
                .config=${this.config}
                .hass=${this.hass}
              >
              </event-card-icon-card>
            `)}
        </div>
      `;
  }

  public static get styles () {
    return [
      css`
        .icons-container {
          display: grid;
          grid-gap: var(--ha-section-grid-column-gap, 8px);
        }
        event-card-icon-card {
          grid-row: auto / span 1;
        }
      `
    ];
  }
}

export {
  Icons
};
