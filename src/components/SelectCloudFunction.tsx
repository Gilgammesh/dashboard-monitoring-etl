import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { CloudFunctionValue, CloudFunctionName } from "@/enums/cloud-functions";

interface Props {
  readonly cloudFunction: string;
  readonly setCloudFunction: (value: string) => void;
}

export default function SelectCloudFunction({
  cloudFunction,
  setCloudFunction,
}: Props) {
  const handleChange = (event: SelectChangeEvent) => {
    setCloudFunction(event.target.value);
  };

  return (
    <FormControl variant="outlined" className="w-72">
      <InputLabel id="cloud-function-label">Cloud Function</InputLabel>
      <Select
        labelId="cloud-function-label"
        id="cloud-function-select"
        value={cloudFunction}
        onChange={handleChange}
        label="Cloud Function"
      >
        <MenuItem value={CloudFunctionValue.Sap}>
          {CloudFunctionName.Sap}
        </MenuItem>
        <MenuItem value={CloudFunctionValue.Oracle}>
          {CloudFunctionName.Oracle}
        </MenuItem>
      </Select>
    </FormControl>
  );
}
