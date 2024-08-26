/// <reference types="emscripten" />

Module['onRuntimeInitialized'] = function () {
  // Just Module._add() will work, but I'm just demontrating usage of cwrap
  Module['add'] = cwrap('add', 'number', ['number', 'number']);
}
