import { HeaderProps } from "react-big-calendar";
import { format } from "date-fns";
import {
  formatDateFnsDay2,
  formatDateFnsDay3,
  localeEs,
} from "@/config/constants";
import { toDateTimeZone } from "@/helpers/dates";

export default function CustomWeekHeader({ date }: Readonly<HeaderProps>) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div>
        {format(toDateTimeZone(date), formatDateFnsDay2, { locale: localeEs })}
      </div>
      <div className="flex items-center justify-center w-10 h-10 text-lg rounded-full bg-gray-100">
        {format(toDateTimeZone(date), formatDateFnsDay3, { locale: localeEs })}
      </div>
    </div>
  );
}
