import React, { useEffect } from "react";
import "./DocReadRoute.scss";
import { useParams } from "react-router-dom";

import { useStores } from "hooks";
import { observer } from "mobx-react-lite";
import { Document as PDF, Page as PDFPage } from 'react-pdf/dist/esm/entry.webpack5';

import { DocReadRouteParams } from "types";
import Header from "components/layout/Header";
import Page from "components/layout/Page";
import Route from "./Route";
import YScrollable from "components/YScrollable";
import Button from "components/Button";


const DocReadRoute: React.FC = () => {
  const { slug } = useParams<DocReadRouteParams>();
  const { moduleStore: ms } = useStores();

  const handleDocEdit = () => {};

  useEffect(() => {
    if (slug) {
      ms.fetchModule(slug).then(
        () => {
          ms.setOutputUri(`${slug}.pdf`);
        }
      )
    }
  }, [slug, ms]);

  return (
    <Route className="doc-read-route">
      <Page
        header={
          <Header
            left={ms.module?.title}
            right={
              <div className="doc-read-route-toolbar">
                <Button className="doc-read-route-toolbar-tool" onClick={handleDocEdit}>edit</Button>
              </div>
            }
          />
        }
        panes={[
          <YScrollable>
            <div className="doc-read-route-output">
              <PDF
                file={ms.outputUri}
                key={ms.version}
                onLoadError={(err) => console.log('ERR! ', err)}
                onSourceError={(err) => console.log('ERR! ', err)
              }>
                <PDFPage pageNumber={1} />
              </PDF>
            </div>
          </YScrollable>
        ]}
      />
    </Route>
  );
};

export default observer(DocReadRoute);
