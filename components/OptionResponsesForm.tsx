import { JSX } from "preact";
import type { PERSON, RSVP_EVENT, RSVP_RESPONSE } from "../types.ts";

export function OptionResponsesForm(
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
          <div key={`options-form-${person.id}`} class="w-full text-xl">
            {index === 0 && <hr class="border-tree-green" />}
            <div class="w-full flex justify-between items-center py-4">
              <div>{`${person.first_name} ${person.last_name}`}</div>
              <div class="flex-grow" />
              <div class="flex flex-col">
                {event.options.map((option, index) => (
                  <div class="self-start">
                    <input
                      type="radio"
                      id={`${event.id}:${person.id}:OPTIONS:${index}`}
                      name={`${event.id}:${person.id}:OPTIONS`}
                      value={index}
                      checked={index === response?.options_response}
                      required
                    />
                    <label
                      for={`${event.id}:${person.id}:OPTIONS:${index}`}
                      class="mx-2"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <hr class="border-tree-green" />
          </div>
        );
      })}
    </>
  );
}
