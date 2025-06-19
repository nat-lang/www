import "./app.css"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./routes/login";
import Library from "./routes/library";
import { useEffect, useState } from "react";
import Git, { DOC_REPO, LIB_REPO } from "./service/git";
import useFileCtx from "./context/file";
import runtime from "./service/nat/client";
import useAuthCtx from "./context/auth";
import { RepoFile } from "./types";
import { DOC_PATH } from "./config";
import Docs from "./routes/docs";
import Core from "./routes/core";

const App = () => {
  const [git, setGit] = useState<Git | null>(null);
  const githubAuth = useAuthCtx(state => state.token);
  const {
    docTree, setDocTree,
    libTree, setLibTree,
    setCoreTree,
    setDocFile, setLibFile,
    setDocsLoaded, setLibLoaded,
  } = useFileCtx();

  const setRuntimeFiles = (git: Git, repo: string, files: RepoFile[], cb: (path: string, content: string) => void, root?: string) =>
    Promise.all(files.map(async file => {
      if (file.path) {
        if (file.type === "tree") {
          runtime.mkDir(file.path);
        } else {
          const path = root ? `${root}/${file.path}` : file.path;
          const content = await git.getContent(repo, file.path);
          await runtime.setFile(path, content);
          cb(path, content);
        }
      }
    }));

  // init.
  useEffect(() => {
    (async () => {
      setCoreTree(await runtime.getCoreFiles());
    })();

    setGit(new Git());
  }, []);

  useEffect(() => {
    if (!githubAuth) return;

    const data = JSON.parse(githubAuth);
    if (!data.access_token) throw Error("Corrupt token.");

    setGit(new Git({ auth: data.access_token }));
  }, [githubAuth]);

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
      await setRuntimeFiles(git, LIB_REPO, libTree, setLibFile);
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

  return <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/core/*" element={<Core git={git} />} />
      <Route path="/docs/*" element={<Docs git={git} />} />
      <Route path="/*" element={<Library git={git} />} />
      <Route index element={<Navigate replace to="/docs/introduction" />} />
    </Routes>
  </BrowserRouter>
};

export default App;