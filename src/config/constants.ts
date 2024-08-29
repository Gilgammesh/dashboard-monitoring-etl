import { es } from "date-fns/locale/es";
import { Formats } from "react-big-calendar";

export const timeZone = "America/Santiago";
export const localeEs = es;

export const formatDateFnsDate1 = "dd/MM/yyyy";
export const formatDateFnsDate2 = "EEEE, dd 'de' MMMM 'de' yyyy";
export const formatDateFnsDate3 = "EEEE, dd 'de' MMMM";
export const formatDateFnsDate4 = "yyyy-MM-dd";
export const formatDateFnsDate5 = "yyyy-MM-dd HH:mm:ss.SSSSSS";
export const formatDateFnsDate6 = "yyyy-MM-dd hh:mm:ss a";
export const formatDateFnsDate7 = "EEEE, dd 'de' MMMM 'de' yyyy hh:mm:ss a";

export const formatMomentDate1 = "DD/MM/YYYY";
export const formatMomentDate2 = "dddd, DD [de] MMMM [de] YYYY";
export const formatMomentDate3 = "dddd, DD [de] MMMM";
export const formatMomentDate4 = "YYYY-MM-DD";
export const formatMomentDate5 = "YYYY-MM-DD HH:mm:ss.SSSSSS";
export const formatMomentDate6 = "YYYY-MM-DD hh:mm:ss a";
export const formatMomentDate7 = "dddd, DD [de] MMMM [de] YYYY hh:mm:ss a";

export const formatDateFnsDay1 = "EEEE dd";
export const formatDateFnsDay2 = "EEEE";
export const formatDateFnsDay3 = "dd";

export const formatMomentDay1 = "dddd DD";

export const formatTime1 = "h a";
export const formatTime2 = "hh:mm a";

export const titleDelta = "Sincronización Delta";
export const titleRecovery = "Recuperación de Datos";
export const titleMassive = "Carga Masiva de Datos";
export const titleError = "Errores en Cloud Function";

export const calendarDateFnsFormats: Formats = {
  timeGutterFormat: formatTime1,
  dayHeaderFormat: formatDateFnsDate3,
};

export const calendarMomentFormats: Formats = {
  timeGutterFormat: formatTime1,
  dayHeaderFormat: formatMomentDate3,
};
