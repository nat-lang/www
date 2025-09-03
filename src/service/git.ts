import { OctokitOptions } from "@octokit/core";
import { Endpoints } from "@octokit/types";
import { Octokit } from "octokit";

const ORG = import.meta.env.VITE_GITHUB_ORG, REPO = import.meta.env.VITE_GITHUB_REPO;

class Git {
  octo: Octokit;
  org: string;
  repo: string;
  branch: string;

  constructor(octoOpts: OctokitOptions = {}, org: string = ORG) {
    this.octo = new Octokit(octoOpts);
    this.org = org;
    this.repo = REPO;
    this.branch = import.meta.env.VITE_GITHUB_BRANCH;
  }

  async getCurrentCommit(branch: string) {
    const { data: refData } = await this.octo.rest.git.getRef({
      owner: this.org,
      repo: this.repo,
      ref: `heads/${branch}`,
    })
    const commitSha = refData.object.sha
    const { data: commitData } = await this.octo.rest.git.getCommit({
      owner: this.org,
      repo: this.repo,
      commit_sha: commitSha,
    })
    return {
      commitSha,
      treeSha: commitData.tree.sha,
    }
  }

  getContent = async (path: string) => {
    const resp = await this.octo.rest.repos.getContent({
      owner: 'nat-lang',
      repo: this.repo,
      path,
      ref: this.branch
    });

    if (Array.isArray(resp.data))
      throw Error(`Unexpected file type: directory.`);
    if (resp.data.type !== "file")
      throw Error(`Unexpected file type: ${resp.data.type}`);
    return atob(resp.data.content);
  }

  getRepo = () => this.octo.rest.git.getTree({
    owner: this.org,
    repo: this.repo,
    tree_sha: this.branch,
    recursive: "true"
  });

  createTree = (
    tree: Endpoints["POST /repos/{owner}/{repo}/git/trees"]["parameters"]["tree"],
    baseTree: Endpoints["POST /repos/{owner}/{repo}/git/trees"]["parameters"]["base_tree"],
  ) => this.octo.rest.git.createTree({
    owner: this.org,
    repo: this.repo,
    tree,
    base_tree: baseTree
  });

  getUser = () => this.octo.rest.users.getAuthenticated();
  getUserEmails = () => this.octo.rest.users.listPublicEmailsForAuthenticatedUser();

  updateRef = (branch: string, commitSha: string) => this.octo.rest.git.updateRef({
    owner: this.org,
    repo: this.repo,
    ref: `heads/${branch}`,
    sha: commitSha,
  })

  createCommit = async (branch: string, newTreeSha: string, currentCommitSha: string) => {
    const user = await this.getUser();
    const email = await this.getUserEmails();

    if (!user.data.name) throw new Error("Can't commit without user name.");
    if (email.data.length < 1) throw new Error("Can't commit without user email.");

    const commit = this.octo.rest.git.createCommit({
      owner: this.org,
      repo: this.repo,
      message: (new Date()).toString(),
      tree: newTreeSha,
      author: {
        name: user.data.name,
        email: email.data[0].email
      },
      parents: [currentCommitSha]
    });

    return this.updateRef(branch, (await commit).data.sha);
  }

  createBlob = async (content: string) => {
    const blobData = await this.octo.rest.git.createBlob({
      owner: this.org,
      repo: this.repo,
      content,
      encoding: 'utf-8',
    })
    return blobData.data
  }

  commitFileChange = async (path: string, content: string, branch: string) => {
    const currentCommit = await this.getCurrentCommit(branch);

    const blob = await this.createBlob(content);
    const tree = await this.createTree(
      [{
        path,
        mode: "100644",
        type: "blob",
        sha: blob.sha,
      }],
      currentCommit.treeSha,
    );
    await this.createCommit(branch, tree.data.sha, currentCommit.commitSha);
  }
}

export default Git;