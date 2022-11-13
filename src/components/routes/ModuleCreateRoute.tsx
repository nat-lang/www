import React from "react";
import "./ModuleCreateRoute.scss";
import { useNavigate } from "react-router-dom";

import { useStores } from "hooks";
import { observer } from "mobx-react-lite";
import * as yup from "yup";

import { ModuleCreateValues } from "types";
import Header from "components/layout/Header";
import Page from "components/layout/Page";
import Route from "./Route";
import YScrollable from "components/YScrollable";
import Form from "components/forms/Form";
import Field from "components/forms/Field";
import Button from "components/Button";
import EditorField from "components/forms/EditorField";
import useYupResolver from "hooks/useYupResolver";
import { debounce } from "lodash";


const ModuleCreateRoute: React.FC = () => {
  const navigate = useNavigate();
  const { moduleStore: ms, temporaryModuleStore: tms } = useStores();

  const handleFormSubmit = async (values: ModuleCreateValues) => {
    const module = await ms.createModule(values);
    navigate(module.slug);
  };

  const handleEditorChange = debounce((content: string) => tms.updateModule({ content }), 200);

  return (
    <Route className="module-create-route">
      <Form<ModuleCreateValues>
        onSubmit={ms.createModule}
        options={{
          defaultValues: {
            title: "",
            content: ""
          },
          resolver: useYupResolver({
            title: yup.string().min(1).required("name required"),
          }),
        }}
      >
        {({ handleSubmit }) => <>
          <Page
            header={
              <Header
                left={<Field autoFocus name="title"/>}
                right={
                  <Button onClick={handleSubmit(handleFormSubmit)}>
                  save
                  </Button>
                }
              />
            }
            panes={[
              <div className="module-create-route-editor">
                <EditorField
                  name="content"
                  content={tms.module.content}
                  uri={tms.uri}
                  onChange={handleEditorChange}
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
