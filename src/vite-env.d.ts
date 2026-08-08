/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RELEASE_CHANNEL?: 'production' | 'prototype';
  readonly VITE_RESULTS_VARSITY_BOYS_SOCCER_URL?: string;
  readonly VITE_RESULTS_VARSITY_GIRLS_SOCCER_URL?: string;
  readonly VITE_RESULTS_VARSITY_BOYS_VOLLEYBALL_URL?: string;
  readonly VITE_RESULTS_VARSITY_GIRLS_VOLLEYBALL_URL?: string;
  readonly VITE_RESULTS_SMP_BOYS_BASKETBALL_URL?: string;
  readonly VITE_RESULTS_SMP_GIRLS_BASKETBALL_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
