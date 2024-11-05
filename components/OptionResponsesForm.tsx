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
      {personIds.map((personId) => {
        const person = personIdToPerson.get(personId)!;
        const response = responses.find(
          (response) =>
            response.rsvp_event === event.id && response.id === personId
        );
        return (
          <div key={person.id} class="w-56 flex justify-between">
            <div>{`${person.first_name} ${person.last_name}`}</div>
            {event.options.map((option, index) => (
              <>
                <label for={`${event.id}:${person.id}:OPTIONS`}>{option}</label>
                <input
                  type="radio"
                  id={`${event.id}:${person.id}:OPTIONS`}
                  name={`${event.id}:${person.id}:OPTIONS`}
                  value={index}
                  checked={index === response?.options_response}
                />
              </>
            ))}
          </div>
        );
      })}
    </>
  );
}
