import {
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import { Period } from "./types";

export const getDateRange = ({
  selectedDate,
  period,
}: {
  selectedDate: Date;
  period: Period;
}) => {
  switch (period) {
    case "week":
      return {
        start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
        end: endOfWeek(selectedDate, { weekStartsOn: 1 }),
      };
    case "year":
      return {
        start: startOfYear(selectedDate),
        end: endOfYear(selectedDate),
      };
    default:
      return {
        start: startOfMonth(selectedDate),
        end: endOfMonth(selectedDate),
      };
  }
};
