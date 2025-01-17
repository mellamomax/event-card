import { getDayFromDate } from './getDayFromDate';
import { getTimeZoneOffset } from './getTimeZoneOffset';
import { filterEventByPatterns } from './filterEventByPatterns';

import type { CalendarEvent } from './calendarEvents';
import type { EventCardConfig } from '../cards/event-card/event-card-config';

interface Config {
  pattern: Required<EventCardConfig>['pattern'];
  // eslint-disable-next-line @typescript-eslint/naming-convention
  filter_events: EventCardConfig['filter_events'];
  // eslint-disable-next-line @typescript-eslint/naming-convention
  only_all_day_events: EventCardConfig['only_all_day_events'];
}

interface Options {
  config: Config;
  location?: string;
  now: Date;
  dropAfter: boolean;
  filterFutureEventsDay: string;
}

const isMatchingAnyPatterns = (item: CalendarEvent, config: Config) => {
  if (!config.filter_events) {
    return true;
  }

  const eventTypes = config.pattern.filter(pat => pat.type !== 'others');
  const patterns = eventTypes.filter(pattern => pattern.pattern !== undefined);

  return patterns.length === 0 || patterns.some(pat => filterEventByPatterns(pat, item));
};

const isNotPastWholeDayEvent = (item: CalendarEvent, now: Date, dropAfter: boolean): boolean =>
  (item.isWholeDayEvent && getDayFromDate(item.date.start) === getDayFromDate(now) && !dropAfter) ||
    (item.isWholeDayEvent && getDayFromDate(item.date.start) !== getDayFromDate(now));

const findActiveEvents = (items: CalendarEvent[], { config, now, dropAfter, filterFutureEventsDay, location }: Options): CalendarEvent[] => {
  const dateString = `${filterFutureEventsDay}T00:00:00${getTimeZoneOffset()}`;
  const dateMaxStart = new Date(dateString);

  const activeItems = items.
    filter((item): boolean => {
      if (location && !item.content.location?.toLowerCase().includes(location.toLowerCase())) {
        return false;
      }

      if (item.date.start > dateMaxStart) {
        return false;
      }

      if (config.only_all_day_events && !item.isWholeDayEvent) {
        return false;
      }

      if (item.isWholeDayEvent) {
        return item.date.end > now;
      }

      if (item.date.end < now) {
        return false;
      }

      return true;
    }).
    sort((first, second): number => first.date.start.getTime() - second.date.start.getTime());

  return activeItems.
    filter((item): boolean =>
      isMatchingAnyPatterns(item, config) &&
    (isNotPastWholeDayEvent(item, now, dropAfter) ||
      !item.isWholeDayEvent));
};

export {
  findActiveEvents
};
