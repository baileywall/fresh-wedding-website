import type { Handlers, PageProps } from "$fresh/server.ts";
import { connection } from "../../../../db.ts";
import type { PERSON, RSVP } from "../../../../types.ts";
import { ELEMENT_TO_NUMBER } from "../../../../util.ts";

interface Data {
  results: (PERSON & RSVP)[];
}

const getRsvpsForGroup = async (
  id: number
): Promise<{ rows: (PERSON & RSVP)[] }> => {
  const { rows } = await connection.queryObject<PERSON & RSVP>(`
  SELECT DISTINCT first_name, last_name, id, attend_thursday, attend_friday, attend_saturday
  FROM person
  INNER JOIN rsvp
  ON rsvp.person_id = person.id
  WHERE rsvp.rsvp_group_id = ${id};
  `);
  return { rows };
};

export const handler: Handlers<Data> = {
  async GET(req, _ctx) {
    try {
      const groupId = ELEMENT_TO_NUMBER.get(_ctx.params.group_id);
      if (!groupId) {
        throw new Error();
      }

      const { rows: rsvpRows } = await getRsvpsForGroup(groupId);

      if (rsvpRows.find((person) => person.attend_thursday === null)) {
        const headers = new Headers();
        headers.set("location", `/rsvp/${_ctx.params.group_id}/thursday`);
        return new Response(null, {
          status: 303,
          headers,
        });
      } else if (rsvpRows.find((person) => person.attend_friday === null)) {
        const headers = new Headers();
        headers.set("location", `/rsvp/${_ctx.params.group_id}/friday`);
        return new Response(null, {
          status: 303,
          headers,
        });
      } else if (rsvpRows.find((person) => person.attend_saturday === null)) {
        const headers = new Headers();
        headers.set("location", `/rsvp/${_ctx.params.group_id}/saturday`);
        return new Response(null, {
          status: 303,
          headers,
        });
      }

      return _ctx.render({
        results: rsvpRows,
      });
    } catch (e) {
      console.log(e);
      throw new Error("Something went wrong.");
    } finally {
      // Release the connection back into the pool
      connection.release();
    }
  },
};

export default function RsvpGroup({ data, params }: PageProps<Data>) {
  return (
    <div class="py-8 mx-auto flex flex-col items-center text-2xl gap-8">
      {/*<div class="text-center text-3xl w-full">Coming soon!</div>*/}
      {data.results ? (
        <>
          <div>Thanks for your RSVP!</div>
          Thursday Evening
          <div>
            {data.results.map((result) => (
              <div key={result.id} class="w-56 flex justify-between">
                {`${result.first_name} ${result.last_name}`}
                <div>{result.attend_thursday ? "YES" : "NO"}</div>
              </div>
            ))}
          </div>
          Friday Evening
          <div>
            {data.results.map((result) => (
              <div key={result.id} class="w-56 flex justify-between">
                {`${result.first_name} ${result.last_name}`}
                <div>{result.attend_friday ? "YES" : "NO"}</div>
              </div>
            ))}
          </div>
          Saturday Evening
          <div>
            {data.results.map((result) => (
              <div key={result.id} class="w-56 flex justify-between">
                {`${result.first_name} ${result.last_name}`}
                <div>{result.attend_saturday ? "YES" : "NO"}</div>
              </div>
            ))}
          </div>
          <a href={`/rsvp/${params.group_id}/thursday`}>Edit</a>
        </>
      ) : null}
    </div>
  );
}
