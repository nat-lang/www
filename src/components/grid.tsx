import "./grid.css";
import { DndContext, DragEndEvent, DragMoveEvent, DragStartEvent } from "@dnd-kit/core";
import { FunctionComponent, ReactNode, useState } from "react";
import { px2vw } from "../utilities";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import Draggable from "./draggable";
import useDimsCtx, { Dims } from "../context/dims";
import { useShallow } from "zustand/react/shallow";

export const MIN_COL_VW = 1;

const COLS = {
  LEFT: "LEFT_COL",
  RIGHT: "RIGHT_COL"
};

type GridProps = {
  left: (dims: Dims) => ReactNode;
  center: (dims: Dims) => ReactNode;
  right: (dims: Dims) => ReactNode;
}

const Grid: FunctionComponent<GridProps> = ({ left, center, right }) => {
  const { setDims, ...dims } = useDimsCtx(useShallow(({ setDims, left, right, center }) => ({ setDims, left, right, center })));
  const [leftColDragging, setleftColDragging] = useState<boolean>(false);
  const [rightColDragging, setrightColDragging] = useState<boolean>(false);
  const [prevDrag, setPrevDragEvent] = useState<DragMoveEvent | null>(null);

  const handleDragMove = (e: DragMoveEvent) => {
    const diff = px2vw(prevDrag ? e.delta.x - prevDrag.delta.x : e.delta.x);

    setDims(({ left, center, right }) => {
      const staticCenter = {
        left: left + diff,
        center: MIN_COL_VW,
        right: 100 - (left + diff + MIN_COL_VW)
      };

      switch (e.active.id) {
        case COLS.LEFT: {
          const next = { left: left + diff, center: center - diff, right };

          // moving to the right.
          if (diff > 0) {
            if (center <= MIN_COL_VW && right <= MIN_COL_VW)
              return { left, center, right };
            if (center <= MIN_COL_VW)
              return staticCenter;
            return next;
          }
          // to the left.
          if (left <= MIN_COL_VW)
            return { left, center, right };
          return next;
        }
        case COLS.RIGHT: {
          const next = { left, center: center + diff, right: right - diff };

          // moving to the left.
          if (diff < 0) {
            if (center <= MIN_COL_VW && left <= MIN_COL_VW)
              return { left, center, right };
            if (center <= MIN_COL_VW)
              return staticCenter;
            return next;
          }
          // to the right.
          if (right <= MIN_COL_VW)
            return { left, center, right };
          return next
        }
      }
      throw Error("Unexpected dragged element.");
    });
    setPrevDragEvent(e);
  };

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
    {left(dims)}

    <Draggable id={COLS.LEFT} className={`GridColumn ${leftColDragging ? " dragging" : ""}`}>
      <div />
    </Draggable>

    {center(dims)}

    <Draggable id={COLS.RIGHT} className={`GridColumn ${rightColDragging ? " dragging" : ""}`}>
      <div />
    </Draggable>

    {right(dims)}
  </DndContext>
};

export default Grid;