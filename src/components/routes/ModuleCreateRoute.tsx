import React, { useEffect } from "react";
import "./ModuleCreateRoute.scss";
import { useNavigate } from "react-router-dom";

import { useModuleSchema, useStores } from "hooks";
import { observer } from "mobx-react-lite";

import { ModuleCreateValues, UUID } from "types";
import Header from "components/layout/Header";
import Page from "components/layout/Page";
import Route from "./Route";
import YScrollable from "components/YScrollable";
import Form from "components/forms/Form";
import Field from "components/forms/Field";
import Button from "components/Button";
import EditorField from "components/forms/EditorField";
import { debounce } from "lodash";

const ModuleCreateRoute: React.FC = () => {
  const navigate = useNavigate();
  const { moduleStore: ms, temporaryModuleStore: tms } = useStores();
  const moduleSchema = useModuleSchema();

  const handleFormSubmit = (id: UUID) => async (values: ModuleCreateValues) => {
    const module = await ms.createModule({ temp_id: id, ...values});
    navigate(module.slug);
  };

  const handleEditorChange = debounce(
    (content: string) => tms.uri && tms.updateModule({ content }),
    200
  );

  useEffect(() => {
    tms.initModule();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Route className="module-create-route">
      {tms.module && tms.uri && <Form<ModuleCreateValues>
        onSubmit={handleFormSubmit(tms.module.temp_id)}
        options={{
          defaultValues: {
            title: "",
            content: ""
          },
          resolver: moduleSchema
        }}
      >
        {({ handleSubmit }) => <>
          <Page
            header={
              <Header
                left={<Field autoFocus name="title"/>}
                right={
                  tms.module && tms.uri &&
                    <Button onClick={handleSubmit(handleFormSubmit(tms.module.temp_id))}>
                    save
                    </Button>
                }
              />
            }
            panes={[
              tms.module && tms.uri &&
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
      </Form>}
    </Route>
  );
};

export default observer(ModuleCreateRoute);
