import { HeaderProps } from "react-big-calendar";
import { format } from "date-fns";
import { formatDateFnsDay2, localeEs } from "@/config/constants";
import { toDateTimeZone } from "@/helpers/dates";

export default function CustomMonthHeader({ date }: Readonly<HeaderProps>) {
  return (
    <div>
      {format(toDateTimeZone(date), formatDateFnsDay2, { locale: localeEs })}
    </div>
  );
}
