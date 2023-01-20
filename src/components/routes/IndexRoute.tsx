import React from "react";
import "./IndexRoute.scss";
import { useParams } from "react-router-dom";

import { useStores } from "hooks";
import { observer } from "mobx-react-lite";
import { IndexRouteParams } from "types";

import Header from "components/layout/Header";

import Page from "components/layout/Page";
import Route from "./Route";

const IndexRoute: React.FC = () => {
  const params = useParams<IndexRouteParams>();
  const { moduleStore: fs } = useStores();
  
  return (
    <Route className="index-route">
      <Page
        header={<Header left={"Natlang Online"}/>}
        panes={[
        ]}
      />
    </Route>
  );
};

export default observer(IndexRoute);
