import React, { useEffect } from "react";
import "./ModuleDetailRoute.scss";
import { useParams } from "react-router-dom";

import { useStores } from "hooks";
import { observer } from "mobx-react-lite";
import * as yup from "yup";

import { ModuleDetailRouteParams, ModuleUpdateValues } from "types";
import Header from "components/layout/Header";
import Page from "components/layout/Page";
import Route from "./Route";
import YScrollable from "components/YScrollable";
import EditorField from "components/forms/EditorField";
import Button from "components/Button";
import { debounce } from "lodash";
import Form from "components/forms/Form";
import useYupResolver from "hooks/useYupResolver";


const ModuleDetailRoute: React.FC = () => {
  const { slug } = useParams<ModuleDetailRouteParams>();
  const { moduleStore: ms } = useStores();
  
  const handleFormSubmit = (values: ModuleUpdateValues) => ms.updateModule(values);

  const handleEditorChange = debounce((content: string) => ms.updateModuleFile({ content }), 200);

  const resolver = useYupResolver({
    title: yup.string().min(1).required("name required"),
  });

  useEffect(() => {
    if (slug) ms.fetchModule(slug);
  }, [slug, ms]);

  return (
    <Route className="module-detail-route">
      {ms.module && <Form<ModuleUpdateValues>
        onSubmit={ms.updateModule}
        options={{
          defaultValues: {
            title: ms.module.title,
            content: ms.module.content
          },
          resolver
        }}
      >
        {({ handleSubmit }) =>
          <Page
            header={
              <Header
                left={ms.module?.title}
                right={<Button onClick={handleSubmit(handleFormSubmit)}>save</Button>}
              />
            }
            panes={[
              ms.module && ms.uri && <div className="module-detail-route-editor">
                <EditorField
                  name="content"
                  content={ms.module.content}
                  uri={ms.uri}
                  onChange={handleEditorChange}
                />
              </div>,
              <YScrollable>
                <div className="module-detail-route-output">
                </div>
              </YScrollable>
            ]}
          />
        }
      </Form>
    }
    </Route>
  );
};

export default observer(ModuleDetailRoute);
