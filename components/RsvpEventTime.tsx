import { JSX } from "preact";
import dayjs from "https://esm.sh/dayjs";
import utc from "https://esm.sh/dayjs/plugin/utc";
import timezone from "https://esm.sh/dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export function RsvpEventTime(
  props: JSX.HTMLAttributes<HTMLParagraphElement> & { date: Date }
) {
  const { date, ...rest } = props;
  return !date ? null : (
    <p {...rest}>{dayjs(date).tz("America/New_York").format("h:mma")}</p>
  );
}
