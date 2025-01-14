import Module, { NatModule } from './wasm/nat';

export type CompilationNode = {
  children: CompilationNode[];
  name: string;
  type: string;
  tex: string;
  html?: string;
}

export type Compilation = {
  success: boolean;
  data: CompilationNode[];
};

const interpret = (path: string, source: string) => Module().then((mod: NatModule) => {
  const fn = mod.cwrap('vmInterpretSource', 'number', ['string', 'string']);
  return fn(path, source);
});

const compile = async (path: string, source: string): Promise<Compilation> => {
  let out = "";

  const nat: NatModule = await Module({ print: (stdout: string) => out += stdout });
  const fn = nat.cwrap('vmNLS', 'string', ['string', 'string']);

  fn(path, source);

  return JSON.parse(out) as Compilation;
};

export type CoreFile = {
  path: string;
  content: string;
  type: "tree" | "blob";
};

const src = (path: string) => `src/${path}`;

const getCoreFiles = async (dir = 'core') => {
  const nat: NatModule = await Module();
  const files: CoreFile[] = [{
    path: dir,
    type: "tree",
    content: ""
  }];

  nat.FS.readdir(src(dir)).forEach(async file => {
    if ([".", ".."].includes(file)) return;

    let path = `${dir}/${file}`;
    let stat = nat.FS.stat(src(path));

    if (nat.FS.isDir(stat.mode)) {
      files.push(...await getCoreFiles(path));
    } else {
      let content = nat.FS.readFile(src(path), { encoding: "utf8" });
      files.push({ path, type: "blob", content });
    }
  });

  return files;
};

const getCoreFile = async (path: string): Promise<CoreFile> => {
  const nat: NatModule = await Module();

  console.log(src(`core/${path}`));
  const content = nat.FS.readFile(src(`core/${path}`), { encoding: "utf8" });

  return { path, content, type: "blob" };
}

export {
  interpret,
  compile,
  getCoreFiles,
  getCoreFile
}