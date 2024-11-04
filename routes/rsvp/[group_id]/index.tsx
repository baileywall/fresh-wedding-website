import type { Handlers, PageProps } from "$fresh/server.ts";
import { MainWrapper } from "../../../components/MainWrapper.tsx";
import { connection } from "../../../db.ts";
import type { PERSON, RSVP_RESPONSE, RSVP_EVENT } from "../../../types.ts";
import { DAYS, ELEMENT_TO_NUMBER, MONTHS } from "../../../util.ts";

interface Data {
  results: (PERSON & RSVP_RESPONSE)[];
  events: RSVP_EVENT[];
}

const getRsvpsForGroup = async (
  id: number
): Promise<{ rows: (PERSON & RSVP_RESPONSE)[] }> => {
  const { rows } = await connection.queryObject<PERSON & RSVP_RESPONSE>(`
  SELECT DISTINCT first_name, last_name, id, rsvp_event
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

export const handler: Handlers<Data> = {
  async GET(req, _ctx) {
    try {
      const groupId = ELEMENT_TO_NUMBER.get(_ctx.params.group_id);
      console.log(groupId);
      if (!groupId) {
        throw new Error();
      }

      const { rows: rsvpRows } = await getRsvpsForGroup(groupId);
      const { rows: rsvpEventRows } = await getRsvpEvents();

      /* if (rsvpRows.find((person) => person.attend_thursday === null)) {
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
      } */

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

export default function RsvpGroup({ data, params }: PageProps<Data>) {
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
      <div class="w-400">
        {data.events.map((result) => (
          <div key={result.id} class="flex flex-col py-4">
            <div class="font-bold text-xl w-full">{result.title}</div>
            <div>{result.description}</div>
            <div>{`${DAYS[result.event_time.getDay()]}, ${
              MONTHS[result.event_time.getMonth()]
            } ${result.event_time.getDate()}`}</div>
            {personIds.map((personId) => {
              const person = personIdToPerson.get(personId);
              return (
                <div
                  key={`person-${personId}`}
                >{`${person?.first_name} ${person?.last_name}`}</div>
              );
            })}
          </div>
        ))}
      </div>
    </MainWrapper>
  );
}
