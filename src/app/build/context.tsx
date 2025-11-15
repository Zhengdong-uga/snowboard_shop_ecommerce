"use client";

import { createContext, ReactNode, useMemo } from "react";

type CustomizerControlsContext = {};

const defaultContext: CustomizerControlsContext = {};

const CustomizerControlsContext = createContext(defaultContext);

type CustomizerControlsProviderProps = {
  children?: ReactNode;
};

export function CustomizerControlsProvider({
  children,
}: CustomizerControlsProviderProps) {
  const value = useMemo<CustomizerControlsContext>(() => {
    return {};
  }, []);

  return (
    <CustomizerControlsContext.Provider value={value}>
      {children}
    </CustomizerControlsContext.Provider>
  );
}
