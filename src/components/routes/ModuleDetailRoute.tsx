import React, { useEffect } from "react";
import "./ModuleDetailRoute.scss";
import { useParams } from "react-router-dom";

import { useModuleSchema, useStores } from "hooks";
import { observer } from "mobx-react-lite";
import { Document as PDF, Page as PDFPage } from 'react-pdf/dist/esm/entry.webpack5';

import { ModuleDetailRouteParams, ModuleUpdateValues } from "types";
import Header from "components/layout/Header";
import Page from "components/layout/Page";
import Route from "./Route";
import YScrollable from "components/YScrollable";
import EditorField from "components/forms/EditorField";
import Button from "components/Button";
import { debounce } from "lodash";
import Form from "components/forms/Form";
import { ShowDocumentRequest } from "monaco-languageclient";


const ModuleDetailRoute: React.FC = () => {
  const { slug } = useParams<ModuleDetailRouteParams>();
  const { moduleStore: ms } = useStores();
  const moduleSchema = useModuleSchema();

  const handleEditorChange = debounce((content: string) => ms.updateModuleFile({ content }), 200);
  const handleModuleEvaluate = () => {};

  useEffect(() => {
    if (slug) ms.fetchModule(slug);
  }, [slug, ms]);

  console.log('rendering...');
  return (
    <Route className="module-detail-route">
      {ms.module && <Form<ModuleUpdateValues>
        onSubmit={ms.updateModule}
        options={{
          defaultValues: {
            title: ms.module.title,
            content: ms.module.content
          },
          resolver: moduleSchema
        }}
      >
        {({ handleSubmit }) =>
          <Page
            header={
              <Header
                left={ms.module?.title}
                right={
                  <div className="module-detail-route-toolbar">
                    <Button className="module-detail-route-toolbar-tool" onClick={handleModuleEvaluate}>evaluate</Button>
                    <Button className="module-detail-route-toolbar-tool" onClick={handleSubmit(ms.updateModule)}>save</Button>
                  </div>
                }
              />
            }
            panes={[
              ms.module && ms.uri && <div className="module-detail-route-editor">
                <EditorField
                  name="content"
                  content={ms.module.content}
                  uri={ms.uri}
                  onChange={handleEditorChange}
                  onLangClientRegister={(client) => {
                    client.onRequest(ShowDocumentRequest.method, ({ uri }) => {
                      const bits = uri.split("/"),
                            base = bits[bits.length - 1]
                      ms.setOutputUri(base);
                      return { success: true };
                    });                
                  }}
                />
              </div>,
              <YScrollable>
                <div className="module-detail-route-output">
                  <PDF file={ms.outputUri} onLoadError={(err) => console.log('ERR! ', err)} onSourceError={(err) => console.log('ERR! ', err)}>
                    <PDFPage pageNumber={1} />
                  </PDF>
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
