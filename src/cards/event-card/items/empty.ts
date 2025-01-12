import { html, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { EVENT_CARD_NAME } from '../const';
import { BaseItemElement } from './BaseItemElement';
import setupCustomlocalize from '../../../localize';
import { hasEntities } from '../../../utils/hasEntities';

@customElement(`${EVENT_CARD_NAME}-item-empty`)
class ItemCard extends BaseItemElement {
  public render () {
    if (!this.hass || !this.config) {
      return nothing;
    }

    const customLocalize = setupCustomlocalize(this.hass);

    if (!hasEntities(this.config.entities)) {
      return html`
      <ha-alert alert-type="error" .title="EventCard">
        <b>${customLocalize('card.not_found.title')}</b>
        <div>${customLocalize('card.not_found.description')}</div>
      </ha-alert>
    `;
    }

    return html`
      <ha-alert alert-type="warning" .title="EventCard">
        <div><b>EventCard</b></div>
        <div>${customLocalize('card.empty.description')}</div>
      </hui-warning>
    `;
  }
}

export {
  ItemCard
};
