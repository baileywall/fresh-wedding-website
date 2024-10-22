import type { Handlers } from "$fresh/server.ts";
import { connection } from "../../../db.ts";
import type { PERSON, RSVP } from "../../../types.ts";

type GUEST_UNIT = { name: string };

const getRsvpsForPersonsGroup = async (
  id: number
): Promise<{ rows: (PERSON & RSVP)[] }> => {
  const { rows } = await connection.queryObject<PERSON & RSVP>(`
  SELECT first_name, last_name, id, rsvp_group_id
  FROM person 
  INNER JOIN (
    SELECT r2.rsvp_group_id, r2.person_id
    FROM rsvp r1
    INNER JOIN rsvp r2
    ON r1.rsvp_group_id = r2.rsvp_group_id
    WHERE r1.person_id = ${id}
  ) r3 on r3.person_id = person.id;
  `);
  return { rows };
};

export const handler: Handlers<GUEST_UNIT | null> = {
  async GET(req, _ctx) {
    try {
      const name = decodeURI(_ctx.params.name.toLowerCase());
      if (!name || name.length === 0) {
        return new Response(
          JSON.stringify({
            result: `Please include a name to look up your RSVP`,
          })
        );
      }

      const names = name.split(" ");

      if (names.length === 2) {
        const { rows: exactMatchRows } = await connection.queryObject<PERSON>(`
        SELECT * from person
        WHERE UPPER(first_name) LIKE UPPER('%${names[0]}%')
        AND UPPER(last_name) LIKE UPPER('%${names[1]}%')
        `);

        // person exact match
        if (exactMatchRows.length === 1) {
          const rows = getRsvpsForPersonsGroup(exactMatchRows[0].id);
          return new Response(
            JSON.stringify(rows, (_, value) =>
              typeof value === "bigint" ? value.toString() : value
            )
          );
        }
      }

      const { rows } =
        names.length === 1
          ? await connection.queryObject<PERSON>(`
        SELECT * from person
        WHERE UPPER(first_name) LIKE UPPER('%${names[0]}%')
        OR UPPER(last_name) LIKE UPPER('%${names[0]}%')`)
          : await connection.queryObject<PERSON>(`
        SELECT * FROM person
        WHERE UPPER(first_name) LIKE UPPER('%${names[0]}%')
        OR UPPER(last_name) LIKE UPPER('%${names[0]}%')
        OR UPPER(first_name) LIKE UPPER('%${names[1]}%')
        OR UPPER(last_name) LIKE UPPER('%${names[1]}%')`);

      if (rows.length === 0) {
        return new Response(JSON.stringify({ result: `RSVP not found` }));
      }
      return new Response(
        JSON.stringify(rows, (_, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );
    } catch (e) {
      console.log(e);
      throw new Error("Something went wrong.");
    } finally {
      // Release the connection back into the pool
      connection.release();
    }
  },
};
