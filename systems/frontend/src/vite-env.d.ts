/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_BACKEND_HOST: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
