import type { Handlers, PageProps } from "$fresh/server.ts";
import { MainWrapper } from "../../../components/MainWrapper.tsx";
import { OptionResponses } from "../../../components/OptionResponses.tsx";
import { PageHeader } from "../../../components/PageHeader.tsx";
import { PageImage } from "../../../components/PageImage.tsx";
import { RsvpEventDate } from "../../../components/RsvpEventDate.tsx";
import { RsvpEventTime } from "../../../components/RsvpEventTime.tsx";
import { TextResponses } from "../../../components/TextResponses.tsx";
import { connection } from "../../../db.ts";
import { getRsvpEventsForRsvpGroup } from "../../../queries/getRsvpEventsForRsvpGroup.ts";
import { getRsvpsForGroup } from "../../../queries/getRsvpsForGroup.ts";
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

const CARD_BACKGROUNDS = ["bg-cadet", "bg-mountbatten-pink", "bg-tawny"];

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
      const { rows: rsvpEventRows } = await getRsvpEventsForRsvpGroup(groupId);

      if (rsvpRows.find((rsvp) => rsvp.rsvp_event === null)) {
        const headers = new Headers();
        headers.set(
          "location",
          `/rsvp/${_ctx.params.group_id}/${EVENT_GROUPS.FIRST}`
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

  const orderedRsvpEvents = [
    EVENT_GROUPS.FIRST,
    EVENT_GROUPS.SECOND,
    EVENT_GROUPS.THIRD,
    EVENT_GROUPS.FOURTH,
    EVENT_GROUPS.FIFTH,
    EVENT_GROUPS.SIXTH,
    EVENT_GROUPS.SEVENTH,
    EVENT_GROUPS.EIGHTH,
    EVENT_GROUPS.NINTH,
    EVENT_GROUPS.TENTH,
  ];
  const groupedRsvpEventRows: RSVP_EVENT[][] = [];
  data.events.forEach((row) => {
    while (
      groupedRsvpEventRows.length - 1 <
      orderedRsvpEvents.indexOf(row.grouping)
    ) {
      groupedRsvpEventRows.push([]);
    }
    groupedRsvpEventRows[orderedRsvpEvents.indexOf(row.grouping)].push(row);
  });

  return (
    <MainWrapper>
      <PageHeader>RSVP</PageHeader>
      <PageImage src="/beverages.png" />
      <div>
        <h2>Thank you for your RSVP!</h2>
        <p class="text-xl">Your response is below</p>
      </div>
      <div class="flex flex-col mt-8 gap-8 w-full md:w-3/4">
        {groupedRsvpEventRows.map(
          (groupedRsvpEvent, index) =>
            groupedRsvpEvent.length > 0 && (
              <div
                key={`grouped-rsvp-event-${index}`}
                //class={`${CARD_BACKGROUNDS[index % 3]} p-8 rounded-lg`}
                class={`bg-eggplant-light p-8 rounded-lg`}
              >
                <RsvpEventDate
                  date={groupedRsvpEvent[0].event_time}
                  class="text-4xl"
                />
                {groupedRsvpEvent.map((event) => (
                  <div key={event.id} class="flex flex-col py-4 items-center">
                    <p class="font-script font-bold text-5xl">{event.title}</p>
                    <p class="text-2xl">{event.description}</p>
                    <RsvpEventTime date={event.event_time} class="text-2xl" />
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
            )
        )}
      </div>
      <a
        href={`/rsvp/${params.group_id}/${EVENT_GROUPS.FIRST}`}
        class="text-blue-600 hover:underline text-xl text-center block"
      >
        Edit RSVP
      </a>
    </MainWrapper>
  );
}
