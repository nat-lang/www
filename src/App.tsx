import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.scss";
import { observer } from "mobx-react-lite";
import ModuleUpdateRoute from "components/routes/ModuleUpdateRoute";
import ModuleCreateRoute from "components/routes/ModuleCreateRoute";
import IndexRoute from "components/routes/IndexRoute";
import DocReadRoute from "components/routes/DocReadRoute";
import { docRoutes } from "routes";

const App: React.FC = () => {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<IndexRoute/>}/>
            <Route path="new">
              <Route index element={<ModuleCreateRoute/>}/>
              <Route path=":slug" element={<ModuleUpdateRoute/>}/>
            </Route>
            <Route path="docs">
              {docRoutes.map(
                (path, idx) => <Route key={idx} path={path} element={<DocReadRoute/>}/>
              )}
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default observer(App);
