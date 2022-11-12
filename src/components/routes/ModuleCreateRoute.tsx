import React, { useEffect } from "react";
import "./ModuleCreateRoute.scss";
import { useParams } from "react-router-dom";

import { useStores } from "hooks";
import { observer } from "mobx-react-lite";
import { ModuleCreateRouteParams, ModuleCreateValues } from "types";

import Header from "components/layout/Header";
import Page from "components/layout/Page";
import Route from "./Route";
import Editor from "components/Editor";
import YScrollable from "components/YScrollable";
import Form from "components/forms/Form";
import Field from "components/forms/Field";
import Button from "components/Button";


const ModuleCreateRoute: React.FC = () => {
  const params = useParams<ModuleCreateRouteParams>();
  const { moduleStore: ms, temporaryModuleStore: tms } = useStores();

  const onSaveBtnClick = () => {};
  
  return (
    <Route className="module-create-route">
      <Form<ModuleCreateValues>
        onSubmit={ms.dispatchCreateModule}
        options={{
          defaultValues: {
            title: "",
            content: ""
          }
        }}
      >
        {() => <>
          <Page
            header={
              <Header
                left={<Field autoFocus name="title"/>}
                right={<Button onClick={onSaveBtnClick}>save</Button>}
              />
            }
            panes={[
              <div className="module-create-route-editor">
                <Editor
                  content={tms.module.content}
                  uri={tms.uri}
                />
              </div>,
              <YScrollable>
                <div className="module-create-route-output">

                </div>
              </YScrollable>
            ]}
          />
          </>
        }
      </Form>
    </Route>
  );
};

export default observer(ModuleCreateRoute);
