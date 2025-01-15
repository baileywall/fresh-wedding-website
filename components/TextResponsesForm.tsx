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
      {personIds.map((personId, index) => {
        const person = personIdToPerson.get(personId)!;
        const response = responses.find(
          (response) =>
            response.rsvp_event === event.id && response.id === personId
        );
        return (
          <div key={`text-form-${person.id}`} class="w-full text-xl">
            {index === 0 && <hr class="border-tree-green" />}
            <div class="w-full flex justify-between items-center py-4">
              <div>{`${person.first_name} ${person.last_name}`}</div>
              <input
                type="text"
                id={`${event.id}:${person.id}:TEXT`}
                name={`${event.id}:${person.id}:TEXT`}
                value={response?.text_response ?? ""}
                class="ml-2 p-1 rounded-md border-2 border-tree-green"
              />
            </div>
            <hr class="border-tree-green" />
          </div>
        );
      })}
    </>
  );
}
