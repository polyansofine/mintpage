import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import App from "./App";
const Routers = () => {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route path="/" component={App} />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default Routers;
