import React, { useEffect } from "react";
import "./ModuleUpdateRoute.scss";
import { useNavigate, useParams } from "react-router-dom";

import { useModuleSchema, useStores } from "hooks";
import { observer } from "mobx-react-lite";

import { ModuleUpdateRouteParams, ModuleUpdateValues } from "types";
import Header from "components/layout/Header";
import Page from "components/layout/Page";
import Route from "./Route";
import YScrollable from "components/YScrollable";
import Button from "components/Button";
import Form from "components/forms/Form";
import { ModuleEditor } from "components/ModuleEditor";
import { ModuleOutput } from "components/ModuleOutput";


const ModuleUpdateRoute: React.FC = () => {
  const { slug } = useParams<ModuleUpdateRouteParams>();
  const { moduleStore: ms, temporaryModuleStore: tms } = useStores();

  const moduleSchema = useModuleSchema();
  const navigate = useNavigate();

  const handleModuleEvaluate = () => {};

  useEffect(() => {
    if (slug) ms.fetchModule(slug).catch(() => {
      tms.initCurrent({ title: slug });
      navigate('/lib');
    });
  }, [slug, ms]);

  return (
    <Route className="module-update-route">
      {ms.current && <Form<ModuleUpdateValues>
        onSubmit={ms.updateCurrent}
        options={{
          defaultValues: {
            title: ms.current.module.title,
            content: ms.current.module.content
          },
          resolver: moduleSchema
        }}
      >
        {({ handleSubmit }) =>
          <Page
            header={
              <Header
                left={ms.current?.module.title}
                right={
                  <div className="module-update-route-toolbar">
                    <Button className="module-update-route-toolbar-tool" onClick={handleModuleEvaluate}>evaluate</Button>
                    <Button className="module-update-route-toolbar-tool" onClick={handleSubmit(ms.updateCurrent)}>save</Button>
                  </div>
                }
              />
            }
            panes={[
              <ModuleEditor store={ms}/>,
              <YScrollable>
                <ModuleOutput store={ms}/>
              </YScrollable>,
            ]}
          />
        }
      </Form>
    }
    </Route>
  );
};

export default observer(ModuleUpdateRoute);
