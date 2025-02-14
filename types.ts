export type RSVP_RESPONSE = {
  person_id: number;
  rsvp_event: number;
  options_response: number | null;
  text_response: string | null;
};

export enum RSVP_EVENT_TYPE {
  OPTIONS = "OPTIONS",
  TEXT = "TEXT",
}

export type RSVP_EVENT = {
  id: number;
  event_time: Date;
  description: string;
  title: string;
  type: RSVP_EVENT_TYPE;
  options: string[];
};

export type RSVP_GROUP = {
  id: number;
  description: string;
};

export type PERSON = {
  first_name: string;
  last_name: string;
  email: string;
  id: number;
  type_id: number;
  side: string;
};

export enum EVENT_GROUPS {
  THURSDAY = "thursday",
  FRIDAY = "friday",
  SATURDAY = "saturday",
  SUNDAY = "sunday",
}
