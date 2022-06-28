import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store/store";
import FuseMessage from "./FuseMessage/FuseMessage";

const Routers = () => {
  return (
    <div>
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Route path="/" component={App} />
          </Switch>
        </BrowserRouter>
        <FuseMessage />
      </Provider>
    </div>
  );
};

export default Routers;
