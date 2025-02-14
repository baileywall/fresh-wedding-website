import { JSX } from "preact";
import dayjs from "https://esm.sh/dayjs";
import utc from "https://esm.sh/dayjs/plugin/utc";
import timezone from "https://esm.sh/dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export function RsvpEventDate(props: JSX.HTMLAttributes & { date: Date }) {
  const { date } = props;
  return (
    <p>{dayjs(date).tz("America/New_York").format("dddd, MMMM D h:mma EST")}</p>
  );
}
