import type { Handlers } from "$fresh/server.ts";
import { connection } from "../../../db.ts";

type GUEST_UNIT = { name: string };

export const handler: Handlers<GUEST_UNIT | null> = {
  async POST(req, _ctx) {
    const guestUnit = (await req.json()) as GUEST_UNIT;
    const name = guestUnit.name.toLowerCase();

    try {
      await connection.queryObject`
        INSERT INTO rsvp (name)
        VALUES (${name})
        ON CONFLICT (name)
        DO NOTHING 
      `;
      return new Response(
        JSON.stringify({ result: `RSVP created for ${name}` })
      );
    } catch (e) {
      throw new Error("Something went wrong.");
    } finally {
      connection.release();
    }
  },
};
