import { version } from '../package.json';
import { EventCard } from './cards/event-card/event-card';

// eslint-disable-next-line no-console
console.info(`%c🗑️ EventCard ${version}`, 'background-color: #ef5350; color: #ffffff');

// Ensure the custom element is registered
customElements.define('event-card', EventCard);

export { EventCard };
