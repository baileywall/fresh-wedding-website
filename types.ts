export type RSVP_RESPONSE = {
  person_id: number;
  rsvp_event: number;
  options_response: number[] | null;
  text_response: string | null;
};

export enum RSVP_EVENT_TYPE {
  OPTIONS = "OPTIONS",
  TEXT = "TEXT",
  MULTI_OPTIONS = "MULTI_OPTIONS",
  OPTIONS_OPTIONAL = "OPTIONS_OPTIONAL",
  TEXT_OPTIONAL = "TEXT_OPTIONAL",
  INFO = "INFO",
}

export type RSVP_EVENT = {
  id: number;
  event_time: Date;
  grouping: EVENT_GROUPS;
  description: string;
  title: string;
  type: RSVP_EVENT_TYPE;
  options: string[];
  order: number;
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
  FIRST = "first",
  SECOND = "second",
  THIRD = "third",
  FOURTH = "fourth",
  FIFTH = "fifth",
  SIXTH = "sixth",
  SEVENTH = "seventh",
  EIGHTH = "eighth",
  NINTH = "ninth",
  TENTH = "tenth",
}
