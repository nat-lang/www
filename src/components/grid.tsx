import { DndContext, DragEndEvent, DragMoveEvent, DragStartEvent } from "@dnd-kit/core";
import { FunctionComponent, ReactNode, useState } from "react";
import { px2vw } from "../utilities";
import { DRAGGABLE_ELEMENTS, LayoutDims, MIN_EDITOR_VW, MIN_NAV_VW, defaultLayoutDims } from "../config";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import Draggable from "./draggable";

type GridProps = {
  left: (dims: LayoutDims) => ReactNode;
  center: (dims: LayoutDims) => ReactNode;
  right: (dims: LayoutDims) => ReactNode;
}

const Grid: FunctionComponent<GridProps> = ({ left, center, right }) => {
  const [navColDragging, setNavColDragging] = useState<boolean>(false);
  const [canvasColDragging, setCanvasColDragging] = useState<boolean>(false);
  const [_, setPrevDragEvent] = useState<DragMoveEvent | null>(null);
  const [layoutDims, setLayoutDims] = useState<LayoutDims>(defaultLayoutDims);

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

  return <DndContext onDragMove={handleDragMove} onDragStart={handleDragStart} onDragEnd={handleDragEnd} modifiers={[restrictToHorizontalAxis]}>
    {left(layoutDims)}

    <Draggable id={DRAGGABLE_ELEMENTS.NAV_COL} className={`AccessColumn ${navColDragging ? " dragging" : ""}`}>
      <div />
    </Draggable>

    {center(layoutDims)}

    <Draggable id={DRAGGABLE_ELEMENTS.CANVAS_COL} className={`AccessColumn ${canvasColDragging ? " dragging" : ""}`}>
      <div />
    </Draggable>
    {right(layoutDims)}
  </DndContext>
};

export default Grid;