import React, { useEffect } from "react";
import "./ModuleCreateRoute.scss";
import { useNavigate } from "react-router-dom";
import { useModuleSchema, useStores } from "hooks";
import { observer } from "mobx-react-lite";

import { ModuleCreateValues } from "types";
import Header from "components/layout/Header";
import Page from "components/layout/Page";
import Route from "./Route";
import YScrollable from "components/YScrollable";
import Form from "components/forms/Form";
import Field from "components/forms/Field";
import Button from "components/Button";
import ModuleEditor from "components/ModuleEditor";
import ModuleOutput from "components/ModuleOutput";
import { useForm } from "react-hook-form";

const ModuleCreateRoute: React.FC = () => {
  const navigate = useNavigate();
  const { moduleStore: ms, temporaryModuleStore: tms } = useStores();
  const formCtx = useForm<ModuleCreateValues>({ resolver: useModuleSchema() });

  const handleFormSubmit = async (values: ModuleCreateValues) => {
    const oldRec = tms.setCurrentRecModule(values),
          newRec = await ms.createModule(oldRec);

    navigate(newRec.module.slug);
  };

  useEffect(() => {
    const { module } = tms.initCurrent();
    formCtx.reset(module);
  }, [tms, formCtx]);

  return (
    <Route className="module-create-route">
      <Form onSubmit={handleFormSubmit} ctx={formCtx}>
        <Page
          header={
            <Header
              left={<Field autoFocus name="title"/>}
              right={
                tms.current && <Button onClick={formCtx.handleSubmit(handleFormSubmit)}>
                save
                </Button>
              }
            />
          }
          panes={[
            <ModuleEditor store={tms}/>,
            <YScrollable>
              <ModuleOutput store={tms}/>
            </YScrollable>,
          ]}
        />
      </Form>
    </Route>
  );
};

export default observer(ModuleCreateRoute);
