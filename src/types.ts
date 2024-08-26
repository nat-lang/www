import { Endpoints as OctoEndpoints } from "@octokit/types";

export type RepoFileTree = OctoEndpoints["GET /repos/{owner}/{repo}/git/trees/{tree_sha}"]["response"]["data"]["tree"];

export type RepoFile = RepoFileTree[0];