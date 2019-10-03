import { createAction } from "typesafe-actions";
import { UPDATE_CHAT_REIGON } from "./types";

export const UpdateRegionAction = createAction(
  UPDATE_CHAT_REIGON,
  (action) => (chatId: number, reigon: any) => action({ chatId, reigon })
);
