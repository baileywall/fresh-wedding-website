import { connection } from "../db.ts";
import type { PERSON, RSVP_RESPONSE } from "../types.ts";

export const getRsvpsForGroup = async (
  id: number
): Promise<{ rows: (PERSON & RSVP_RESPONSE)[] }> => {
  const { rows } = await connection.queryObject<PERSON & RSVP_RESPONSE>(`
  SELECT DISTINCT first_name, last_name, id, rsvp_event, options_response, text_response
  FROM person
  INNER JOIN rsvp_group_assignment
  ON rsvp_group_assignment.person_id = person.id
  LEFT JOIN rsvp_response
  ON rsvp_response.person_id = person.id
  WHERE rsvp_group_assignment.rsvp_group_id = ${id};
  `);
  return { rows };
};
