import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import utc from 'dayjs/plugin/utc';

export interface Slots {
  startDate: string | Date;
  endDate: string | Date;
}

export interface IGenerateTimeSlotsParams {
  intervalMinutes: number;
  busySlots: Slots[];
  periodStart: string | Date;
  periodEnd: string | Date;
  format?: string;
}

dayjs.extend(utc);
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export const generateTimeSlots = ({ intervalMinutes, format, busySlots, periodStart, periodEnd }: IGenerateTimeSlotsParams): Slots[] => {
  const start = dayjs.utc(periodStart);
  const end = dayjs.utc(periodEnd);

  const busy = busySlots.map(({ startDate, endDate }) => [dayjs.utc(startDate).valueOf(), dayjs.utc(endDate).valueOf()]);

  const slots: Slots[] = [];
  let current = start.valueOf();
  const intervalMs = intervalMinutes * 60 * 1000;

  while (current + intervalMs <= end.valueOf()) {
    const slotEnd = current + intervalMs;

    const isFree = !busy.some(([busyStart, busyEnd]) => current < busyEnd && slotEnd > busyStart);

    if (isFree) {
      slots.push({
        startDate: dayjs.utc(current).format(format),
        endDate: dayjs.utc(slotEnd).format(format),
      });
    }

    current = slotEnd;
  }

  return slots;
};

export const getStartAndEndOfDay = (startDate: Date | string, endDate?: Date | string) => {
  if (!endDate) {
    return {
      startOfDay: dayjs.utc(startDate).startOf('day').toDate(),
      endOfDay: dayjs.utc(startDate).startOf('day').toDate(),
    };
  }

  return {
    startOfDay: dayjs.utc(startDate).startOf('day').toDate(),
    endOfDay: dayjs.utc(endDate).startOf('day').toDate(),
  };
};

export default dayjs;
