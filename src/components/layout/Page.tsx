import React from 'react';
import "./Page.scss";
import { SplitPane } from "react-collapse-pane";
import Nav from './Nav';
import YScrollable from 'components/YScrollable';

type PageProps = {
  header: React.ReactNode
  panes: React.ReactNode[]
}

const Page: React.FC<PageProps> = ({ header, panes }) => {
  return (
    <div className="page">
      {header}
      <div className="page-body">
        <SplitPane
          split="vertical"
          initialSizes={[1.5,6,4]}
          resizerOptions={{
            css: {
              width: '1px',
              background: 'rgba(0, 0, 0, 0.1)',
            },
            hoverCss: {
              width: '3px',
              background: '1px solid rgba(102, 194, 255, 0.5)',
            },
            grabberSize: '1rem',
          }}>
          {[
            <YScrollable key={0}>
              <Nav/>
            </YScrollable>,
            ...panes.map((pane, idx) => <div key={idx + 1}>{pane}</div>)
          ]}
        </SplitPane>
      </div>
    </div>
  );
};

export default Page