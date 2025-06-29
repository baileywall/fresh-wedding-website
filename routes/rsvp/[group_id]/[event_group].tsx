import type { Handlers, PageProps } from "$fresh/server.ts";
import { MainWrapper } from "../../../components/MainWrapper.tsx";
import { OptionResponsesForm } from "../../../components/OptionResponsesForm.tsx";
import { PageHeader } from "../../../components/PageHeader.tsx";
import { PageImage } from "../../../components/PageImage.tsx";
import { RsvpEventDate } from "../../../components/RsvpEventDate.tsx";
import { RsvpEventTime } from "../../../components/RsvpEventTime.tsx";
import { TextResponsesForm } from "../../../components/TextResponsesForm.tsx";
import { connection } from "../../../db.ts";
import { getRsvpEventsForRsvpGroup } from "../../../queries/getRsvpEventsForRsvpGroup.ts";
import { getRsvpsForGroup } from "../../../queries/getRsvpsForGroup.ts";
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

const EVENT_GROUP_ROUTE_ADVANCER = new Map<string, string>([
  [EVENT_GROUPS.FIRST, `/${EVENT_GROUPS.SECOND}`],
  [EVENT_GROUPS.SECOND, `/${EVENT_GROUPS.THIRD}`],
  [EVENT_GROUPS.THIRD, `/${EVENT_GROUPS.FOURTH}`],
  [EVENT_GROUPS.FOURTH, `/${EVENT_GROUPS.FIFTH}`],
  [EVENT_GROUPS.FIFTH, ""],
]);

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

      if (EVENT_GROUP_ROUTE_ADVANCER.has(_ctx.params.event_group)) {
        const headers = new Headers();
        headers.set(
          "location",
          `/rsvp/${_ctx.params.group_id}${EVENT_GROUP_ROUTE_ADVANCER.get(
            _ctx.params.event_group
          )}`
        );
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
      const { rows: rsvpEventRows } = await getRsvpEventsForRsvpGroup(
        groupId,
        `rsvp_event.grouping = '${_ctx.params.event_group}'`
      );

      if (rsvpEventRows.length === 0) {
        const headers = new Headers();
        headers.set(
          "location",
          `/rsvp/${_ctx.params.group_id}${EVENT_GROUP_ROUTE_ADVANCER.get(
            _ctx.params.event_group
          )}`
        );
        return new Response(null, {
          status: 303,
          headers,
        });
      }

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
      <PageImage src="/beverages.png" />
      <div class="w-full md:w-3/4 bg-eggplant-light rounded-sm shadow-inner">
        <span
          class={`block bg-eggplant h-2 rounded-sm ${
            params.event_group === EVENT_GROUPS.FIRST
              ? "w-1/6"
              : params.event_group === EVENT_GROUPS.SECOND
              ? "w-2/6"
              : params.event_group === EVENT_GROUPS.THIRD
              ? "w-3/6"
              : params.event_group === EVENT_GROUPS.FOURTH
              ? "w-4/6"
              : "w-5/6"
          }`}
        />
      </div>
      {data.responses ? (
        <form
          method="post"
          action={`/rsvp/${params.group_id}/${params.event_group}`}
          class="w-full md:w-3/4"
        >
          <RsvpEventDate date={data.events[0].event_time} class="text-4xl" />
          {data.events.map((event) => (
            <div key={event.id} class="flex flex-col py-4 items-center w-full">
              <p class="font-script font-bold text-5xl">{event.title}</p>
              <p class="text-2xl">{event.description}</p>
              <RsvpEventTime date={event.event_time} class="text-2xl" />
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
      ) : null}
    </MainWrapper>
  );
}
