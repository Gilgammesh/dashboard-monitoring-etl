import { getGmt } from "@/helpers/dates";

export default function TimeGutterHeader() {
  return <span>{getGmt()}</span>;
}
