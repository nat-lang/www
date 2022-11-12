import React, { useEffect } from "react";
import "./ModuleDetailRoute.scss";
import { useParams } from "react-router-dom";

import { useStores } from "hooks";
import { observer } from "mobx-react-lite";
import { ModuleDetailRouteParams } from "types";

import Header from "components/layout/Header";
import Page from "components/layout/Page";
import Route from "./Route";
import Editor from "components/Editor";
import YScrollable from "components/YScrollable";


const ModuleDetailRoute: React.FC = () => {
  const { moduleSlug } = useParams<ModuleDetailRouteParams>();
  const { moduleStore: ms } = useStores();
  
  useEffect(() => {
    if (moduleSlug) ms.dispatchFetchModule(moduleSlug);
  }, [moduleSlug, ms])

  return (
    <Route className="module-detail-route">
      <Page
        header={<Header left={`${ms.module?.author?.full_name}, ${ms.module?.title}`}/>}
        panes={[
          <div className="module-detail-route-editor">
            {ms.module && ms.uri && <Editor
              content={ms.module.content}
              uri={ms.uri}
            />}
          </div>,
          <YScrollable>
            <div className="module-detail-route-output">
            </div>
          </YScrollable>
        ]}
      />
    </Route>
  );
};

export default observer(ModuleDetailRoute);
