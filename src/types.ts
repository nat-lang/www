import { Endpoints as OctoEndpoints } from "@octokit/types";

export type RepoFileTree = OctoEndpoints["GET /repos/{owner}/{repo}/git/trees/{tree_sha}"]["response"]["data"]["tree"];

export type RepoFile = RepoFileTree[0];

export type CanvasNode = {
  children: CanvasNode[];
  name: string;
  type: string;
  tex: string;
  html?: string;
}
