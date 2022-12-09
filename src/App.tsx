import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.scss";
import { observer } from "mobx-react-lite";
import ModuleDetailRoute from "components/routes/ModuleDetailRoute";
import ModuleCreateRoute from "components/routes/ModuleCreateRoute";

const App: React.FC = () => {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<ModuleCreateRoute/>}/>
            <Route path=":slug" element={<ModuleDetailRoute/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default observer(App);
