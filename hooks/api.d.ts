type ApiResponse = {
  success: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
};

type ChildType = React.ReactNode | React.ReactNode[];

// https://stackoverflow.com/questions/41253310/typescript-retrieve-element-type-information-from-array-type
type ArrayElement<A> = A extends readonly (infer T)[] ? T : never

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
  moderatorUserId: number | null;
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
  moduleMusic: boolean
}

type APIRestrictions = {
  maxAdmins: number
  maxUsers: number
  maxColumns: number
  maxPages: number
  maxOwnSongbooks: number
  columnsChangable: boolean
  columnsDeletable: boolean
  pagesChangable: boolean
  pagesDeletable: boolean
  modulesManagable: boolean
}

type APIResponseSong = {
  id: number;
  title: string;
  number: number;
  book: {
    id: number;
    name: string;
  }
};

type APISongbookResponse = {
  id: number;
  name: string;
  knownSongs: number;
  count: number;
};

type APIResponseSongbookSong = {
  id: number;
  title: string;
  number: number;
  known: boolean;
  locked: boolean;
}

type APIResponseHistoryEntry = {
  date: Date;
  rating: number;
  comment: string | null;
  song: {
    number: number;
    title: string;
    book: {
      name: string;
    };
  };
}

type APIResponseHistoryRatingEntry = {
  title: string;
  number: number;
  book: string;
  rating: number;
}

type APIResponseHistoryCountEntry = {
  title: string;
  number: number;
  book: string;
  count: number;
}

type Module = "print" | "calendar" | "music"

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
