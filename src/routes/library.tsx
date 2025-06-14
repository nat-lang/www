import { useRef, useState, useEffect, FunctionComponent } from 'react';
import * as monaco from 'monaco-editor';
import './library.css';
import { v4 } from 'uuid';
import Navigation from '../components/navigation';
import { RepoFile } from '../types';
import { useNavigate, useParams } from 'react-router-dom';
import runtime, { CORE_DIR } from '../service/nat/client';
import Header from '../components/header';
import Button from '../components/button';
import Canvas from '../components/canvas';
import Git, { DOC_REPO, LIB_REPO } from '../service/git';
import FilePane, { FilePaneFieldValues } from '../components/filepane';
import * as nls from '../service/nls/client';
import { DndContext, DragEndEvent, DragMoveEvent, DragStartEvent } from '@dnd-kit/core';
import Draggable from '../components/draggable';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { abs } from '@nat-lang/nat';
import useAuthCtx from '../context/auth';
import FileTree from '../components/filetree';
import { px2vw, vw } from '../utilities';
import { DOC_PATH, DRAGGABLE_ELEMENTS, LayoutDims, MIN_EDITOR_VW, MIN_NAV_VW, defaultLayoutDims } from '../config';
import Editor from '../components/editor';
import useFileCtx from '../context/file';

type LibraryProps = {
  git: Git | null;
}

const Library: FunctionComponent<LibraryProps> = ({ git }) => {
  const [model, setModel] = useState<monaco.editor.ITextModel | null>(null);
  const [layoutDims, setLayoutDims] = useState<LayoutDims>(defaultLayoutDims);
  const params = useParams();
  const navigate = useNavigate();

  const {
    lib: libFiles,
  } = useFileCtx();

  const githubAuth = useAuthCtx(state => state.token);
  const [canvasFile, setCanvasFile] = useState<string>();
  const [openFilePane, setOpenFilePane] = useState<boolean>(false);
  const [navColDragging, setNavColDragging] = useState<boolean>(false);
  const [canvasColDragging, setCanvasColDragging] = useState<boolean>(false);
  const [_, setPrevDragEvent] = useState<DragMoveEvent | null>(null);

  let root = params.root;
  let path = params["*"] ? `${root}/${params["*"]}` : root;

  const handleEvaluateClick = async () => {
    const intptResp = await runtime.typeset(path ? abs(path) : "/");

    if (intptResp.success) {
      const renderResp = await nls.render(intptResp.tex);
      if (renderResp.success && renderResp.pdf)
        setCanvasFile(renderResp.pdf);
      else if (renderResp.errors)
        console.log(renderResp.errors);
    } else {
      console.log(intptResp.errors);
    }
  };

  const handleSaveClick = () => setOpenFilePane(true);

  const handleSave = async (repo: string, path: string) => {
    if (!git) return;
    if (!model) return;

    const currentCommit = await git.getCurrentCommit(repo, import.meta.env.VITE_GITHUB_BRANCH);
    const blob = await git.createBlob(repo, model.getValue());
    const tree = await git.createTree(
      repo,
      [{
        path,
        mode: "100644",
        type: "blob",
        sha: blob.sha,
      }],
      currentCommit.treeSha,
    );

    await git.createCommit(repo, import.meta.env.VITE_GITHUB_BRANCH, tree.data.sha, currentCommit.commitSha);
    setOpenFilePane(false);
  };

  const formPath = (form: FilePaneFieldValues) => form.folder ? `${form.folder}/${form.filename}` : form.filename;

  const handleDocSave = async (form: FilePaneFieldValues) => {
    const path = formPath(form).replace(`${DOC_PATH}/`, "");
    await handleSave(DOC_REPO, path);
    navigate(`/${DOC_PATH}/${path}`);
  };

  const handleLibSave = async (form: FilePaneFieldValues) => {
    const path = formPath(form);
    await handleSave(LIB_REPO, path);
    navigate(`/${path}`);
  };

  useEffect(() => {
    if (!git) return;

    if (path === undefined) {
      const uid = v4();
      const uri = monaco.Uri.file(uid);
      const model = monaco.editor.createModel(`use prelude`, 'nat', uri);
      setModel(model);
      return;
    }

    const uri = monaco.Uri.file(path);
    const model = monaco.editor.getModel(uri);

    if (model) {
      setModel(model);
      return;
    }

    (async () => {
      const content = root === CORE_DIR
        ? (await runtime.getFile(path)).content
        : root === DOC_REPO
          ? await git.getContent(DOC_REPO, path.replace(DOC_PATH, ""))
          : await git.getContent(LIB_REPO, path);
      const model = monaco.editor.createModel(content, 'nat', uri);

      setModel(model);
    })();
  }, [path, git]);

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
      {githubAuth && root !== CORE_DIR && <Button onClick={handleSaveClick}>save</Button>}
      <Button onClick={handleEvaluateClick}>evaluate</Button>
    </Header>
    <div className="Editor">
      <DndContext onDragMove={handleDragMove} onDragStart={handleDragStart} onDragEnd={handleDragEnd} modifiers={[restrictToHorizontalAxis]}>
        <Navigation style={{ flexBasis: vw(layoutDims.nav) }} />

        <Draggable id={DRAGGABLE_ELEMENTS.NAV_COL} className={`AccessColumn ${navColDragging ? " dragging" : ""}`}>
          <div />
        </Draggable>

        <Editor model={model}
          onChange={(value => {
            (async () => {
              if (!path) return;
              console.log(path);
              await runtime.setFile(path, value);
            })();
          })}
          onKeyDown={e => {
            if (e.metaKey && e.keyCode == 3) {
              if (!path) return;

              runtime.interpret(abs(path));
              e.stopPropagation();
            }
          }}
        />

        <Draggable id={DRAGGABLE_ELEMENTS.CANVAS_COL} className={`AccessColumn ${canvasColDragging ? " dragging" : ""}`}>
          <div />
        </Draggable>
        <Canvas file={canvasFile} style={{ width: vw(layoutDims.canvas) }} />

        {openFilePane && <FilePane onSubmit={root === DOC_PATH ? handleDocSave : handleLibSave} files={libFiles} path={path} />}
      </DndContext>
    </div>
  </>;
};

export default Library;