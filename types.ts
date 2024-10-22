export type RSVP = {
  rsvp_group_id: number;
  person_id: number;
  attend_thursday: boolean | null;
  attend_friday: boolean | null;
  attend_saturday: boolean | null;
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
