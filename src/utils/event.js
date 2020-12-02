import dayjs from 'dayjs';

export const humanizeDate = (date, formatter = `YYYY-MM-DD`) => {
  return dayjs(date).format(formatter);
};
