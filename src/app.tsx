import "./app.css"
import { BrowserRouter, Navigate, Route, Routes, useLocation, } from "react-router-dom";
import Login from "./routes/login";
import { useEffect, useState } from "react";
import Git, { DOC_REPO, LIB_REPO } from "./service/git";
import useFileCtx from "./context/file";
import runtime from "./service/nat/client";
import useAuthCtx from "./context/auth";
import { RepoFile } from "./types";
import { DOC_PATH, LIB_PATH } from "./config";
import Core from "./routes/core";
import { px2pt, vw2px } from "./utilities";
import useDimsCtx from "./context/dims";
import useModelCtx, { createModel } from "./context/monaco";
import * as monaco from 'monaco-editor';
import useRuntimeCtx from "./context/runtime";
import { useNavigation } from "./hooks/useNavigation";
import Edit from "./routes/edit";
import Create from "./routes/create";
import useCreateCtx from "./context/create";
import { useShallow } from "zustand/react/shallow";
import CoreBase from "./routes/core/base";

const EditorCommands = {
  CmdEnter: "CmdEnter"
};

const App = () => {
  const [git, setGit] = useState<Git | null>(null);
  const githubAuth = useAuthCtx(state => state.token);
  const {
    docTree, setDocTree,
    libTree, setLibTree,
    setCoreTree,
    setDocFile, setLibFile,
    setDocsLoaded, setLibLoaded,
    setCtxLoaded,
    lib, docs
  } = useFileCtx();
  const { center } = useDimsCtx(useShallow(({ center }) => ({ center })));

  const runtimeCtx = useRuntimeCtx();
  const createCtx = useCreateCtx();
  const { models, setModel, delModel } = useModelCtx();
  const location = useLocation();
  const { navigate, beforeNavigate } = useNavigation();

  const ctxPath = "/core/online.nat";
  const ctxModel = models[ctxPath];

  const ctx = () => `let window = {"center": "${px2pt(vw2px(center * 0.667))}pt"};
let host = "${window.location.protocol}//${window.location.host}";
let path = "${window.location.pathname}";
  `;

  const setRuntimeDirs = (
    files: RepoFile[],
    root: string
  ) => Promise.all(
    files.filter(file => file.type === "tree" && !!file.path).map(
      async file => await runtime.mkDir(`${root}/${file.path!}`)
    )
  );

  const setRuntimeFiles = (
    git: Git,
    repo: string,
    files: RepoFile[],
    cb: (path: string, content: string) => void,
    root: string
  ) => setRuntimeDirs(files, root).then(
    () => Promise.all(files.map(async file => {
      if (file.path && file.type !== "tree") {
        const path = `${root}/${file.path}`;
        const content = await git.getContent(repo, file.path);
        await runtime.setFile(path, content);
        cb(path, content);
      }
    })));

  // init.
  // -------------------------------------

  useEffect(() => {
    runtime.getCoreFiles().then(setCoreTree);
    runtime.init().then(runtimeCtx.setInitialized);
  }, []);

  useEffect(() => {
    setGit(new Git());
  }, []);

  useEffect(() => {
    // monaco swallows this keyboard event, so we have to capture 
    // and re-emit it on the window.
    const disposables = [
      monaco.editor.addCommand({
        id: EditorCommands.CmdEnter,
        run: () => {
          const event = new KeyboardEvent("keydown", {
            key: "Enter",
            metaKey: true
          });
          window.dispatchEvent(event);
        }
      }),
      monaco.editor.addKeybindingRule(
        {
          keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
          command: EditorCommands.CmdEnter,
        }
      )
    ];

    return () => disposables.forEach(x => x.dispose());
  }, []);

  // manage the context file we expose to nat code.
  // -------------------------------------

  useEffect(() => {
    const disposeBeforeNavigate = beforeNavigate(
      async () => setCtxLoaded(false)
    );
    const model = createModel(ctxPath, "", () => setCtxLoaded(true));

    setModel(ctxPath, model);

    return () => {
      disposeBeforeNavigate();
      delModel(ctxPath);
    }
  }, []);

  useEffect(() => {
    if (!ctxModel) return;
    ctxModel.setValue(ctx());
  }, [ctxModel, location, ctx()]);

  useEffect(() => {
    const resize = () => ctxModel && ctxModel.setValue(ctx());
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [ctxModel]);

  // auth.
  // -------------------------------------

  useEffect(() => {
    if (!githubAuth) return;

    const data = JSON.parse(githubAuth);
    if (!data.access_token) throw Error("Corrupt token.");

    setGit(new Git({ auth: data.access_token }));
  }, [githubAuth]);

  // file data.
  // -------------------------------------

  useEffect(() => {
    if (!git) return;
    git.getTree(LIB_REPO).then(
      resp => setLibTree(resp.data.tree)
    );
    git.getTree(DOC_REPO).then(
      resp => setDocTree(resp.data.tree)
    );
  }, [git, setLibTree, setDocTree]);

  useEffect(() => {
    if (!git) return;
    if (libTree.length === 0) return;
    (async () => {
      await runtime.mkDir(LIB_PATH);
      await setRuntimeFiles(git, LIB_REPO, libTree, setLibFile, LIB_PATH);
      setLibLoaded();
    })();

  }, [git, libTree]);

  useEffect(() => {
    if (!git) return;
    if (docTree.length === 0) return;

    (async () => {
      await runtime.mkDir(DOC_PATH);
      await setRuntimeFiles(git, DOC_REPO, docTree, setDocFile, DOC_PATH);
      setDocsLoaded();
    })();

  }, [git, docTree]);

  // anchor management.
  // -------------------------------------

  return <>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/core/online.nat" element={<CoreBase model={ctxModel} />} />
      <Route path="/core/*" element={<Core />} />
      <Route
        path="/guide/*"
        element={
          <Edit
            git={git}
            repo={DOC_REPO}
            fsRoot={DOC_PATH}
            fileMap={docs}
            onNew={() => navigate("/guide/new")}
          />
        }
      />
      <Route
        path="/guide/new"
        element={
          <Create
            git={git}
            repo={DOC_REPO}
            tree={docTree}
            ctx={{ content: createCtx.doc, path: createCtx.docPath }}
            onCreate={path => navigate(`/guide/${path}`)} />
        }
      />
      <Route
        path="/lib/new"
        element={
          <Create
            git={git}
            repo={LIB_REPO}
            tree={libTree}
            ctx={{ content: createCtx.lib, path: createCtx.libPath }}
            onCreate={path => navigate(`/${path}`)} />
        }
      />
      <Route
        path="/*"
        element={
          <Edit
            git={git}
            repo={LIB_REPO}
            fsRoot={LIB_PATH}
            fileMap={lib}
            onNew={() => navigate("/lib/new")}
            relPath
          />
        }
      />
      <Route index element={<Navigate replace to="/guide/introduction" />} />
    </Routes>
  </>
};

export default App;