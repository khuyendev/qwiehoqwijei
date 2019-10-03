import { createSelector } from "reselect";
import { RootState } from "../reducer";

const chatsSelector = (state: any) => state.reigon;

export const chatSelector = (chatId: number) => {
  return createSelector(
    chatsSelector,
    ({ reigon }) => {
      return reigon.map(id =>
        reigon[id]
      );
    }
  );
};
