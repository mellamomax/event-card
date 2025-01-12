/* eslint-disable unicorn/filename-case */

import type { HomeAssistant } from '../../../utils/ha';
import type { EventCardConfig } from '../event-card-config';
import type { CalendarItem } from '../../../utils/calendarItem';

interface BaseContainerElement extends HTMLElement {
  setConfig: (config?: EventCardConfig) => void;

  setItems: (items?: CalendarItem[]) => void;

  setHass: (hass?: HomeAssistant) => void;
}

export {
  BaseContainerElement
};
