import Module from './wasm/nat.js';

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

const interpret = (path: string, source: string) => Module().then(mod => {
  const fn = mod.cwrap('vmInterpretSource', 'number', ['string', 'string']);
  return fn(path, source);
});

const compile = async (path: string, source: string): Promise<Compilation> => {
  let out = "";

  const nat = await Module({ print: (stdout: string) => out += stdout });
  const fn = nat.cwrap('vmNLS', 'string', ['string', 'string']);

  fn(path, source);

  return JSON.parse(out) as Compilation;
};

export {
  interpret,
  compile
}