type ApiResponse = {
  success: boolean;
  error: any | {
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

type Role = "ADMIN" | "USER";

type APIResponseUser = {
  id: number;
  firstname: string;
  lastname: string;
  deleted: boolean,
};

type APICreationReponse = {
  firstname: string;
  lastname: string;
  email: string;
  role: Role;
  password: string;
};

type AccountState = "UNVERIFIED" | "VERIFICATION_PENDING" | "VERIFIED" // potentially also DELETED, but these users will never be send by the backend

type APIFullResponseUser = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: Role;
  state: AccountState
};

type APIResponsePage = {
  id: number;
  name: string;
};

type BoardRow = {
  comments: BoardComment[];
  assignments: BoardAssignment[];
  date: string;
};

type BoardAssignment = {
  id: number;
  userId: number;
  boardColumnId: number;
};

type BoardComment = {
  id: number;
  boardColumnId: number;
  text: string;
}

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

type APIModuleStatus = {
  moduleCalendar: boolean
  modulePrint: boolean
}

type Module = "print" | "calendar"

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
