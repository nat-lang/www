

/// <reference types="emscripten" />

declare module "service/nat/wasm/nat.js"

enum InterpretResult {
  INTERPRET_OK,
  INTERPRET_COMPILE_ERROR,
  INTERPRET_RUNTIME_ERROR
}

export interface NatModule extends EmscriptenModule {
  cwrap: typeof cwrap;
  FS: typeof FS;

  vmInterpretSource(path: string, source: string): InterpretResult;
}

export = EmscriptenModuleFactory<NatModule>;

