import type { Handlers, PageProps } from "$fresh/server.ts";
import { MainWrapper } from "../../../components/MainWrapper.tsx";
import { connection } from "../../../db.ts";
import type {
  PERSON,
  RSVP,
  RSVP_EVENT,
  RSVP_RESPONSE,
} from "../../../types.ts";
import { DAYS, ELEMENT_TO_NUMBER, MONTHS } from "../../../util.ts";

interface Data {
  results: (PERSON & RSVP_RESPONSE)[];
  events: RSVP_EVENT[];
}

const getRsvpsForGroup = async (
  id: number
): Promise<{ rows: (PERSON & RSVP_RESPONSE)[] }> => {
  const { rows } = await connection.queryObject<PERSON & RSVP_RESPONSE>(`
  SELECT DISTINCT first_name, last_name, id, rsvp_event, boolean_response, varchar_response
  FROM person
  INNER JOIN rsvp_group_assignment
  ON rsvp_group_assignment.person_id = person.id
  LEFT JOIN rsvp_response
  ON rsvp_response.person_id = person.id
  WHERE rsvp_group_assignment.rsvp_group_id = ${id};
  `);
  return { rows };
};

const getRsvpEvents = async (): Promise<{ rows: RSVP_EVENT[] }> => {
  const { rows } = await connection.queryObject<RSVP_EVENT>(`
  SELECT * FROM rsvp_event ORDER BY event_time;
  `);
  return { rows };
};

const updateRsvpResponse = async (
  eventId: string,
  personId: string,
  value: boolean
): Promise<{ rows: (PERSON & RSVP)[] }> => {
  const { rows } = await connection.queryObject<PERSON & RSVP>(`
  INSERT INTO rsvp_response (rsvp_event, person_id, boolean_response) VALUES
  (${eventId}, ${personId}, ${value})
  ON CONFLICT (rsvp_event, person_id) DO UPDATE SET boolean_response = ${value}
  RETURNING *;
  `);
  return { rows };
};

export const handler: Handlers<Data> = {
  async POST(req, _ctx) {
    try {
      if (_ctx.params.event_id === "thursday") {
        for (const curr of await req.formData()) {
          const [eventId, personId] = curr[0].split(":");
          await updateRsvpResponse(eventId, personId, curr[1] === "true");
        }

        const headers = new Headers();
        headers.set("location", `/rsvp/${_ctx.params.group_id}/friday`);
        return new Response(null, {
          status: 303,
          headers,
        });
      }

      return _ctx.render({
        results: [],
        events: [],
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
      const { rows: rsvpEventRows } = await getRsvpEvents();

      return _ctx.render({
        results: rsvpRows,
        events: rsvpEventRows,
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
  const personIds = Array.from(
    new Set(data.results.map((result) => result.id))
  );
  const personIdToPerson = new Map<number, PERSON>(
    personIds.map((personId) => {
      return [personId, data.results.find((person) => person.id === personId)!];
    })
  );

  return (
    <MainWrapper>
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
        <>
          {params.event_id === "thursday"
            ? "Thursday Evening"
            : params.event_id === "friday"
            ? "Friday Evening"
            : "Saturday Evening"}
          <form
            method="post"
            action={`/rsvp/${params.group_id}/${params.event_id}`}
          >
            {data.events.map((result) => (
              <div key={result.id} class="flex flex-col py-4">
                <div class="font-bold text-xl w-full">{result.title}</div>
                <div>{result.description}</div>
                <div>{`${DAYS[result.event_time.getDay()]}, ${
                  MONTHS[result.event_time.getMonth()]
                } ${result.event_time.getDate()}`}</div>
                {personIds.map((personId) => {
                  const person = personIdToPerson.get(personId)!;
                  const response = data.results.find(
                    (result) =>
                      result.rsvp_event === result.id && result.id === personId
                  );
                  return (
                    <div key={person.id} class="w-56 flex justify-between">
                      <div>{`${person.first_name} ${person.last_name}`}</div>
                      <label for={`${result.id}:${person.id}`}>Yes</label>
                      <input
                        type="radio"
                        id={`${result.id}:${person.id}`}
                        name={`${result.id}:${person.id}`}
                        value="true"
                        checked={
                          response && response.boolean_response === true
                            ? true
                            : false
                        }
                      />
                      <label for={`${result.id}:${person.id}`}>No</label>
                      <input
                        type="radio"
                        id={`${result.id}:${person.id}`}
                        name={`${result.id}:${person.id}`}
                        value="false"
                        checked={
                          response && response.boolean_response === false
                            ? true
                            : false
                        }
                      />
                    </div>
                  );
                })}
              </div>
            ))}
            <button type="submit">Next</button>
          </form>
        </>
      ) : null}
    </MainWrapper>
  );
}
