import { useRef, useState, useEffect } from 'react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import './editor.css'

import Module from '../wasm/nat.js'
import Navigation from '../components/navigation.js';
import { RepoFile, RepoFileTree } from '../types.js';
import { useNavigate, useParams } from 'react-router-dom';
import { Octokit } from 'octokit';

let interpret = (path: string, source: string) => Module().then(mod => {
  let intpt = mod.cwrap('interpretSource', 'number', ['string', 'string']);
  return intpt(path, source);
});

export default function Editor() {
  const [editor, setEditor] = useState<monaco.editor.ICodeEditor | null>(null)
  const monacoEl = useRef(null)
  const params = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState<RepoFileTree>([]);
  const githubAuth = localStorage.getItem("githubtoken");
  const [octokit, setOctokit] = useState<Octokit | null>();

  let path = params.file;
  if (params["*"]) path += `/${params["*"]}`;

  const handleFileClick = async (file: RepoFile) => {
    if (!file.path) throw Error("Can't navigate to pathless file.");

    navigate(`/${file.path}`);
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
        ref: "c&c",
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
        owner: 'nat-lang', repo: 'library', tree_sha: 'c&c',
        recursive: "true"
      });
      setFiles(t.data.tree);
    })();
  }, [octokit]);

  useEffect(() => {
    if (!monacoEl) return;

    setEditor((editor) => {
      if (editor) return editor

      const e = monaco.editor.create(monacoEl.current!, {
        value: "",
        language: 'nat'
      })

      e.onKeyDown(v => {
        if (v.metaKey && v.keyCode == 3) {
          const a = e.getValue()

          interpret(path ?? "/", a);
        }
      })

      return e;
    });

    return () => editor?.dispose()
  }, [monacoEl.current])

  return <div className="ide">
    <Navigation files={files} onFileClick={handleFileClick} />
    <div className="Editor" ref={monacoEl}></div>
  </div>
}