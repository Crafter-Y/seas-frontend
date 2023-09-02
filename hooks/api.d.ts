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
  userId: number;
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
  pageId: string;
  name: string;
};

type BoardRow = {
  date: string;
  assignments: BoardAssignment[];
};

type BoardAssignment = {
  columnId: string;
  type: ColumnType;
  value: string;
};

type ColumnType = "POSITION" | "COMMENT";

type APIResponseColumn = {
  columnId: string;
  name: string;
  type: ColumnType;
  pages: string[];
};

type APIResponseDefaultComment = {
  commentId: string;
  comment: string;
};

type APIResponseRecurringEvent = {
  taskId: string;
  eventType: "SINGLE" | "YEARLY" | "MONTHLY" | "WEEKLY";
  eventMonth: string;
  dayOfMonth: string;
  dayOfWeek: string;
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
