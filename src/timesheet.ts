import { TimeSpan } from "./time-span";

type Timesheet = {
  createdAt?: Date;
  entries: Entry[];
};

type Entry = {
  date: Date;
  timeSpan: TimeSpan;
  comment?: string;
};
