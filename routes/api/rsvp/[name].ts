import type { Handlers } from "$fresh/server.ts";
import { connection } from "../../../db.ts";

type GUEST_UNIT = { name: string };

export const handler: Handlers<GUEST_UNIT | null> = {
  async GET(req, _ctx) {
    try {
      const name = _ctx.params.name.toLowerCase();
      const { rows } = await connection.queryObject`
        SELECT * from person where name = ${name}
      `;
      if (rows.length === 0) {
        return new Response(
          JSON.stringify({ result: `RSVP for ${name} not found` })
        );
      }
      return new Response(JSON.stringify(rows));
    } catch (e) {
      throw new Error("Something went wrong.");
    } finally {
      // Release the connection back into the pool
      connection.release();
    }
  },
};
