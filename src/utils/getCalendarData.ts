import { eventsToItems } from './eventsToItems';
import { findActiveEvents } from './findActiveEvents';
import { normaliseEvents } from './normaliseEvents';
import { filterDuplicatedItems } from './filterDuplicatedItems';

import type { Debugger } from './debugger';
import type { HomeAssistant } from './ha';
import type { RawCalendarEvent } from './calendarEvents';
import type { EventCardConfig } from '../cards/event-card/event-card-config';

const fetchData = async (
  hass: HomeAssistant,
  calendar: string,
  { start, end }: { start: string; end: string }
) => {
  const uri = `calendars/${calendar}?start=${start}&end=${end}`;

  return await hass.callApi<RawCalendarEvent[]>('GET', uri).
    then(data => data.map(item => ({
      ...item,
      entity: calendar
    })));
};

const getCalendarData = async (
  hass: HomeAssistant,
  calendars: string[],
  { start, end, dropAfter }: { start: string; end: string; dropAfter: boolean },
  debuggerInstance: Debugger,
  config: EventCardConfig,
  timezoneOffset: string
) => {
  const rawCalendarEvents: RawCalendarEvent[] = [];

  for await (const calendar of calendars) {
    rawCalendarEvents.push(...await fetchData(hass, calendar, { start, end }));
  }

  debuggerInstance.reset();
  debuggerInstance.log(`timezone`, timezoneOffset);
  debuggerInstance.log(`calendar data`, rawCalendarEvents);

  const normalisedEvents = normaliseEvents(rawCalendarEvents);

  normalisedEvents.sort((evtA, evtB) => evtA.date.start.getTime() - evtB.date.start.getTime());

  const now = new Date();

  debuggerInstance.log(`normaliseEvents`, normalisedEvents);
  debuggerInstance.log(`dropAfter`, dropAfter);
  debuggerInstance.log(`now`, now);

  if (config.location) {
    debuggerInstance.log(`location filtering`, config.location);
  }

  const activeEvents = findActiveEvents(normalisedEvents, {
    config: {
      pattern: config.pattern!,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      filter_events: config.filter_events,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      only_all_day_events: config.only_all_day_events
    },
    dropAfter,
    now,
    location: config.location,
    filterFutureEventsDay: end
  });

  debuggerInstance.log(`activeElements`, activeEvents);

  const eventItems = eventsToItems(activeEvents, {
    pattern: config.pattern!,
    useSummary: Boolean(config.use_summary)
  });

  debuggerInstance.log(`eventsToItems`, eventItems);

  return !config.event_grouping ?
    eventItems :
    filterDuplicatedItems(eventItems);
};

export {
  getCalendarData
};
