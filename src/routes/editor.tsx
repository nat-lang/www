import { useRef, useState, useEffect } from 'react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import './editor.css'
import { v4 } from 'uuid';
import Navigation from '../components/navigation';
import { RepoFile, RepoFileTree } from '../types';
import { useNavigate, useParams } from 'react-router-dom';
import client, { CoreFile, CORE_DIR } from '../service/nat/client';
import Header from '../components/header';
import Button from '../components/button';
import Arrows from '../icons/arrows';
import Canvas from '../components/canvas';
import Git from '../service/git';
import FilePane, { FilePaneFieldValues } from '../components/filepane';
import { ensureExt, stripExt } from '../util';
import * as tex from '../service/tex';


export default function Editor() {
  const [editor, setEditor] = useState<monaco.editor.ICodeEditor | null>(null);
  const [navigationOpen, setNavigationOpen] = useState<boolean>(true);
  const monacoEl = useRef(null);
  const params = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState<RepoFileTree>([]);
  const [coreFiles, setCoreFiles] = useState<CoreFile[]>([]);
  const githubAuth = localStorage.getItem("githubtoken");
  const [git, setGit] = useState<Git | null>(null);
  const [canvasFile, setCanvasFile] = useState<string>();
  const [openFilePane, setOpenFilePane] = useState<boolean>(false);

  let root = params.file;
  let path = params["*"] ? `${root}/${params["*"]}` : root;

  const fetchGitFiles = async () => {
    if (!git) return;
    let resp = await git.getTree();
    console.log(resp);
    setFiles(resp.data.tree);
  };

  const handleFileClick = async (file: RepoFile) => {
    if (!file.path) throw Error("Can't navigate to pathless file.");

    navigate(`/${file.path}`);
  };

  const handleEvaluateClick = async () => {
    if (editor) {
      const source = editor.getValue();
      const compilation = await client.compile(path ?? "/", source);

      if (compilation) {
        const resp = await tex.render(compilation.tex);
        setCanvasFile(resp);
      }
    }
  };

  const handleSaveClick = () => setOpenFilePane(true);

  const handleSave = async (form: FilePaneFieldValues) => {
    if (!git) return;
    if (!editor) return;

    let currentCommit = await git.getCurrentCommit(import.meta.env.VITE_GITHUB_BRANCH);
    let blob = await git.createBlob(editor.getValue());
    let path = form.folder ? `${form.folder}/${form.filename}` : form.filename;

    const tree = await git.createTree(
      [{
        path,
        mode: "100644",
        type: "blob",
        sha: blob.sha,
      }],
      currentCommit.treeSha,
    );

    await git.createCommit(import.meta.env.VITE_GITHUB_BRANCH, tree.data.sha, currentCommit.commitSha);

    fetchGitFiles();
    setOpenFilePane(false);
    navigate(`/${path}`);
  }

  useEffect(() => {
    (async () => {
      setCoreFiles(await client.getCoreFiles());
    })();
  }, []);

  useEffect(() => {
    if (!git) return;
    if (!editor) return;

    if (path === undefined) {
      const uid = v4();
      const uri = monaco.Uri.file(uid);
      const model = monaco.editor.createModel("", 'nat', uri);
      editor.setModel(model);
      return;
    }

    const uri = monaco.Uri.file(path);
    const model = monaco.editor.getModel(uri);

    if (model) {
      editor.setModel(model);
      return;
    }

    if (root === CORE_DIR) {
      (async () => {
        if (!params["*"]) return;

        const file = await client.getFile(path);
        const model = monaco.editor.createModel(file.content, 'nat', uri);
        editor.setModel(model);
      })();

      return;
    }

    (async () => {
      const content = await git.getContent(path);
      const model = monaco.editor.createModel(content, 'nat', uri);
      editor.setModel(model);
    })();

  }, [path, git, editor]);

  useEffect(() => {
    if (!githubAuth) return;

    const data = JSON.parse(githubAuth);
    if (!data.access_token) throw Error("Corrupt token.");

    const git = new Git(
      { auth: data.access_token },
      "nat-lang",
      "library"
    );
    setGit(git);
  }, [githubAuth]);

  useEffect(() => {
    fetchGitFiles();
  }, [git]);

  useEffect(() => {
    if (!monacoEl) return;

    setEditor((editor) => {
      if (editor) return editor;

      const newEditor = monaco.editor.create(monacoEl.current!, {
        value: "",
        language: 'nat'
      });

      return newEditor;
    });

    return () => editor?.dispose()
  }, [monacoEl.current]);

  useEffect(() => {
    if (!editor) return;
    if (!path) return;

    let disposables = [
      editor.onKeyDown(e => {
        if (e.metaKey && e.keyCode == 3) {
          if (!path) return;

          path = stripExt(path);
          client.interpret(path);
        }
      }),
      editor.onDidChangeModelContent(_ => {
        const value = editor.getValue();

        (async () => {
          if (!path) return;
          path = ensureExt(path);
          await client.setFile(path, value);
        })();
      })
    ];

    return () => disposables.forEach(x => x.dispose());
  }, [editor, path]);

  useEffect(() => {
    if (!files) return;
    if (!git) return

    files.forEach(async file => {
      if (file.path) {
        if (file.type === "tree") {
          client.mkDir(file.path);
        } else {
          const content = await git.getContent(file.path);
          await client.setFile(ensureExt(file.path), content);

        }
      }
    });
  }, [git, files]);

  return <>
    <Header>
      <Button onClick={handleSaveClick}>save</Button>
      <Button onClick={handleEvaluateClick}>evaluate</Button>
    </Header>
    <div className={`Editor ${navigationOpen ? "" : "Editor-nav-closed"}`}>
      <Navigation
        files={files}
        activeFilePath={path}
        coreFiles={coreFiles}
        onFileClick={handleFileClick}
        className={navigationOpen ? "" : "Navigation--closed"}
      />
      <div className="NavAccessColumn">
        <Arrows onClick={() => setNavigationOpen(!navigationOpen)} className="NavigationAccess" />
      </div>
      <div className="Monaco" ref={monacoEl}></div>

      <Canvas file={canvasFile} />

      {openFilePane && <FilePane onSubmit={handleSave} files={files} path={path} />}
    </div>
  </>;
}