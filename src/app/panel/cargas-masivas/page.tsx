"use client";

import { useState, useRef } from "react";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import SelectCloudFunction from "@/components/SelectCloudFunction";
import DatePicker from "@/components/DatePicker";
import HistoryCalendar from "@/components/cargas-masivas/HistoryCalendar";
import { CloudFunctionValue } from "@/enums/cloud-functions";
import { getNowWithTimeZone } from "@/helpers/dates";
import { IoRefreshOutline } from "react-icons/io5";

export default function CargasMasivasPage() {
  const [cloudFunction, setCloudFunction] = useState<string>(
    CloudFunctionValue.Sap
  );

  const [pickedDate, setPickedDate] = useState<Date>(getNowWithTimeZone());

  const historyCalendarRef = useRef<{ refreshEvents: () => void } | null>(null);

  const refreshData = () => {
    historyCalendarRef.current?.refreshEvents();
  };

  return (
    <div className="px-6">
      <div className="flex flex-row items-center justify-start py-6">
        <h2 className="font-semibold text-2xl">Historial de Cargas Masivas</h2>
        <div className="ml-2">
          <Tooltip title="Refrescar">
            <IconButton
              color="primary"
              aria-label="refresh"
              size="medium"
              onClick={refreshData}
            >
              <IoRefreshOutline />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      <div className="flex flex-row gap-4 pb-6 h-full">
        <div className="flex flex-col gap-4">
          <SelectCloudFunction
            cloudFunction={cloudFunction}
            setCloudFunction={setCloudFunction}
          />
          <DatePicker date={pickedDate} setDate={setPickedDate} />
        </div>
        <HistoryCalendar
          date={pickedDate}
          setDate={setPickedDate}
          cloudFunction={cloudFunction}
          ref={historyCalendarRef}
        />
      </div>
    </div>
  );
}
