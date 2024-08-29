import {
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Calendar, momentLocalizer, Views, View } from "react-big-calendar";
import moment from "moment";
import momentTz from "moment-timezone";
import { addHours } from "date-fns";
import {
  formatDateFnsDate4,
  titleRecovery,
  calendarMomentFormats,
  timeZone,
} from "@/config/constants";
import {
  toDateTimeZone,
  formatDateString,
  setMinutesDate,
} from "@/helpers/dates";
import { getRecoveryHistoryView } from "@/actions/recovery.actions";
import { CalendarEvent } from "@/interfaces/calendar";
import TimeGutterHeader from "../TimeGutterHeader";
import CustomWeekHeader from "../CustomWeekHeader";
import CustomMonthHeader from "../CustomMonthHeader";
import HistoryDetail from "./HistoryDetail";
import { CloudFunctionValue } from "@/enums/cloud-functions";

interface Props {
  readonly date: Date;
  readonly setDate: (value: Date) => void;
  readonly cloudFunction: string;
}

const minTime = momentTz
  .tz(timeZone)
  .set({ hour: 4, minute: 0, second: 0, millisecond: 0 })
  .toDate();
const maxTime = momentTz
  .tz(timeZone)
  .set({ hour: 18, minute: 59, second: 59, millisecond: 59 })
  .toDate();

const HistoryCalendar = forwardRef(
  ({ date, setDate, cloudFunction }: Props, ref) => {
    const [view, setView] = useState<View>(Views.WEEK);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
      null
    );
    const [openModal, setOpenModal] = useState<boolean>(false);

    const refreshEvents = useCallback(async () => {
      const dateStr = formatDateString(date, formatDateFnsDate4);
      const history = await getRecoveryHistoryView(
        cloudFunction,
        view,
        dateStr
      );
      const historyEventsPromise = history.map((his) => {
        let minutes = 0;
        if (cloudFunction === CloudFunctionValue.Sap) {
          minutes = 0;
        }
        if (cloudFunction === CloudFunctionValue.Oracle) {
          minutes = 30;
        }
        const startDate = setMinutesDate(
          toDateTimeZone(his.last_cf_execution),
          minutes
        );
        return {
          id: his.cf_execution_id,
          title: titleRecovery,
          start: startDate,
          end: addHours(startDate, 1),
        };
      });
      const historyEvents = await Promise.all(historyEventsPromise);
      setEvents(historyEvents);
    }, [cloudFunction, date, view]);

    useEffect(() => {
      if (cloudFunction && view && date) {
        refreshEvents();
      }
    }, [cloudFunction, view, date, refreshEvents]);

    useImperativeHandle(ref, () => ({
      refreshEvents,
    }));

    const handleOpenModal = (event: CalendarEvent) => {
      setSelectedEvent(event);
      setOpenModal(true);
    };

    return (
      <div id="recuperaciones" className="w-full">
        <Calendar
          culture="es"
          date={date}
          defaultDate={date}
          localizer={momentLocalizer(moment)}
          events={events}
          startAccessor="start"
          endAccessor="end"
          messages={{
            next: "Siguiente",
            previous: "Anterior",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
            agenda: "Agenda",
          }}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          defaultView={Views.WEEK}
          view={view}
          onView={(view) => setView(view)}
          formats={calendarMomentFormats}
          min={minTime}
          max={maxTime}
          onNavigate={(newDate) => setDate(toDateTimeZone(newDate))}
          onSelectEvent={(event) => handleOpenModal(event)}
          components={{
            timeGutterHeader: TimeGutterHeader,
            week: {
              header: CustomWeekHeader,
            },
            month: {
              header: CustomMonthHeader,
            },
          }}
        />
        {openModal && selectedEvent && (
          <HistoryDetail
            open={openModal}
            setOpen={setOpenModal}
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
            day={date}
          />
        )}
      </div>
    );
  }
);

HistoryCalendar.displayName = "HistoryCalendarRecovery";

export default HistoryCalendar;
