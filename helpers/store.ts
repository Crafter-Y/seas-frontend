import { Store as Pullstate } from "pullstate";

interface GlobalStore {
  currentPage: number;
  allPages: APIResponsePage[],
  allColumns: APIResponseColumn[]
  selectedRow?: BoardRow,
  board: BoardRow[],
  allExistingUsers: APIResponseUser[],
  user: User | null,
  moduleStatus: APIModuleStatus | null,
  allDefaultComments: APIResponseDefaultComment[],
  lastQueryFrom: Date | null,
  lastQueryTo: Date | null
}

export const Store = new Pullstate<GlobalStore>({
  currentPage: 0,
  allPages: [],
  allColumns: [],
  board: [],
  allExistingUsers: [],
  user: null,
  moduleStatus: null,
  allDefaultComments: [],
  lastQueryFrom: null,
  lastQueryTo: null
});