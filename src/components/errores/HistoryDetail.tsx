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
import { formatDateString } from "@/helpers/dates";
import { formatDateFnsDate2, formatDateFnsDate6 } from "@/config/constants";
import { getErrorHistoryDetail } from "@/actions/error.actions";
import {
  CloudFunctionStatus,
  CloudFunctionValue,
} from "@/enums/cloud-functions";

interface Props {
  readonly open: boolean;
  readonly setOpen: (value: boolean) => void;
  readonly selectedEvent: CalendarEvent;
  readonly setSelectedEvent: (value: CalendarEvent | null) => void;
  readonly cloudFunction: string;
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
    field: "status",
    headerName: "Estado",
    flex: 1,
    maxWidth: 150,
    renderCell: (params) => (
      <span
        className={
          params.value === CloudFunctionStatus.Recovered
            ? "text-green-600"
            : "text-red-500"
        }
      >
        {capitalize(params.value as string)}
      </span>
    ),
  },
  {
    field: "created_at_str",
    headerName: "Fecha de Fallo",
    flex: 1,
    maxWidth: 250,
  },
  {
    field: "updated_at_str",
    headerName: "Fecha de Recuperación",
    flex: 1,
    maxWidth: 250,
  },
  {
    field: "error",
    headerName: "Descripción del Error",
    flex: 2,
    renderCell: RenderCellCopy,
  },
];

export default function HistoryDetail({
  open,
  setOpen,
  selectedEvent,
  setSelectedEvent,
  cloudFunction,
}: Props) {
  const { id, title, start } = selectedEvent;

  const [rows, setRows] = useState<GridRowsProp>([]);

  useEffect(() => {
    const getHistoryDetail = async () => {
      const detail = await getErrorHistoryDetail(cloudFunction, id);
      const detailFormat = detail.map((det, index) => {
        return {
          ...det,
          num: index + 1,
          id: det.cloudfunc_log_error_id,
          created_at_str: formatDateString(det.created_at, formatDateFnsDate6),
          updated_at_str:
            det.status === CloudFunctionStatus.Recovered
              ? formatDateString(det.updated_at, formatDateFnsDate6)
              : "",
        };
      });
      setRows(detailFormat);
    };
    if (id) {
      getHistoryDetail();
    }
  }, [id, cloudFunction]);

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
          Detalle del día{" "}
          {capitalize(formatDateString(start as Date, formatDateFnsDate2))}
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
            <span className="font-medium">Tipo: </span>
            <span>{title}</span>
            <span className="font-medium ml-6">Cloud Function: </span>
            <span>{CloudFunctionValue.Sap}</span>
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
