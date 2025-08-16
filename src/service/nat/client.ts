import Runtime, { SRC_DIR } from '@nat-lang/nat';

const runtime = new Runtime({ rootDir: SRC_DIR });

export default runtime;
export { type CoreFile, CORE_DIR } from '@nat-lang/nat';
