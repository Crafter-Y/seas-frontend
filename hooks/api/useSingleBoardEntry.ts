import { requestApi } from "@/helpers/api";
import { Store } from "@/helpers/store";

export default function useSingleBoardEntry() {
  const selectedRow = Store.useState(state => state.selectedRow);

  const querySingleRow = async (date: string) => {
    const res = await requestApi(`board/${date}`, "GET");
    if (res && res.success) {
      Store.update(state => { state.selectedRow = res?.data.row; });
    }
  };

  return { selectedRow, querySingleRow };
}
