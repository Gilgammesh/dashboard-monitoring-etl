"use client";

import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { differenceInDays } from "date-fns";
import {
  getSyncCountSummary,
  getErrorCountSummary,
  getSemaphoreProcessingDate,
} from "@/actions/panel.actions";
import { formatDateNoTzString, getNowWithTimeZone } from "@/helpers/dates";
import { formatDateFnsDate2, formatDateFnsDate4 } from "@/config/constants";
import { CloudFunctionValue } from "@/enums/cloud-functions";
import { capitalize } from "lodash";
import { IoRefreshOutline } from "react-icons/io5";

const columns: GridColDef[] = [
  { field: "num", headerName: "#", flex: 1, maxWidth: 50 },
  {
    field: "cloud_function",
    headerName: "Cloud Function",
    flex: 1,
  },
  {
    field: "bigquery_entity",
    headerName: "Entidad",
    flex: 1,
  },
  {
    field: "postgres_table",
    headerName: "Tabla PostgreSQL",
    flex: 1,
  },
  {
    field: "process_date_str",
    headerName: "Último process_date",
    flex: 1,
  },
  {
    field: "process_date",
    headerName: "Semáforo",
    flex: 1,
    maxWidth: 120,
    align: "center",
    renderCell: (params) => {
      const diff = differenceInDays(new Date(), params.value as Date);
      let bgColor: string;
      if (diff >= 7) {
        bgColor = "bg-red-600";
      } else if (diff >= 3 && diff < 7) {
        bgColor = "bg-orange-400";
      } else {
        bgColor = "bg-green-400";
      }

      return (
        <div className="flex items-center h-full">
          <div className={`w-6 h-6 text-lg rounded-full ml-6 ${bgColor}`} />
        </div>
      );
    },
  },
];

export default function PanelPage() {
  const [rows, setRows] = useState<GridRowsProp>([]);

  const [day] = useState<Date>(getNowWithTimeZone());
  const [countSyncSap, setCountSyncSap] = useState<string>("0");
  const [countSyncOracle, setCountSyncOracle] = useState<string>("0");
  const [countErrorSap, setCountErrorSap] = useState<string>("0");
  const [countErrorOracle, setCountErrorOracle] = useState<string>("0");

  useEffect(() => {
    const getSemaphore = async () => {
      const semaphore = await getSemaphoreProcessingDate();
      const semaphoreFormat = semaphore.map((sem, index) => {
        return {
          ...sem,
          num: index + 1,
          id: sem.cloudfunc_log_sync_id,
        };
      });
      setRows(semaphoreFormat);
    };
    getSemaphore();
  }, []);

  useEffect(() => {
    const getSyncSummary = async (dayStr: string) => {
      const summary = await getSyncCountSummary(dayStr);
      summary.forEach((s) => {
        if ((s.cloud_function as string) === CloudFunctionValue.Sap) {
          setCountSyncSap(s.cloudfunc_log_sync_id);
        } else if ((s.cloud_function as string) === CloudFunctionValue.Oracle) {
          setCountSyncOracle(s.cloudfunc_log_sync_id);
        }
      });
    };
    const getErrorSummary = async (dayStr: string) => {
      const summary = await getErrorCountSummary(dayStr);
      summary.forEach((s) => {
        if ((s.cloud_function as string) === CloudFunctionValue.Sap) {
          setCountErrorSap(s.cloudfunc_log_error_id);
        } else if ((s.cloud_function as string) === CloudFunctionValue.Oracle) {
          setCountErrorOracle(s.cloudfunc_log_error_id);
        }
      });
    };
    if (day) {
      const dayStr = formatDateNoTzString(day, formatDateFnsDate4);
      getSyncSummary(dayStr);
      getErrorSummary(dayStr);
    }
  }, [day]);

  const refreshData = async () => {
    const semaphore = await getSemaphoreProcessingDate();
    const semaphoreFormat = semaphore.map((sem, index) => {
      return {
        ...sem,
        num: index + 1,
        id: sem.cloudfunc_log_sync_id,
      };
    });
    setRows(semaphoreFormat);
    const dayStr = formatDateNoTzString(day, formatDateFnsDate4);
    const summarySync = await getSyncCountSummary(dayStr);
    summarySync.forEach((s) => {
      if ((s.cloud_function as string) === CloudFunctionValue.Sap) {
        setCountSyncSap(s.cloudfunc_log_sync_id);
      } else if ((s.cloud_function as string) === CloudFunctionValue.Oracle) {
        setCountSyncOracle(s.cloudfunc_log_sync_id);
      }
    });
    const summaryError = await getErrorCountSummary(dayStr);
    summaryError.forEach((s) => {
      if ((s.cloud_function as string) === CloudFunctionValue.Sap) {
        setCountErrorSap(s.cloudfunc_log_error_id);
      } else if ((s.cloud_function as string) === CloudFunctionValue.Oracle) {
        setCountErrorOracle(s.cloudfunc_log_error_id);
      }
    });
  };

  return (
    <main>
      <div className="p-6">
        <div className="flex flex-row items-center justify-start mb-4">
          <h1 className="text-2xl font-semibold">
            Resumen del día{" "}
            {capitalize(formatDateNoTzString(day, formatDateFnsDate2))}
          </h1>
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
        <Grid container spacing={3}>
          <Grid item xs={12} className="pt-5">
            <h1 className="text-xl font-semibold">Sincronizaciones</h1>
          </Grid>
          <Grid item xs={6}>
            <Paper className="p-2" elevation={2}>
              <span className="flex font-semibold items-center justify-center text-xl text-[#555]">
                CF Sap
              </span>
              <div className="flex items-center justify-center mt-2">
                <span className="font-semibold text-2xl">{countSyncSap}</span>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className="p-2" elevation={2}>
              <span className="flex font-semibold items-center justify-center text-xl text-[#555]">
                CF Oracle
              </span>
              <div className="flex items-center justify-center mt-2">
                <span className="font-semibold text-2xl">
                  {countSyncOracle}
                </span>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <h1 className="text-xl font-semibold text-red-400">Errores</h1>
          </Grid>
          <Grid item xs={6}>
            <Paper className="p-2" elevation={2}>
              <span className="flex font-semibold items-center justify-center text-xl text-[#555]">
                CF Sap
              </span>
              <div className="flex items-center justify-center mt-2">
                <span className="font-semibold text-2xl">{countErrorSap}</span>
              </div>
            </Paper>
          </Grid>          
          <Grid item xs={6}>
            <Paper className="p-2" elevation={2}>
              <span className="flex font-semibold items-center justify-center text-xl text-[#555]">
                CF Oracle
              </span>
              <div className="flex items-center justify-center mt-2">
                <span className="font-semibold text-2xl">
                  {countErrorOracle}
                </span>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <h1 className="text-xl font-semibold">Semáforo de Procesamiento</h1>
          </Grid>
          <Grid item xs={12}>
            <div className="w-full">
              <DataGrid
                rows={rows}
                columns={columns}
                disableColumnMenu
                disableColumnFilter
                disableColumnSorting
                hideFooter
                autoHeight
                columnHeaderHeight={60}
                sx={{
                  "& .MuiDataGrid-columnHeader": {
                    backgroundColor: "#f3f4f6",
                  },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    whiteSpace: "normal",
                    lineHeight: "1.2em",
                    color: "#222",
                    fontWeight: "600",
                  },
                }}
                getRowId={(row) => row.id}
              />
            </div>
          </Grid>
        </Grid>
      </div>
    </main>
  );
}
