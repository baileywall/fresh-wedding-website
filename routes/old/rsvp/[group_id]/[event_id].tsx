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

const updateThursdayRsvpForPerson = async (newRsvp: {
  person_id: number;
  attend_thursday?: boolean;
}): Promise<{ rows: (PERSON & RSVP)[] }> => {
  const { rows } = await connection.queryObject<PERSON & RSVP>(`
  UPDATE rsvp
  SET attend_thursday = ${newRsvp.attend_thursday}
  WHERE person_id = ${newRsvp.person_id}
  RETURNING *;
  `);
  return { rows };
};

const updateFridayRsvpForPerson = async (newRsvp: {
  person_id: number;
  attend_friday?: boolean;
}): Promise<{ rows: (PERSON & RSVP)[] }> => {
  const { rows } = await connection.queryObject<PERSON & RSVP>(`
  UPDATE rsvp
  SET attend_friday = ${newRsvp.attend_friday}
  WHERE person_id = ${newRsvp.person_id}
  RETURNING *;
  `);
  return { rows };
};

const updateSaturdayRsvpForPerson = async (newRsvp: {
  person_id: number;
  attend_saturday?: boolean;
}): Promise<{ rows: (PERSON & RSVP)[] }> => {
  const { rows } = await connection.queryObject<PERSON & RSVP>(`
  UPDATE rsvp
  SET attend_saturday = ${newRsvp.attend_saturday}
  WHERE person_id = ${newRsvp.person_id}
  RETURNING *;
  `);
  return { rows };
};

export const handler: Handlers<Data> = {
  async POST(req, _ctx) {
    try {
      const newRsvps = Array.from((await req.formData()).entries()).reduce(
        (prev, curr) => {
          const [personId, name] = curr[0].split(":");
          if (!prev.has(personId)) {
            prev.set(personId, { person_id: Number(personId) });
          }
          const existing = prev.get(personId) as { person_id: number };
          prev.set(personId, {
            ...existing,
            [name]: curr[1].toString() === "true" ? true : false,
          });
          return prev;
        },
        new Map<
          string,
          {
            person_id: number;
            attend_thursday?: boolean;
            attend_friday?: boolean;
            attend_saturday?: boolean;
          }
        >()
      );

      if (_ctx.params.event_id === "thursday") {
        const promisedUpdates = Array.from(newRsvps.entries()).map(
          async (entry) => {
            return await updateThursdayRsvpForPerson(entry[1]);
          }
        );
        await Promise.all(promisedUpdates);

        const headers = new Headers();
        headers.set("location", `/rsvp/${_ctx.params.group_id}/friday`);
        return new Response(null, {
          status: 303,
          headers,
        });
      } else if (_ctx.params.event_id === "friday") {
        const promisedUpdates = Array.from(newRsvps.entries()).map(
          async (entry) => {
            return await updateFridayRsvpForPerson(entry[1]);
          }
        );
        await Promise.all(promisedUpdates);

        const headers = new Headers();
        headers.set("location", `/rsvp/${_ctx.params.group_id}/saturday`);
        return new Response(null, {
          status: 303,
          headers,
        });
      } else if (_ctx.params.event_id === "saturday") {
        const promisedUpdates = Array.from(newRsvps.entries()).map(
          async (entry) => {
            return await updateSaturdayRsvpForPerson(entry[1]);
          }
        );
        await Promise.all(promisedUpdates);

        const headers = new Headers();
        headers.set("location", `/rsvp/${_ctx.params.group_id}`);
        return new Response(null, {
          status: 303,
          headers,
        });
      }

      return _ctx.render({
        results: [],
      });
    } catch (e) {
      console.log(e);
      throw new Error("Something went wrong.");
    } finally {
      // Release the connection back into the pool
      connection.release();
    }
  },
  async GET(req, _ctx) {
    try {
      const groupId = ELEMENT_TO_NUMBER.get(_ctx.params.group_id);
      if (!groupId) {
        throw new Error();
      }

      const { rows: rsvpRows } = await getRsvpsForGroup(groupId);

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

export default function RsvpGroupEvent({ data, params }: PageProps<Data>) {
  return (
    <div class="py-8 mx-auto flex flex-col items-center text-2xl gap-8">
      {/*<div class="text-center text-3xl w-full">Coming soon!</div>*/}
      <div class="w-96">
        <div class="w-full bg-gray-500 p-3 rounded-sm shadow-inner">
          <span
            class={`block bg-gray-700 h-2 rounded-sm ${
              params.event_id === "thursday"
                ? "w-1/4"
                : params.event_id === "friday"
                ? "w-2/4"
                : "w-3/4"
            }`}
          />
        </div>
      </div>
      {data.results ? (
        params.event_id === "thursday" ? (
          <>
            Thursday Evening
            <form method="post" action={`/rsvp/${params.group_id}/thursday`}>
              {data.results.map((result) => (
                <div key={result.id} class="w-56 flex justify-between">
                  <div>{`${result.first_name} ${result.last_name}`}</div>
                  <label for={`${result.id}:attend_thursday`}>Yes</label>
                  <input
                    type="radio"
                    id={`${result.id}:attend_thursday`}
                    name={`${result.id}:attend_thursday`}
                    value="true"
                    checked={result.attend_thursday === true ? true : false}
                  />
                  <label for={`${result.id}:attend_thursday`}>No</label>
                  <input
                    type="radio"
                    id={`${result.id}:attend_thursday`}
                    name={`${result.id}:attend_thursday`}
                    value="false"
                    checked={result.attend_thursday === false ? true : false}
                  />
                </div>
              ))}
              <button type="submit">Next</button>
            </form>
          </>
        ) : params.event_id === "friday" ? (
          <>
            Friday Evening
            <form method="post" action={`/rsvp/${params.group_id}/friday`}>
              {data.results.map((result) => (
                <div key={result.id} class="w-56 flex justify-between">
                  <div>{`${result.first_name} ${result.last_name}`}</div>
                  <label for={`${result.id}:attend_friday`}>Yes</label>
                  <input
                    type="radio"
                    id={`${result.id}:attend_friday`}
                    name={`${result.id}:attend_friday`}
                    value="true"
                    checked={result.attend_friday === true ? true : false}
                  />
                  <label for={`${result.id}:attend_friday`}>No</label>
                  <input
                    type="radio"
                    id={`${result.id}:attend_friday`}
                    name={`${result.id}:attend_friday`}
                    value="false"
                    checked={result.attend_friday === false ? true : false}
                  />
                </div>
              ))}
              <button type="submit">Next</button>
            </form>
          </>
        ) : (
          <>
            Saturday Evening
            <form method="post" action={`/rsvp/${params.group_id}/saturday`}>
              {data.results.map((result) => (
                <div key={result.id} class="w-56 flex justify-between">
                  <div>{`${result.first_name} ${result.last_name}`}</div>
                  <label for={`${result.id}:attend_saturday`}>Yes</label>
                  <input
                    type="radio"
                    id={`${result.id}:attend_saturday`}
                    name={`${result.id}:attend_saturday`}
                    value="true"
                    checked={result.attend_saturday === true ? true : false}
                  />
                  <label for={`${result.id}:attend_saturday`}>No</label>
                  <input
                    type="radio"
                    id={`${result.id}:attend_saturday`}
                    name={`${result.id}:attend_saturday`}
                    value="false"
                    checked={result.attend_saturday === false ? true : false}
                  />
                </div>
              ))}
              <button type="submit">Next</button>
            </form>
          </>
        )
      ) : null}
    </div>
  );
}
