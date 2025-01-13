import { useRef, useState, useEffect } from 'react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import './editor.css'

import Navigation from '../components/navigation';
import { RepoFile, RepoFileTree } from '../types';
import { useNavigate, useParams } from 'react-router-dom';
import { Octokit } from 'octokit';
import { interpret, compile, CompilationNode } from '../service/nat/client';
import Header from '../components/header';
import Button from '../components/button';
import Arrows from '../icons/arrows';
import Canvas from '../components/canvas';

export default function Editor() {
  const [editor, setEditor] = useState<monaco.editor.ICodeEditor | null>(null);
  const [navigationOpen, setNavigationOpen] = useState<boolean>(true);
  const monacoEl = useRef(null);
  const params = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState<RepoFileTree>([]);
  const githubAuth = localStorage.getItem("githubtoken");
  const [octokit, setOctokit] = useState<Octokit | null>();
  const [canvasData, setCanvasData] = useState<CompilationNode[]>();

  let path = params.file;
  if (params["*"]) path += `/${params["*"]}`;

  const handleFileClick = async (file: RepoFile) => {
    if (!file.path) throw Error("Can't navigate to pathless file.");

    navigate(`/${file.path}`);
  };

  const handleEvaluateClick = async () => {
    if (editor) {
      const source = editor.getValue();
      const compilation = await compile(path ?? "/", source);
      setCanvasData(compilation.data);
    }
  };

  useEffect(() => {
    if (!path) return;
    if (!octokit) return;
    if (!editor) return;

    const uri = monaco.Uri.file(path);

    const model = monaco.editor.getModel(uri);
    if (model) {
      editor.setModel(model);
      return;
    }

    (async () => {
      const res = await octokit.rest.repos.getContent({
        owner: 'nat-lang',
        repo: 'library',
        path
      });

      if (Array.isArray(res.data))
        throw Error(`Unexpected file type: directory.`);
      if (res.data.type !== "file")
        throw Error(`Unexpected file type: ${res.data.type}`);

      const content = window.atob(res.data.content);
      const model = monaco.editor.createModel(content, 'nat', uri);
      editor.setModel(model);
    })();

  }, [path, octokit, editor]);

  useEffect(() => {
    if (!githubAuth) return;

    const data = JSON.parse(githubAuth);
    if (!data.access_token) throw Error("Corrupt token.");
    setOctokit(new Octokit({ auth: data.access_token }));
  }, [githubAuth]);

  useEffect(() => {
    if (!octokit) return;

    (async () => {
      let t = await octokit.rest.git.getTree({
        owner: 'nat-lang', repo: 'library', tree_sha: 'main',
        recursive: "true"
      });
      setFiles(t.data.tree);
    })();
  }, [octokit]);

  useEffect(() => {
    if (!monacoEl) return;

    setEditor((editor) => {
      if (editor) return editor;

      const newEditor = monaco.editor.create(monacoEl.current!, {
        value: "",
        language: 'nat'
      });

      newEditor.onKeyDown(v => {
        if (v.metaKey && v.keyCode == 3) {
          const source = newEditor.getValue();

          interpret(path ?? "/", source);
        }
      });

      return newEditor;
    });

    return () => editor?.dispose()
  }, [monacoEl.current])

  return <>
    <Header>
      <Button onClick={handleEvaluateClick}>evaluate</Button>
    </Header>
    <div className={`ide ${navigationOpen ? "" : "ide-nav-closed"}`}>
      <Navigation
        files={files}
        onFileClick={handleFileClick}
        className={navigationOpen ? "" : "Navigation--closed"}
      />
      <div className="NavAccessColumn">
        <Arrows onClick={() => setNavigationOpen(!navigationOpen)} className="NavigationAccess" />
      </div>
      <div className="Editor" ref={monacoEl}></div>
      <Canvas data={canvasData} />
    </div>
  </>;
}