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
import { useForm } from "react-hook-form";


const ModuleUpdateRoute: React.FC = () => {
  const { slug } = useParams<ModuleUpdateRouteParams>();
  const navigate = useNavigate();
  const { moduleStore: ms } = useStores();
  const formCtx = useForm<ModuleUpdateValues>({ resolver: useModuleSchema() });
  const handleModuleEvaluate = () => {};
  const handleFormSubmit = ({ content }: { content: string }) => ms.updateCurrentModule(content);
  const handleNew = () => navigate('/lib');

  useEffect(() => {
    if (!slug) return;

    ms.fetchModule(slug).then(({ title, content }) => {
      formCtx.reset({ title, content });
    })
  }, [slug, ms, navigate, formCtx]);

  return (
    <Route className="module-update-route">
      <Page
        header={
          <Header
            left={ms.current?.title}
            right={
              <div className="module-update-route-toolbar">
                <Button
                  className="module-update-route-toolbar-tool"
                  onClick={handleModuleEvaluate}
                >
                  evaluate
                </Button>
                <Button
                  isLoading={formCtx.formState.isSubmitting}
                  className="module-update-route-toolbar-tool"
                  onClick={formCtx.handleSubmit(handleFormSubmit)}
                >
                  save
                </Button>
                <Button className="module-update-route-toolbar-tool" onClick={handleNew}>
                  new
                </Button>
              </div>
            }
          />
        }
        panes={[
          <Form onSubmit={handleFormSubmit} ctx={formCtx}>
            <ModuleEditor store={ms}/>
          </Form>,
          <YScrollable>
            <ModuleOutput store={ms}/>
          </YScrollable>,
        ]}
      />
    </Route>
  );
};

export default observer(ModuleUpdateRoute);
