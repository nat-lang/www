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
import Canvas from '../components/canvas';
import Git from '../service/git';
import FilePane, { FilePaneFieldValues } from '../components/filepane';
import * as tex from '../service/tex';
import { DndContext, DragEndEvent, DragMoveEvent, DragStartEvent } from '@dnd-kit/core';
import Draggable from '../components/draggable';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { abs } from '@nat-lang/nat';

const DRAGGABLE_ELEMENTS = {
  NAV_COL: "NAV_COL",
  CANVAS_COL: "CANVAS_COL"
};

const MIN_EDITOR_VW = 15;
const MIN_NAV_VW = 1;

const oLayoutDims = {
  nav: 15,
  editor: 55,
  canvas: 30
};

type LayoutDims = typeof oLayoutDims;

const vw = (v: number) => `${v}vw`;
const px2vw = (px: number) => (px / window.innerWidth) * 100;

export default function Editor() {
  const [editor, setEditor] = useState<monaco.editor.ICodeEditor | null>(null);
  const [layoutDims, setLayoutDims] = useState<LayoutDims>(oLayoutDims);
  const navRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const params = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState<RepoFileTree>([]);
  const [coreFiles, setCoreFiles] = useState<CoreFile[]>([]);
  const githubAuth = localStorage.getItem("githubtoken");
  const [git, setGit] = useState<Git | null>(null);
  const [canvasFile, setCanvasFile] = useState<string>();
  const [openFilePane, setOpenFilePane] = useState<boolean>(false);
  const [navColDragging, setNavColDragging] = useState<boolean>(false);
  const [canvasColDragging, setCanvasColDragging] = useState<boolean>(false);
  const [_, setPrevDragEvent] = useState<DragMoveEvent | null>(null);

  let root = params.file;
  let path = params["*"] ? `${root}/${params["*"]}` : root;

  const fetchGitFiles = async () => {
    if (!git) return;
    let resp = await git.getTree();
    setFiles(resp.data.tree);
  };

  const handleFileClick = async (file: RepoFile) => {
    if (!file.path) throw Error("Can't navigate to pathless file.");

    navigate(`/${file.path}`);
  };

  const handleEvaluateClick = async () => {
    if (editor) {
      const intptResp = await client.typeset(path ? abs(path) : "/");

      if (intptResp) {
        const texResp = await tex.render(intptResp.tex);
        setCanvasFile(texResp);
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
    if (!editorRef) return;

    setEditor((editor) => {
      if (editor) return editor;

      const newEditor = monaco.editor.create(editorRef.current!, {
        value: "",
        language: 'nat',
        automaticLayout: true
      });

      return newEditor;
    });

    return () => editor?.dispose()
  }, [editorRef.current]);

  useEffect(() => {
    if (!editor) return;
    if (!path) return;

    let disposables = [
      editor.onKeyDown(e => {
        if (e.metaKey && e.keyCode == 3) {
          if (!path) return;

          client.interpret(abs(path));
          e.stopPropagation();
        }
      }),
      editor.onDidChangeModelContent(_ => {
        const value = editor.getValue();

        (async () => {
          if (!path) return;
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
          await client.setFile(file.path, content);

        }
      }
    });
  }, [git, files]);

  const handleDragMove = (e: DragMoveEvent) => {
    setPrevDragEvent(prevE => {
      const diff = px2vw(prevE ? e.delta.x - prevE.delta.x : e.delta.x);

      setLayoutDims(dims => {
        switch (e.active.id) {
          case DRAGGABLE_ELEMENTS.NAV_COL: {
            let next = {
              nav: dims.nav + diff,
              editor: dims.editor - diff,
              canvas: dims.canvas
            };

            if (next.editor <= MIN_EDITOR_VW) {
              next.editor = MIN_EDITOR_VW;
              next.canvas = 100 - next.nav - next.editor;
            }

            return next;
          }
          case DRAGGABLE_ELEMENTS.CANVAS_COL: {
            let next = {
              nav: dims.nav + diff,
              editor: dims.editor,
              canvas: dims.canvas - diff
            };

            if (next.nav <= MIN_NAV_VW) {
              next.nav = MIN_NAV_VW;
              next.editor = 100 - next.nav - next.canvas;
            }

            return next;
          }
        }
        return dims;
      });


      return e;
    });
  }

  const handleDragStart = (e: DragStartEvent) => {
    switch (e.active.id) {
      case DRAGGABLE_ELEMENTS.NAV_COL: setNavColDragging(true); break;
      case DRAGGABLE_ELEMENTS.CANVAS_COL: setCanvasColDragging(true);
    }
  };
  const handleDragEnd = (e: DragEndEvent) => {
    switch (e.active.id) {
      case DRAGGABLE_ELEMENTS.NAV_COL: setNavColDragging(false); break;
      case DRAGGABLE_ELEMENTS.CANVAS_COL: setCanvasColDragging(false);
    }
    setPrevDragEvent(null);
  };

  return <>
    <Header>
      <Button onClick={handleSaveClick}>save</Button>
      <Button onClick={handleEvaluateClick}>evaluate</Button>
    </Header>
    <div className="Editor">
      <DndContext onDragMove={handleDragMove} onDragStart={handleDragStart} onDragEnd={handleDragEnd} modifiers={[restrictToHorizontalAxis]}>
        <Navigation
          style={{ flexBasis: vw(layoutDims.nav) }}
          ref={navRef}
          files={files}
          activeFilePath={path}
          coreFiles={coreFiles}
          onFileClick={handleFileClick}
        />
        <Draggable id={DRAGGABLE_ELEMENTS.NAV_COL} className={`AccessColumn ${navColDragging ? " dragging" : ""}`}>
          <div />
        </Draggable>

        <div className="Monaco" ref={editorRef} style={{ width: vw(layoutDims.editor) }}></div>

        <Draggable id={DRAGGABLE_ELEMENTS.CANVAS_COL} className={`AccessColumn ${canvasColDragging ? " dragging" : ""}`}>
          <div />
        </Draggable>
        <Canvas file={canvasFile} style={{ width: vw(layoutDims.canvas) }} />

        {openFilePane && <FilePane onSubmit={handleSave} files={files} path={path} />}
      </DndContext>
    </div>
  </>;
}