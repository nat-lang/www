import { create } from 'zustand';
import { StampedCodeblockResp, StampedTextResp, TypesetResp } from '../types';
import { RefObject } from 'react';

export type CanvasObj = TypesetResp | StampedCodeblockResp | StampedTextResp;
type Ref = RefObject<HTMLDivElement | null | undefined>;
type AnchorRef = Ref & {
  path: string;
  order: number;
  inView: boolean;
};

export interface CanvasCtx {
  objects: Record<string, CanvasObj[]>;
  observer: IntersectionObserver | null;
  pageRef: Ref | null;
  canvasRef: Ref | null;
  anchorRefs: Record<string, AnchorRef>;
  addObj: (path: string, obj: CanvasObj) => void;
  delObjs: (path: string) => void;
  setAnchorRef: (path: string, AnchorRef: AnchorRef) => void;
  delAnchorRef: (path: string) => void;
  setAnchorRefInView: (path: string, inView: boolean) => void;
  setPageRef: (ref: Ref) => void;
  delPageRef: () => void;
  setCanvasRef: (ref: Ref) => void;
  delCanvasRef: () => void;
  setObserver: (io: IntersectionObserver | null) => void;
}

const assertRefAtPath = (state: CanvasCtx, path: string) => {
  if (!state.anchorRefs[path])
    throw new Error(`No anchor ref at '${path}'.`);
}

const useCanvasCtx = create<CanvasCtx>()(set => ({
  objects: {},
  anchorRefs: {},
  canvasRef: null,
  pageRef: null,
  observer: null,

  addObj: (path, obj) => set(state => ({ objects: { ...state.objects, [path]: [obj, ...state.objects[path]] } })),
  delObjs: (path) => set(state => ({ objects: { ...state.objects, [path]: [] } })),

  setAnchorRef: (path, ref) => set(state => ({ anchorRefs: { ...state.anchorRefs, [path]: ref } })),
  delAnchorRef: (path) => set(state => {
    assertRefAtPath(state, path);
    delete state.anchorRefs[path];
    return state;
  }),

  setAnchorRefInView: (path, inView) => set(state => {
    assertRefAtPath(state, path);
    return { ...state, anchorRefs: { ...state.anchorRefs, [path]: { ...state.anchorRefs[path], inView } } }
  }),

  setPageRef: pageRef => set(_ => ({ pageRef })),
  delPageRef: () => set(_ => ({ pageRef: null })),
  setCanvasRef: canvasRef => set(_ => ({ canvasRef })),
  delCanvasRef: () => set(_ => ({ canvasRef: null })),
  setObserver: io => set(_ => ({ observer: io })),
}));

export default useCanvasCtx;