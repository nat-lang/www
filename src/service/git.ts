import { OctokitOptions } from "@octokit/core";
import { Endpoints } from "@octokit/types";
import { Octokit } from "octokit";

export const DEFAULT_ORG = "nat-lang", LIB_REPO = "library", DOC_REPO = "docs";

class Git {
  octo: Octokit;
  org: string;
  branch: string;

  constructor(octoOpts: OctokitOptions = {}, org: string = DEFAULT_ORG) {
    this.octo = new Octokit(octoOpts);
    this.org = org;
    this.branch = import.meta.env.VITE_GITHUB_BRANCH;
  }

  async getCurrentCommit(repo: string, branch: string) {
    const { data: refData } = await this.octo.rest.git.getRef({
      owner: this.org,
      repo,
      ref: `heads/${branch}`,
    })
    const commitSha = refData.object.sha
    const { data: commitData } = await this.octo.rest.git.getCommit({
      owner: this.org,
      repo,
      commit_sha: commitSha,
    })
    return {
      commitSha,
      treeSha: commitData.tree.sha,
    }
  }

  getContent = async (repo: string, path: string) => {
    const resp = await this.octo.rest.repos.getContent({
      owner: 'nat-lang',
      repo,
      path,
      ref: this.branch
    });

    if (Array.isArray(resp.data))
      throw Error(`Unexpected file type: directory.`);
    if (resp.data.type !== "file")
      throw Error(`Unexpected file type: ${resp.data.type}`);
    return atob(resp.data.content);
  }

  getTree = (repo: string) => this.octo.rest.git.getTree({
    owner: this.org,
    repo,
    tree_sha: this.branch,
    recursive: "true"
  });

  createTree = (
    repo: string,
    tree: Endpoints["POST /repos/{owner}/{repo}/git/trees"]["parameters"]["tree"],
    baseTree: Endpoints["POST /repos/{owner}/{repo}/git/trees"]["parameters"]["base_tree"],
  ) => this.octo.rest.git.createTree({
    owner: this.org,
    repo,
    tree,
    base_tree: baseTree
  });

  getUser = () => this.octo.rest.users.getAuthenticated();
  getUserEmails = () => this.octo.rest.users.listPublicEmailsForAuthenticatedUser();

  updateRef = (repo: string, branch: string, commitSha: string) => this.octo.rest.git.updateRef({
    owner: this.org,
    repo,
    ref: `heads/${branch}`,
    sha: commitSha,
  })

  createCommit = async (repo: string, branch: string, newTreeSha: string, currentCommitSha: string) => {
    const user = await this.getUser();
    const email = await this.getUserEmails();

    if (!user.data.name) throw new Error("Can't commit without user name.");
    if (email.data.length < 1) throw new Error("Can't commit without user email.");

    const commit = this.octo.rest.git.createCommit({
      owner: this.org,
      repo,
      message: (new Date()).toString(),
      tree: newTreeSha,
      author: {
        name: user.data.name,
        email: email.data[0].email
      },
      parents: [currentCommitSha]
    });

    return this.updateRef(repo, branch, (await commit).data.sha);
  }

  createBlob = async (repo: string, content: string) => {
    const blobData = await this.octo.rest.git.createBlob({
      owner: this.org,
      repo,
      content,
      encoding: 'utf-8',
    })
    return blobData.data
  }

  commitFileChange = async (path: string, content: string, repo: string, branch: string) => {
    const currentCommit = await this.getCurrentCommit(repo, branch);
    const blob = await this.createBlob(repo, content);
    const tree = await this.createTree(
      repo,
      [{
        path,
        mode: "100644",
        type: "blob",
        sha: blob.sha,
      }],
      currentCommit.treeSha,
    );
    await this.createCommit(repo, branch, tree.data.sha, currentCommit.commitSha);
  }
}

export default Git;