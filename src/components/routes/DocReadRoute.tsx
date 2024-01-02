import React, { useEffect } from "react";
import "./DocReadRoute.scss";
import { useParams } from "react-router-dom";

import { useStores } from "hooks";
import { observer } from "mobx-react-lite";

import { DocReadRouteParams } from "types";
import Header from "components/layout/Header";
import Page from "components/layout/Page";
import Route from "./Route";
import YScrollable from "components/YScrollable";
import Button from "components/Button";


const DocReadRoute: React.FC = () => {
  const { slug } = useParams<DocReadRouteParams>();
  const { moduleStore: ms } = useStores();

  const handleDocEdit = () => {};

  useEffect(() => {
    if (slug) {
      ms.fetchModule(slug).then(
        () => {
          // ms.setCurrentOutputUri(`${slug}.pdf`);
        }
      )
    }
  }, [slug, ms]);

  return (
    <Route className="doc-read-route">
      <Page
        header={
          <Header
            
            right={
              <div className="doc-read-route-toolbar">
                <Button className="doc-read-route-toolbar-tool" onClick={handleDocEdit}>edit</Button>
              </div>
            }
          />
        }
        panes={[
          <YScrollable>
            
          </YScrollable>,
        ]}
      />
    </Route>
  );
};

export default observer(DocReadRoute);
