import { useCallback, useState } from "react";
import { FilePaneFieldValues } from "../components/filepane";
import Git, { Repo } from "../service/git";
import { editor } from "monaco-editor";

const usePersistence = (git: Git | null, model: editor.ITextModel | null, repo: Repo) => {
  const [saving, setSaving] = useState(false);
  const formPath = (form: FilePaneFieldValues) => form.folder ? `${form.folder}/${form.filename}` : form.filename;
  const save = useCallback(async (form: FilePaneFieldValues) => {
    console.log(git, model);
    if (!git) return;
    if (!model) return;
    setSaving(true);
    console.log(1);
    const path = formPath(form);
    console.log(2);
    await git.commitFileChange(path, model.getValue(), repo, import.meta.env.VITE_GITHUB_BRANCH);
    setSaving(false);
  }, [git, model]);

  return { save, saving };
};

export default usePersistence;