import React from "react";
import "./IndexRoute.scss";

import { observer } from "mobx-react-lite";

import Header from "components/layout/Header";

import Page from "components/layout/Page";
import Route from "./Route";

const IndexRoute: React.FC = () => {
  return (
    <Route className="index-route">
      <Page
        header={<Header left={"NatLang Online"}/>}
        panes={[
        ]}
      />
    </Route>
  );
};

export default observer(IndexRoute);
