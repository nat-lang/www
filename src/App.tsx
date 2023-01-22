import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.scss";
import { observer } from "mobx-react-lite";
import ModuleUpdateRoute from "components/routes/ModuleUpdateRoute";
import ModuleCreateRoute from "components/routes/ModuleCreateRoute";
import IndexRoute from "components/routes/IndexRoute";

const App: React.FC = () => {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<IndexRoute/>}/>
            <Route path="lib">
              <Route index element={<ModuleCreateRoute/>}/>
              <Route path=":slug" element={<ModuleUpdateRoute/>}/>
            </Route>
            <Route path="docs">
              {/*<Route path="intro" element={<DocReadRoute/>}/>*/}
              {/*<Route path="expressions" element={<DocReadRoute/>}/>*/}
              {/*<Route path="types" element={<DocReadRoute/>}/>*/}
              {/*<Route path="modules" element={<DocReadRoute/>}/>*/}
              {/*<Route path="applications" element={<DocReadRoute/>}/>*/}
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default observer(App);
