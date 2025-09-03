import { AnchorResp, CodeblockResp, TexResp, NatResp, TextResp, MarkdownResp } from "@nat-lang/nat";
import { Endpoints as OctoEndpoints } from "@octokit/types";
import { editor } from "monaco-editor";

export type RepoFileArray = OctoEndpoints["GET /repos/{owner}/{repo}/git/trees/{tree_sha}"]["response"]["data"]["tree"];
export type RepoFile = RepoFileArray[0];

type Stamped<T> = T & { id: string; order: number; };

export type StampedTextResp = Stamped<TextResp>;
export type StampedTexResp = Stamped<TexResp>;
export type StampedMarkdownResp = Stamped<MarkdownResp>;
export type StampedAnchorResp = Stamped<AnchorResp>;
export type StampedCodeblockResp = Stamped<CodeblockResp>;
export type StampedPdfResp = StampedTexResp & { pdf: string; };

export type StampedNatResp = Stamped<NatResp>;

export type OutletContext = { ctxModel: editor.ITextModel | null };