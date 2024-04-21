import { Store as Pullstate } from "pullstate";
import { FetchState } from "./Constants";

interface GlobalStore {
  currentPage: number;
  allPages: APIResponsePage[],
  allColumns: APIResponseColumn[]
  selectedRow?: BoardRow,

  board: BoardRow[],
  boardLoading: boolean,

  allExistingUsers: APIResponseUser[],
  user: User | null,
  moduleStatus: APIModuleStatus | null,
  allDefaultComments: APIResponseDefaultComment[],
  lastQueryFrom: Date | null,
  lastQueryTo: Date | null,

  serverName: string | null,
  serverNameState: FetchState,
  serverDevUrl: string,

  printDateStart: Date | null,
  printDateEnd: Date | null,
  printColumns: number[],
}

export const defaultState: GlobalStore = {
  currentPage: 0,
  allPages: [],
  allColumns: [],

  board: [],
  boardLoading: false,

  allExistingUsers: [],
  user: null,
  moduleStatus: null,
  allDefaultComments: [],
  lastQueryFrom: null,
  lastQueryTo: null,

  serverName: null,
  serverNameState: FetchState.UNFETCHED,
  serverDevUrl: "http://api.localhost",

  printDateStart: null,
  printDateEnd: null,
  printColumns: []
};

export const Store = new Pullstate<GlobalStore>(defaultState);