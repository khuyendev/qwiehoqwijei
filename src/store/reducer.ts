import { combineReducers } from "redux";
import { StateType } from "typesafe-actions";
import { appReducer } from "./app/reducer";
import { authReducer } from "./auth/reducer";
import { chatsReducer } from "./chats/reducer";
import { telegramReducer } from "./telegram/reducer";
import { regionReducer } from "./region/reducer";

export const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  telegram: telegramReducer,
  chats: chatsReducer,
  region: regionReducer
});

export type RootState = StateType<typeof rootReducer>;
