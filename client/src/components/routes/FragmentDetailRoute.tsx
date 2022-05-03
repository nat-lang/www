import React, { useEffect, useState } from "react";
import "./FragmentDetailRoute.scss";
import { useParams } from "react-router-dom";
import MonacoEditor, { monaco } from "react-monaco-editor";
import { useStores } from "hooks";
import { observer } from "mobx-react-lite";
import { FragmentDetailRouteParams, ID } from "types";
import { registerMonaco } from "utils/monaco";
import Header from "components/Header";
import Example, { ExampleRef } from "components/Example";
import PlusIcon from "components/icons/PlusIcon";
import Button from "components/Button";
import TemporaryExample from "components/TemporaryExample";
import Page from "components/Page";
import Route from "./Route";

const FragmentDetailRoute: React.FC = () => {
  const { fragmentSlug } = useParams<FragmentDetailRouteParams>();
  const { fragmentStore: fs } = useStores();

  const uri = `file:///app/fragments/`;

  const options = {
    model: monaco.editor.getModel(monaco.Uri.parse(uri)) ||
      monaco.editor.createModel("-- write your fragment here...", "haskell", monaco.Uri.parse(uri)),
    minimap: {
      enabled: false
    }
  };
  
  const handleNewExample = fs.createTemporaryExample;

  useEffect(() => {
    if (fragmentSlug) fs.dispatchFetchFragment(fragmentSlug);
  }, [fragmentSlug, fs])

  return (
    <Route className="fragment-detail-route">
      <Header left={`${fs.fragment?.author?.full_name}, ${fs.fragment?.title}`}/>
      <Page>
        <div className="fragment-detail-route-editor">
          <MonacoEditor
            width="100%"
            height="90vh"
            language="haskell"
            editorWillMount={registerMonaco}
            options={options}
            // theme="vs-dark"
            // onChange={::this.onChange}
            // editorDidMount={::this.editorDidMount}
          />
        </div>
        <div className="fragment-detail-route-examples">
          {fs.examples.map((example) =>
            <Example example={example} key={example.id}/>
          )}
          {fs.temporaryExamples.map((example) =>
            <TemporaryExample example={example} key={example.temp_id}/>
          )}
          <div className="fragment-detail-route-new-example-control">
            <Button mode="clear" onClick={handleNewExample}>
              <PlusIcon/><span className="fragment-detail-route-new-example-control-text" >add an example</span>
            </Button>
          </div>
        </div>
      </Page>
    </Route>
  );
};

export default observer(FragmentDetailRoute);