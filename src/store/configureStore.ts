import { applyMiddleware, createStore } from "redux";
import { createLogger } from "redux-logger";
import createSagaMiddleware from "redux-saga";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

import { environment } from "../config/environment";
import { rootReducer } from "./reducer";
import { rootSaga } from "./saga";

const logger = createLogger({
  predicate: () => environment.isLoggerEnabled
});

const sagaMiddleware = createSagaMiddleware();
const persistConfig = {
  key: 'adasdsa',
   whitelist: ['region'],
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)
export const configureStore :any = (preloadedState = {}) => {
  const store = createStore(
    persistedReducer,
    preloadedState,
    applyMiddleware(logger, sagaMiddleware)
  );
  let persistor = persistStore(store)
  let sagaTask = sagaMiddleware.run(rootSaga);

  if ((module as any).hot) {
    (module as any).hot.accept("./reducer", () => {
      const nextRootReducer = require("./reducer");
      store.replaceReducer(nextRootReducer);
    });

    (module as any).hot.accept("./saga", () => {
      const nextRootSaga = require("./saga");

      sagaTask.cancel();

      sagaTask.done.then(() => {
        sagaTask = sagaMiddleware.run(nextRootSaga);
      });
    });
  }

  return { store, persistor }
};
