
import Module from './wasm/nat.js';

const interpret = (path: string, source: string) => Module().then(mod => {
  const fn = mod.cwrap('vmInterpretSource', 'number', ['string', 'string']);
  return fn(path, source);
});

const compile = async (path: string, source: string) => {
  let out = "";

  const nat = await Module({ print: (stdout: string) => out += stdout });
  const fn = nat.cwrap('vmNLS', 'string', ['string', 'string']);

  let z = fn(path, source);
  console.log(z);

  return JSON.parse(out);
};

export {
  interpret,
  compile
}