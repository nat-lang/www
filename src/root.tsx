import "./app.css"
import { Outlet, useBlocker, useLocation, } from "react-router-dom";
import { useEffect } from "react";
import Git from "./service/git";
import useFileCtx, { fileArrayToTree } from "./context/file";
import runtime from "./service/nat/client";
import useAuthCtx from "./context/auth";
import { px2pt, vw2px } from "./utilities";
import useDimsCtx from "./context/dims";
import useModelCtx, { createModel } from "./context/monaco";
import * as monaco from 'monaco-editor';
import useRuntimeCtx from "./context/runtime";
import useCreateCtx from "./context/create";
import { useShallow } from "zustand/react/shallow";
import useGitCtx from "./context/git";

const EditorCommands = {
  CmdEnter: "CmdEnter"
};

const App = () => {
  const { git, setGit } = useGitCtx();
  const githubAuth = useAuthCtx(state => state.token);
  const {
    setRepo,
    setCore,
    setRepoFile,
    setRepoLoaded,
    setCtxLoaded,
    repoLoaded
  } = useFileCtx();
  const { center } = useDimsCtx(useShallow(({ center }) => ({ center })));

  const runtimeCtx = useRuntimeCtx();
  const createCtx = useCreateCtx();
  const { models, setModel, delModel } = useModelCtx();
  const location = useLocation();

  const ctxPath = "/online/context";
  const ctxModel = models[ctxPath];

  const ctx = () => `let window = {"center": "${px2pt(vw2px(center * 0.667))}pt"};
let host = "${window.location.protocol}//${window.location.host}";
let path = "${window.location.pathname}";
  `;

  // init.
  // -------------------------------------

  useEffect(() => {
    runtime.getCoreFiles().then(fileArrayToTree).then(setCore);
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

  useBlocker(() => {
    setCtxLoaded(false);
    return false;
  })

  useEffect(() => {
    if (!repoLoaded) return;

    const model = createModel(ctxPath, "", () => setCtxLoaded(true));
    setModel(ctxPath, model);

    return () => delModel(ctxPath);
  }, [repoLoaded]);

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
    (async () => {
      if (!git) return;

      let repo = (await git.getRepo()).data.tree;

      // make pathnames absolute for consistency with location.pathnam
      // and fs paths.
      repo = repo.map(
        file => ({ ...file, path: "/" + file.path })
      );

      await Promise.all(
        repo.filter(file => file.type === "tree" && !!file.path).map(
          async file => await runtime.mkDir(file.path!)
        )
      );

      await Promise.all(repo.map(async file => {
        if (file.path && file.type !== "tree") {
          const content = await git.getContent(file.path);
          await runtime.setFile(file.path, content);
          setRepoFile(file.path, content);
        }
      }));

      setRepo(fileArrayToTree(repo));
      setRepoLoaded();
    })();
  }, [git]);

  return <Outlet />
};

export default App;