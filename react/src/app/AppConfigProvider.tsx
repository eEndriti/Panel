import React, { useEffect, useState } from "react";
import { AppConfigContext } from "./AppConfigContext";
import { callApi } from "./services/callApi";

export const AppConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [pdfSavePath, setPdfSavePath] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadConfig = async () => {
    try {
      const config = await callApi.loadDBConfig();
      setPdfSavePath(config?.pdfSavePath ?? null);
    } catch (err) {
      console.error("Failed to load app config:", err);
      setPdfSavePath(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);



  return (
    <AppConfigContext.Provider
      value={{
        pdfSavePath,
        loading,
        reloadConfig: loadConfig,
      }}
    >
      {children}
    </AppConfigContext.Provider>
  );
};
