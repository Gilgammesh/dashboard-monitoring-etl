import { capitalize } from "lodash";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Paper } from "@mui/material";
import { timeZone, formatDateFnsDate2 } from "@/config/constants";
import { formatDateNoTzString, toDateTimeZone } from "@/helpers/dates";

interface Props {
  readonly date: Date;
  readonly setDate: (value: Date) => void;
}

export default function DatePicker({ date, setDate }: Props) {
  const formattedDate = formatDateNoTzString(date, formatDateFnsDate2);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h2 className="font-semibold">Fecha Seleccionada:</h2>
        <h1 className="text-green-600">{capitalize(formattedDate)}</h1>
      </div>
      <Paper>
        <DateCalendar
          showDaysOutsideCurrentMonth
          value={date}
          onChange={(newDate) => setDate(toDateTimeZone(newDate))}
          views={["year", "month", "day"]}
          timezone={timeZone}
          sx={{
            ".MuiButtonBase-root.MuiPickersDay-root.Mui-selected": {
              backgroundColor: "#388e3c",
            },
            ".MuiDateCalendar-root.MuiPickersDay-root.Mui-selected": {
              backgroundColor: "#388e3c",
            },
            ".MuiButtonBase-root.MuiPickersDay-root.Mui-selected:hover": {
              backgroundColor: "#2e7d32",
            },
            ".MuiDateCalendar-root.MuiPickersDay-root.Mui-selected:hover": {
              backgroundColor: "#2e7d32",
            },
          }}
        />
      </Paper>
    </div>
  );
}
