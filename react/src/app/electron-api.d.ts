// src/electron-api.d.ts
export interface ElectronAPI {
  getKlientet: () => Promise<any>;
  createKlient: (data: any) => Promise<void>;
  // add all other API functions here
}

// Tell TypeScript that window.api exists
declare global {
  interface Window {
    api: ElectronAPI;
  }
}
