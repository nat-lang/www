import "./grid.css";
import { DndContext, DragEndEvent, DragMoveEvent, DragStartEvent } from "@dnd-kit/core";
import { FunctionComponent, ReactNode, useState } from "react";
import { px2vw, vw } from "../utilities";
import { MIN_EDITOR_VW, MIN_NAV_VW } from "../config";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import Draggable from "./draggable";

const COLS = {
  LEFT: "LEFT_COL",
  RIGHT: "RIGHT_COL"
};

type GridDims = {
  left: number;
  center: number;
  right: number;
};

type GridProps = {
  initialDims: GridDims;
  left: (width: string) => ReactNode;
  center: (width: string) => ReactNode;
  right: (width: string) => ReactNode;
}

const Grid: FunctionComponent<GridProps> = ({ initialDims, left, center, right }) => {
  const [leftColDragging, setleftColDragging] = useState<boolean>(false);
  const [rightColDragging, setrightColDragging] = useState<boolean>(false);
  const [_, setPrevDragEvent] = useState<DragMoveEvent | null>(null);
  const [dims, setDims] = useState<GridDims>(initialDims);

  const handleDragMove = (e: DragMoveEvent) => {
    setPrevDragEvent(prevE => {
      const diff = px2vw(prevE ? e.delta.x - prevE.delta.x : e.delta.x);

      setDims(dims => {
        switch (e.active.id) {
          case COLS.LEFT: {
            let next = {
              left: dims.left + diff,
              center: dims.center - diff,
              right: dims.right
            };

            if (next.center <= MIN_EDITOR_VW) {
              next.center = MIN_EDITOR_VW;
              next.right = 100 - next.left - next.center;
            }

            return next;
          }
          case COLS.RIGHT: {
            let next = {
              left: dims.left + diff,
              center: dims.center,
              right: dims.right - diff
            };

            if (next.left <= MIN_NAV_VW) {
              next.left = MIN_NAV_VW;
              next.center = 100 - next.left - next.right;
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
      case COLS.LEFT: setleftColDragging(true); break;
      case COLS.RIGHT: setrightColDragging(true);
    }
  };
  const handleDragEnd = (e: DragEndEvent) => {
    switch (e.active.id) {
      case COLS.LEFT: setleftColDragging(false); break;
      case COLS.RIGHT: setrightColDragging(false);
    }
    setPrevDragEvent(null);
  };

  return <DndContext
    onDragMove={handleDragMove}
    onDragStart={handleDragStart}
    onDragEnd={handleDragEnd}
    modifiers={[restrictToHorizontalAxis]}
  >
    {left(vw(dims.left))}

    <Draggable id={COLS.LEFT} className={`GridColumn ${leftColDragging ? " dragging" : ""}`}>
      <div />
    </Draggable>

    {center(vw(dims.center))}

    <Draggable id={COLS.RIGHT} className={`GridColumn ${rightColDragging ? " dragging" : ""}`}>
      <div />
    </Draggable>

    {right(vw(dims.right))}
  </DndContext>
};

export default Grid;