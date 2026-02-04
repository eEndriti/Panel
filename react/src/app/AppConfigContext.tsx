import { createContext, useContext } from "react";

export interface AppConfigContextValue {
  pdfSavePath: string | null;
  loading: boolean;
  reloadConfig: () => Promise<void>;
}

export const AppConfigContext =
  createContext<AppConfigContextValue | undefined>(undefined);

export const useAppConfig = () => {
  const context = useContext(AppConfigContext);
  if (!context) {
    throw new Error("useAppConfig must be used inside AppConfigProvider");
  }
  return context;
};
