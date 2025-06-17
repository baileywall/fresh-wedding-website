import { connection } from "../db.ts";
import type { RSVP_EVENT } from "../types.ts";

export const getRsvpEventsForRsvpGroup = async (
  groupId: number,
  selector?: string
): Promise<{ rows: RSVP_EVENT[] }> => {
  const { rows } = await connection.queryObject<RSVP_EVENT>(`
  SELECT * FROM rsvp_event, (
    SELECT types from rsvp_group WHERE id = ${groupId}
  ) this_rsvp_group 
  ${selector ? ` WHERE ${selector} AND ` : " WHERE "} 
  rsvp_event.rsvp_group_types IS NULL 
  OR this_rsvp_group.types && rsvp_event.rsvp_group_types 
  ORDER BY rsvp_event.grouping, rsvp_event.event_time;
  `);
  return { rows };
};
