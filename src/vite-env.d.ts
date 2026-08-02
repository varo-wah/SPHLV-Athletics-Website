/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RELEASE_CHANNEL?: 'production' | 'prototype';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
