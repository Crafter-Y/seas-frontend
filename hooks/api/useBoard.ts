import { requestApi } from "@/helpers/api";
import { Store } from "@/helpers/store";
import { formatDate } from "@/helpers/format";

export default function useBoard() {
  const rows = Store.useState((state) => state.board);

  const { lastQueryFrom, lastQueryTo } = Store.useState((state) => ({
    lastQueryFrom: state.lastQueryFrom,
    lastQueryTo: state.lastQueryTo,
  }));

  const loading = Store.useState((state) => state.boardLoading);

  const requeryBoard = async () => {
    if (lastQueryFrom && lastQueryTo)
      await queryBoard(lastQueryFrom, lastQueryTo);
  };

  const queryBoard = async (fromDate: Date, toDate: Date) => {
    Store.update((state) => {
      state.lastQueryFrom = fromDate;
      state.lastQueryTo = toDate;
      state.boardLoading = true;
    });

    const res = await requestApi(
      `board?from=${formatDate(fromDate)}&to=${formatDate(toDate)}`,
      "GET",
    );

    if (res && res.success) {
      Store.update((state) => {
        state.board = res?.data;
      });
    }

    Store.update((state) => {
      state.boardLoading = false;
    });
  };

  return { rows, queryBoard, requeryBoard, loading };
}
