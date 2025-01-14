import { v4 } from 'uuid';
import initialize, { NatModule } from './wasm/nat';

type StdOutHandler = (stdout: string) => void;

class Config {
  stdOutHandlers: { [key: string]: StdOutHandler };

  constructor() {
    this.stdOutHandlers = {};
  }

  print = (stdout: string) => Object.values(this.stdOutHandlers).forEach(handler => handler(stdout));

  printErr = (stderr: string) => {
    console.error(stderr);
  }

  onStdout = (handler: StdOutHandler) => {
    let uid = v4();

    this.stdOutHandlers[uid] = handler;

    return () => {
      delete this.stdOutHandlers[uid];
    };
  }
};

let conf = new Config();
let mod: NatModule;

const useM = async () => {
  if (!mod) mod = await initialize({
    print: conf.print,
    printErr: conf.printErr
  });
  return mod;
}

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

export const CORE_DIR = "core", SRC_DIR = "src";

const interpret = (path: string, source: string) => useM().then((mod: NatModule) => {
  const fn = mod.cwrap('vmInterpretSource', 'number', ['string', 'string']);
  return fn(path, source);
});

const compile = async (path: string, source: string): Promise<Compilation> => {
  let out = "";
  let nat: NatModule = await useM();
  let unregister = conf.onStdout((stdout: string) => out += stdout);
  let fn = nat.cwrap('vmNLS', 'string', ['string', 'string']);

  fn(path, source);
  unregister();

  return JSON.parse(out) as Compilation;
};

export type CoreFile = {
  path: string;
  content: string;
  type: "tree" | "blob";
};

const src = (path: string) => `/${SRC_DIR}/${path}`;

const getCoreFiles = async (dir = CORE_DIR) => {
  const nat: NatModule = await useM();
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
  const nat: NatModule = await useM();
  const content = nat.FS.readFile(src(`${CORE_DIR}/${path}`), { encoding: "utf8" });

  return { path, content, type: "blob" };
}

const setCoreFile = async (path: string, content: string) => {
  const nat: NatModule = await useM();

  nat.FS.writeFile(src(`${CORE_DIR}/${path}`), content, { flags: "w" });
}

export {
  interpret,
  compile,
  getCoreFiles,
  getCoreFile,
  setCoreFile
}