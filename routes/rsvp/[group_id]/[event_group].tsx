import type { Handlers, PageProps } from "$fresh/server.ts";
import { MainWrapper } from "../../../components/MainWrapper.tsx";
import { OptionResponsesForm } from "../../../components/OptionResponsesForm.tsx";
import { PageHeader } from "../../../components/PageHeader.tsx";
import { RsvpEventDate } from "../../../components/RsvpEventDate.tsx";
import { TextResponsesForm } from "../../../components/TextResponsesForm.tsx";
import { connection } from "../../../db.ts";
import {
  EVENT_GROUPS,
  RSVP_EVENT_TYPE,
  type PERSON,
  type RSVP_EVENT,
  type RSVP_RESPONSE,
} from "../../../types.ts";
import { ELEMENT_TO_NUMBER } from "../../../util.ts";

interface Data {
  responses: (PERSON & RSVP_RESPONSE)[];
  events: RSVP_EVENT[];
}

// adding 4 hours b/c we're searching in utc
const EVENT_GROUP_SELECTOR = new Map<string, string>([
  [
    EVENT_GROUPS.THURSDAY,
    "where event_time BETWEEN '2025-10-23 04:00:00' AND '2025-10-24 03:59:59.999'",
  ],
  [
    EVENT_GROUPS.FRIDAY,
    "where event_time BETWEEN '2025-10-24 04:00:00' AND '2025-10-25 03:59:59.999'",
  ],
  [
    EVENT_GROUPS.SATURDAY,
    "where event_time BETWEEN '2025-10-25 04:00:00' AND '2025-10-26 03:59:59.999'",
  ],
  [
    EVENT_GROUPS.SUNDAY,
    "where event_time BETWEEN '2025-10-26 04:00:00' AND '2025-10-27 03:59:59.999'",
  ],
]);

const getRsvpsForGroup = async (
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

const getRsvpEvents = async (
  event_group: string
): Promise<{ rows: RSVP_EVENT[] }> => {
  const selector = EVENT_GROUP_SELECTOR.get(event_group);
  const { rows } = await connection.queryObject<RSVP_EVENT>(`
  SELECT * FROM rsvp_event ${selector} ORDER BY event_time;
  `);
  return { rows };
};

const updateOptionsRsvpResponse = async (
  eventId: string,
  personId: string,
  value: number
): Promise<{ rows: (PERSON & RSVP_RESPONSE)[] }> => {
  const { rows } = await connection.queryObject<PERSON & RSVP_RESPONSE>(`
  INSERT INTO rsvp_response (rsvp_event, person_id, options_response) VALUES
  (${eventId}, ${personId}, ${value})
  ON CONFLICT (rsvp_event, person_id) DO UPDATE SET options_response = ${value}
  RETURNING *;
  `);
  return { rows };
};

const updateTextRsvpResponse = async (
  eventId: string,
  personId: string,
  text: string
): Promise<{ rows: (PERSON & RSVP_RESPONSE)[] }> => {
  const { rows } = await connection.queryObject<PERSON & RSVP_RESPONSE>(`
  INSERT INTO rsvp_response (rsvp_event, person_id, text_response) VALUES
  (${eventId}, ${personId}, '${text}')
  ON CONFLICT (rsvp_event, person_id) DO UPDATE SET text_response = '${text}'
  RETURNING *;
  `);
  return { rows };
};

export const handler: Handlers<Data> = {
  async POST(req, _ctx) {
    try {
      for (const curr of await req.formData()) {
        const [eventId, personId, type] = curr[0].split(":");
        if (type === RSVP_EVENT_TYPE.OPTIONS) {
          await updateOptionsRsvpResponse(eventId, personId, Number(curr[1]));
        } else {
          await updateTextRsvpResponse(eventId, personId, curr[1] as string);
        }
      }

      if (_ctx.params.event_group === EVENT_GROUPS.THURSDAY) {
        const headers = new Headers();
        headers.set("location", `/rsvp/${_ctx.params.group_id}/friday`);
        return new Response(null, {
          status: 303,
          headers,
        });
      } else if (_ctx.params.event_group === EVENT_GROUPS.FRIDAY) {
        const headers = new Headers();
        headers.set("location", `/rsvp/${_ctx.params.group_id}/saturday`);
        return new Response(null, {
          status: 303,
          headers,
        });
      } else if (_ctx.params.event_group === EVENT_GROUPS.SATURDAY) {
        const headers = new Headers();
        headers.set("location", `/rsvp/${_ctx.params.group_id}/sunday`);
        return new Response(null, {
          status: 303,
          headers,
        });
      } else if (_ctx.params.event_group === EVENT_GROUPS.SUNDAY) {
        const headers = new Headers();
        headers.set("location", `/rsvp/${_ctx.params.group_id}`);
        return new Response(null, {
          status: 303,
          headers,
        });
      }

      return _ctx.render({
        responses: [],
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
  async GET(_, _ctx) {
    try {
      const groupId = ELEMENT_TO_NUMBER.get(_ctx.params.group_id);
      if (!groupId) {
        throw new Error();
      }

      const { rows: rsvpRows } = await getRsvpsForGroup(groupId);
      const { rows: rsvpEventRows } = await getRsvpEvents(
        _ctx.params.event_group
      );

      return _ctx.render({
        responses: rsvpRows,
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
    new Set(data.responses.map((result) => result.id))
  );
  const personIdToPerson = new Map<number, PERSON>(
    personIds.map((personId) => {
      return [
        personId,
        data.responses.find((person) => person.id === personId)!,
      ];
    })
  );

  return (
    <MainWrapper>
      <PageHeader>RSVP</PageHeader>
      <div class="w-full bg-eggplant-light rounded-sm shadow-inner">
        <span
          class={`block bg-eggplant h-2 rounded-sm ${
            params.event_group === EVENT_GROUPS.THURSDAY
              ? "w-1/5"
              : params.event_group === EVENT_GROUPS.FRIDAY
              ? "w-2/5"
              : params.event_group === EVENT_GROUPS.SATURDAY
              ? "w-3/5"
              : "w-4/5"
          }`}
        />
      </div>
      {data.responses ? (
        <>
          {/* params.event_group === EVENT_GROUPS.THURSDAY
              ? "Thursday"
              : params.event_group === EVENT_GROUPS.FRIDAY
              ? "Friday"
              : params.event_group === EVENT_GROUPS.SATURDAY
              ? "Saturday"
        : "Sunday" */}
          <form
            method="post"
            action={`/rsvp/${params.group_id}/${params.event_group}`}
            class="w-full"
          >
            {data.events.map((event) => (
              <div
                key={event.id}
                class="flex flex-col py-4 items-center w-full"
              >
                <h2 class="font-script font-bold text-6xl w-full text-center">
                  {event.title}
                </h2>
                <div>{event.description}</div>
                <RsvpEventDate date={event.event_time} />
                {event.type === RSVP_EVENT_TYPE.OPTIONS ? (
                  <OptionResponsesForm
                    personIds={personIds}
                    personIdToPerson={personIdToPerson}
                    event={event}
                    responses={data.responses}
                  />
                ) : (
                  <TextResponsesForm
                    personIds={personIds}
                    personIdToPerson={personIdToPerson}
                    event={event}
                    responses={data.responses}
                  />
                )}
              </div>
            ))}
            <button type="submit" class="text-blue-600 hover:underline text-xl">
              Next
            </button>
          </form>
        </>
      ) : null}
    </MainWrapper>
  );
}
