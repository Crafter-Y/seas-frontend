type ApiResponse = {
  success: boolean;
  error:
  | any
  | {
    message: string;
    description: string;
  };
  data: any;
};

type User = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: Role;
};

type Role = "ADMIN" | "USER" | "MODERATOR";

type APIResponseUser = {
  id: number;
  firstname: string;
  lastname: string;
  deleted: boolean,
};

type APIFullResponseUser = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: Role;
};

type APIResponsePage = {
  id: number;
  name: string;
};

type BoardRow = {
  date: string;
  assignments: BoardAssignment[];
};

type BoardAssignment = {
  id: number;
  type: ColumnType;
  value: string;
};

type ColumnType = "POSITION" | "COMMENT";

type APIResponseColumn = {
  id: number;
  name: string;
  type: ColumnType;
  pages: number[];
};

type APIResponseDefaultComment = {
  id: number;
  comment: string;
};

type APIRecurringEventsResponse = {
  weeklyEvents: {
    id: number,
    day: number
  }[],
  monthlyEvents: {
    id: number,
    day: number
  }[],
  yearlyEvents: {
    id: number,
    day: number,
    month: number
  }[],
};

type EventType = "UNSET" | "SINGLE" | "YEARLY" | "MONTHLY" | "WEEKLY";

type Weekday =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

type Month =
  | "JANUARY"
  | "FEBRUARY"
  | "MARCH"
  | "APRIL"
  | "MAY"
  | "JUNE"
  | "JULI"
  | "AUGUST"
  | "SEPTEMBER"
  | "OCTOBER"
  | "NOVEMBER"
  | "DECEMBER";
