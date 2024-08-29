"use client";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import Sidebar from "@/components/Sidebar";
import { localeEs, timeZone } from "@/config/constants";
import moment from "moment";
import "moment/locale/es";
import "moment-timezone";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "@/styles/calendar.css";

moment.locale("es");
moment.tz.setDefault(timeZone);

export default function PanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={localeEs}>
      <main className="flex">
        <div className="w-[15%]">
          <Sidebar />
        </div>
        <div className="w-[85%]">{children}</div>
      </main>
    </LocalizationProvider>
  );
}
