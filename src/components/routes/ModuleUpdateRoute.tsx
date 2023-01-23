import React, { useEffect } from "react";
import "./ModuleUpdateRoute.scss";
import { useNavigate, useParams } from "react-router-dom";

import { useModuleSchema, useStores } from "hooks";
import { observer } from "mobx-react-lite";

import { ModuleUpdateRouteParams, ModuleUpdateValues } from "types";
import Header from "components/layout/Header";
import Page from "components/layout/Page";
import Route from "./Route";
import Button from "components/Button";
import Form from "components/forms/Form";
import ModuleEditor from "components/ModuleEditor";
import YScrollable from "components/YScrollable";
import ModuleOutput from "components/ModuleOutput";


const ModuleUpdateRoute: React.FC = () => {
  const { slug } = useParams<ModuleUpdateRouteParams>();
  const { moduleStore: ms, temporaryModuleStore: tms } = useStores();

  const moduleSchema = useModuleSchema();
  const navigate = useNavigate();

  const handleModuleEvaluate = () => {};
  const handleFormSubmit = (v: ModuleUpdateValues) => ms.updateCurrent(v);

  useEffect(() => {
    if (slug) ms.fetchModule(slug).catch(() => {
      tms.initCurrent({ title: slug });
      navigate('/lib');
    });
  }, [slug, ms]);

  console.log('current -> ', JSON.stringify(ms.current?.module));

  return (
    <Route className="module-update-route">
      {ms.current && <Form<ModuleUpdateValues>
        onSubmit={handleFormSubmit}
        options={{
          defaultValues: {
            title: ms.current.module.title,
            content:  ms.current.module.content
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
                    <Button className="module-update-route-toolbar-tool" onClick={handleSubmit(handleFormSubmit)}>save</Button>
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
