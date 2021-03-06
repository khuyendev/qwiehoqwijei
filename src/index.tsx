import React, { ComponentClass } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import { App } from "./App";
import {
  ConnectedIntlProvider,
  TextComponent
} from "./components/common/connected-intl-provider/ConnectedIntlProvider";
import * as serviceWorker from "./serviceWorker";
import { configureStore } from "./store/configureStore";
import { enableTabMode } from "./utils/enableTabMode";
import { PersistGate } from "redux-persist/integration/react";

const rootElement = document.getElementById("root");
const AppStore = configureStore();

const render = (Component: ComponentClass) => {
  ReactDOM.render(
    <Provider store={AppStore.store}>
      <PersistGate loading={null} persistor={AppStore.persistor}>
      <ConnectedIntlProvider textComponent={TextComponent}>
        <HashRouter>
          <Component />
        </HashRouter>
      </ConnectedIntlProvider>
      </PersistGate>
    </Provider>,
    rootElement
  );
};

render(App);

if ((module as any).hot) {
  (module as any).hot.accept("./App", () => {
    const NextApp = require("./App").App;

    render(NextApp);
  });
}

enableTabMode();
serviceWorker.register();
