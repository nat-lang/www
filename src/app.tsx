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
    docs: docFiles, setDocs: setDocFiles,
    lib: libFiles, setLib: setLibFiles,
    setCore: setCoreFiles
  } = useFileCtx();

  const fetchLibFiles = async () => {
    if (!git) return;
    let resp = await git.getTree(LIB_REPO);
    setLibFiles(resp.data.tree);
  };

  const fetchDocFiles = async () => {
    if (!git) return;
    let resp = await git.getTree(DOC_REPO);
    setDocFiles(resp.data.tree);
  };

  const setRuntimeFiles = async (repo: string, files: RepoFile[], root?: string) => {
    if (!git) return;
    files.forEach(async file => {
      if (file.path) {
        if (file.type === "tree") {
          runtime.mkDir(file.path);
        } else {
          const content = await git.getContent(repo, file.path);
          await runtime.setFile(root ? `${root}/${file.path}` : file.path, content);
        }
      }
    });
  }

  // init.
  useEffect(() => {
    (async () => {
      setCoreFiles(await runtime.getCoreFiles());
    })();

    setGit(new Git());
  }, []);

  useEffect(() => {
    if (!githubAuth) return;

    const data = JSON.parse(githubAuth);
    if (!data.access_token) throw Error("Corrupt token.");

    const git = new Git({ auth: data.access_token });
    setGit(git);
  }, [githubAuth]);

  useEffect(() => {
    fetchLibFiles();
    fetchDocFiles();
  }, [git]);

  useEffect(() => {
    if (!libFiles) return;
    setRuntimeFiles(LIB_REPO, libFiles);
  }, [git, libFiles]);

  useEffect(() => {
    if (!docFiles) return;

    (async () => {
      await runtime.mkDir(DOC_PATH);
      setRuntimeFiles(DOC_REPO, docFiles, DOC_PATH);
    })();

  }, [git, docFiles]);

  return <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/core/*" element={<Core git={git} />} />
      <Route path="/docs/*" element={<Docs git={git} />} />
      <Route path="/:root?/*" element={<Library git={git} />} />
      <Route index element={<Navigate replace to="/docs/introduction" />} />
    </Routes>
  </BrowserRouter>
};

export default App;