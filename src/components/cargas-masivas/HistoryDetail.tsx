import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridCellParams,
} from "@mui/x-data-grid";
import { capitalize } from "lodash";
import { IoCloseOutline, IoCopyOutline } from "react-icons/io5";
import { CalendarEvent } from "@/interfaces/calendar";
import { formatDateNoTzString, formatDateString } from "@/helpers/dates";
import { formatDateFnsDate2, formatTime2 } from "@/config/constants";
import { getMassiveHistoryDetail } from "@/actions/massive.actions";
import { CloudFunctionValue } from "@/enums/cloud-functions";
import { formatTimeInputMin } from "@/helpers/times";

interface Props {
  readonly open: boolean;
  readonly setOpen: (value: boolean) => void;
  readonly selectedEvent: CalendarEvent;
  readonly setSelectedEvent: (value: CalendarEvent | null) => void;
  readonly day: Date;
}

const RenderCellCopy = (params: GridCellParams) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
    }}
  >
    <span
      style={{
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {params.value as string}
    </span>
    <Tooltip title="Copiar">
      <IconButton
        aria-label="copy"
        size="small"
        onClick={() => {
          navigator.clipboard.writeText(params.value as string);
        }}
      >
        <IoCopyOutline />
      </IconButton>
    </Tooltip>
  </div>
);

const columns: GridColDef[] = [
  { field: "num", headerName: "#", flex: 1, maxWidth: 50 },
  {
    field: "cf_partial_execution_time",
    headerName: "Duración",
    flex: 1,
  },
  {
    field: "postgres_table",
    headerName: "Tabla PostgreSQL",
    flex: 1,
  },
  {
    field: "inserted_rows",
    headerName: "Registros Insertados",
    flex: 1,
  },
  {
    field: "updated_rows",
    headerName: "Registros Actualizados",
    flex: 1,
  },
  {
    field: "no_repeat_rows",
    headerName: "Registros No Repetidos",
    flex: 1,
  },
  {
    field: "filtered_entities",
    headerName: "Entidades de Filtro",
    flex: 1,
    minWidth: 180,
  },
  {
    field: "filtered_rows",
    headerName: "Registros Filtrados",
    flex: 1,
  },
  {
    field: "bigquery_entity",
    headerName: "Entidad BigQuery",
    flex: 1,
  },
  {
    field: "bigquery_rows",
    headerName: "Registros BigQuery",
    flex: 1,
  },
  {
    field: "bigquery_query",
    headerName: "Query BigQuery",
    flex: 2,
    maxWidth: 300,
    renderCell: RenderCellCopy,
  },
  {
    field: "process_date_str",
    headerName: "Process Date",
    flex: 1,
    minWidth: 230,
  },
];

export default function HistoryDetail({
  open,
  setOpen,
  selectedEvent,
  setSelectedEvent,
  day,
}: Props) {
  const { id, title, start } = selectedEvent;

  const [rows, setRows] = useState<GridRowsProp>([]);

  useEffect(() => {
    const getHistoryDetail = async () => {
      const detail = await getMassiveHistoryDetail(id);
      const detailFormat = detail.map((det, index) => {
        return {
          ...det,
          num: index + 1,
          id: det.cloudfunc_log_sync_id,
          cf_partial_execution_time: formatTimeInputMin(
            Number(det.cf_partial_execution_time)
          ),
        };
      });
      setRows(detailFormat);
    };
    if (id) {
      getHistoryDetail();
    }
  }, [id]);

  const handleBackdropClose = (event: React.MouseEvent, reason: string) => {
    if (reason === "backdropClick") {
      return;
    }
    setSelectedEvent(null);
    setOpen(false);
  };

  const handleClickClose = () => {
    setSelectedEvent(null);
    setOpen(false);
  };

  const handleCellClick = (params: GridCellParams) => {
    if (params.field === "bigquery_query") {
      navigator.clipboard.writeText(params.value as string);
      alert("Contenido copiado al portapapeles");
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={handleBackdropClose}
      aria-labelledby="sinchronization-list"
      disableEscapeKeyDown
    >
      <DialogTitle>
        <span className="font-semibold">
          Detalle del día {capitalize(formatDateString(day, formatDateFnsDate2))}
        </span>
        <IconButton
          aria-label="close"
          onClick={handleClickClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[700],
          }}
        >
          <IoCloseOutline />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <div className="flex flex-col gap-3 mb-5">
          <div>
            <span className="font-medium">ID: </span>
            <span>{id}</span>
          </div>
          <div>
            <span className="font-medium">Tipo: </span>
            <span>{title}</span>
            <span className="font-medium ml-6">Cloud Function: </span>
            <span>{CloudFunctionValue.Sap}</span>
          </div>
          <div>
            <span className="font-medium">Hora de Inicio: </span>
            <span>{start ? formatDateNoTzString(start, formatTime2) : ""}</span>
            <span className="font-medium ml-6">Duración: </span>
            <span>
              {rows.length > 0
                ? formatTimeInputMin(Number(rows[0]["cf_total_execution_time"]))
                : ""}
            </span>
          </div>
        </div>
        {selectedEvent && (
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
                  fontWeight: "500",
                },
              }}
              getRowId={(row) => row.id}
              onCellClick={handleCellClick}
            />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClickClose} color="success">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
