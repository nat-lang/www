import { AnchorResp, CodeblockResp, TexResp, NatResp, TextResp } from "@nat-lang/nat";
import { Endpoints as OctoEndpoints } from "@octokit/types";

export type RepoFileArray = OctoEndpoints["GET /repos/{owner}/{repo}/git/trees/{tree_sha}"]["response"]["data"]["tree"];
export type RepoFile = RepoFileArray[0];

type Stamped<T> = T & { id: string; order: number; };

export type StampedTextResp = Stamped<TextResp>;
export type StampedTexResp = Stamped<TexResp>;
export type StampedAnchorResp = Stamped<AnchorResp>;
export type StampedCodeblockResp = Stamped<CodeblockResp>;

export type StampedNatResp = Stamped<NatResp>;

type Typeset<T> = T & { pdf: string; };

export type TypesetTexResp = Typeset<StampedTexResp>;
export type TypesetAnchorResp = Typeset<StampedAnchorResp>;

export type TypesetResp = Typeset<StampedTexResp> | Typeset<StampedAnchorResp>;
