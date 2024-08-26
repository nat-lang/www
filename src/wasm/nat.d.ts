
/// <reference types="emscripten" />

enum InterpretResult {
  INTERPRET_OK,
  INTERPRET_COMPILE_ERROR,
  INTERPRET_RUNTIME_ERROR
}

export interface NatModule extends EmscriptenModule {
  cwrap: typeof cwrap;

  interpretSource(path: string, source: string): InterpretResult;
}

export default function createModule(mod?: any): Promise<NatModule>;