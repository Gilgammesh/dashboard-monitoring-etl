export const formatTimeInputMin = (minutes: number): string => {
  const totalSeconds = Math.floor(minutes * 60);
  const hours = Math.floor(totalSeconds / 3600);
  const remainingSeconds = totalSeconds % 3600;
  const mins = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  const timeParts: string[] = [];

  if (hours === 1) {
    timeParts.push(`${hours} hora`);
  } else if (hours > 1) {
    timeParts.push(`${hours} horas`);
  }
  if (mins === 1) {
    timeParts.push("1 minuto");
  } else if (mins > 1) {
    timeParts.push(`${mins} minutos`);
  }
  if (seconds === 1) {
    timeParts.push(`${seconds} segundo`);
  } else if (seconds > 1) {
    timeParts.push(`${seconds} segundos`);
  }

  if (timeParts.length === 0) {
    return "0 segundos";
  }

  if (timeParts.length === 1) {
    return timeParts[0];
  }

  return `${timeParts.slice(0, -1).join(", ")} y ${
    timeParts[timeParts.length - 1]
  }`;
};
