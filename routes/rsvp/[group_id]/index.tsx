import type { Handlers, PageProps } from "$fresh/server.ts";
import { MainWrapper } from "../../../components/MainWrapper.tsx";
import { OptionResponses } from "../../../components/OptionResponses.tsx";
import { PageHeader } from "../../../components/PageHeader.tsx";
import { PageImage } from "../../../components/PageImage.tsx";
import { RsvpEventDate } from "../../../components/RsvpEventDate.tsx";
import { TextResponses } from "../../../components/TextResponses.tsx";
import { connection } from "../../../db.ts";
import {
  type PERSON,
  type RSVP_RESPONSE,
  type RSVP_EVENT,
  EVENT_GROUPS,
  RSVP_EVENT_TYPE,
} from "../../../types.ts";
import { ELEMENT_TO_NUMBER } from "../../../util.ts";

interface Data {
  responses: (PERSON & RSVP_RESPONSE)[];
  events: RSVP_EVENT[];
}

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

const getRsvpEvents = async (): Promise<{ rows: RSVP_EVENT[] }> => {
  const { rows } = await connection.queryObject<RSVP_EVENT>(`
  SELECT * FROM rsvp_event ORDER BY event_time;
  `);
  return { rows };
};

export const handler: Handlers<Data> = {
  async GET(_, _ctx) {
    try {
      const groupId = ELEMENT_TO_NUMBER.get(_ctx.params.group_id);
      if (!groupId) {
        return _ctx.render({
          responses: [],
          events: [],
        });
      }

      const { rows: rsvpRows } = await getRsvpsForGroup(groupId);
      const { rows: rsvpEventRows } = await getRsvpEvents();

      if (rsvpRows.find((rsvp) => rsvp.rsvp_event === null)) {
        const headers = new Headers();
        headers.set(
          "location",
          `/rsvp/${_ctx.params.group_id}/${EVENT_GROUPS.THURSDAY}`
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

export default function RsvpGroup({ data, params }: PageProps<Data>) {
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
      <div>
        <h2>Thank you for your RSVP!</h2>
        <p class="text-xl">Your response is below</p>
      </div>
      <div class="flex flex-col mt-8 gap-8 w-full">
        {data.events.map((event) => (
          <div key={event.id} class="flex flex-col py-4 items-center">
            <h2 class="font-script font-bold text-6xl">{event.title}</h2>
            <div>{event.description}</div>
            <RsvpEventDate date={event.event_time} />
            {event.type === RSVP_EVENT_TYPE.OPTIONS ? (
              <OptionResponses
                personIds={personIds}
                personIdToPerson={personIdToPerson}
                event={event}
                responses={data.responses}
              />
            ) : (
              <TextResponses
                personIds={personIds}
                personIdToPerson={personIdToPerson}
                event={event}
                responses={data.responses}
              />
            )}
          </div>
        ))}
      </div>
      <a
        href={`/rsvp/${params.group_id}/${EVENT_GROUPS.THURSDAY}`}
        class="text-blue-600 hover:underline text-xl text-center block"
      >
        Edit RSVP
      </a>
    </MainWrapper>
  );
}
