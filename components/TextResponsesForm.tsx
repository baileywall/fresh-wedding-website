import { JSX } from "preact";
import type { PERSON, RSVP_EVENT, RSVP_RESPONSE } from "../types.ts";

export function TextResponsesForm(
  props: JSX.HTMLAttributes & {
    personIds: number[];
    personIdToPerson: Map<number, PERSON>;
    event: RSVP_EVENT;
    responses: (PERSON & RSVP_RESPONSE)[];
  }
) {
  const { personIds, personIdToPerson, event, responses } = props;
  return (
    <>
      {personIds.map((personId) => {
        const person = personIdToPerson.get(personId)!;
        const response = responses.find(
          (response) =>
            response.rsvp_event === event.id && response.id === personId
        );
        return (
          <div key={person.id} class="w-56 flex justify-between">
            <div>{`${person.first_name} ${person.last_name}`}</div>
            <input
              type="text"
              id={`${event.id}:${person.id}:TEXT`}
              name={`${event.id}:${person.id}:TEXT`}
              value={response?.text_response ?? ""}
            />
          </div>
        );
      })}
    </>
  );
}
