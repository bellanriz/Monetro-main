/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WALLET_ISAC?: string;
  readonly VITE_WALLET_ALISYA?: string;
  readonly VITE_WALLET_NADINE?: string;
  readonly VITE_WALLET_MOM?: string;
  readonly VITE_WALLET_DAD?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
