import { Store as Pullstate } from "pullstate";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";

import { Rating } from "@/components/elements/Ratings";
import { MusicEntryType } from "@/components/modules/music/MusicEntryTypeModal";
import { FetchState } from "@/helpers/Constants";

export type RatedSong = APIResponseSong & { rating: Rating; comment?: string };

interface GlobalStore {
  currentPage: number;
  allPages: APIResponsePage[];
  allColumns: APIResponseColumn[];
  selectedRow?: BoardRow;

  board: BoardRow[];
  boardLoading: boolean;

  allExistingUsers: APIResponseUser[];
  user: User | null;
  moduleStatus: APIModuleStatus | null;
  allDefaultComments: APIResponseDefaultComment[];
  lastQueryFrom: Date | null;
  lastQueryTo: Date | null;

  serverName: string | null;
  serverNameState: FetchState;

  printDateStart: Date | null;
  printDateEnd: Date | null;
  printColumns: number[];

  musicEntryType?: MusicEntryType;
  musicDate?: CalendarDate;
  musicSongSelected?: APIResponseSong;
  musicRatings: RatedSong[];

  restrictions?: APIRestrictions;
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

  printDateStart: null,
  printDateEnd: null,
  printColumns: [],

  musicRatings: [],
};

export const Store = new Pullstate<GlobalStore>(defaultState);
