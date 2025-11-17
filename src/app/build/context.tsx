"use client";

import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { Content } from "@prismicio/client";

type CustomizerControlsContext = {
  selectedBoard?: Content.BoardCustomizerDocumentDataBoardItem;
  setBoard: (board: Content.BoardCustomizerDocumentDataBoardItem) => void;

  selectedBindingL?: Content.BoardCustomizerDocumentDataBindinglItem;
  setBindingL: (
    BindingL: Content.BoardCustomizerDocumentDataBindinglItem
  ) => void;

  selectedBindingR?: Content.BoardCustomizerDocumentDataBindingrItem;
  setBindingR: (
    BindingR: Content.BoardCustomizerDocumentDataBindingrItem
  ) => void;
};

const defaultContext: CustomizerControlsContext = {
  setBoard: () => {},
  setBindingL: () => {},
  setBindingR: () => {},
};

const CustomizerControlsContext = createContext(defaultContext);

type CustomizerControlsProviderProps = {
  defaultBoard?: Content.BoardCustomizerDocumentDataBoardItem;
  defaultBindingL?: Content.BoardCustomizerDocumentDataBindinglItem;
  defaultBindingR?: Content.BoardCustomizerDocumentDataBindingrItem;
  children?: ReactNode;
};

export function CustomizerControlsProvider({
  defaultBoard,
  defaultBindingL,
  defaultBindingR,
  children,
}: CustomizerControlsProviderProps) {
  const [selectedBoard, setBoard] = useState(defaultBoard);
  const [selectedBindingL, setBindingL] = useState(defaultBindingL);
  const [selectedBindingR, setBindingR] = useState(defaultBindingR);

  const value = useMemo(() => {
    return {
      selectedBoard,
      setBoard,
      selectedBindingL,
      setBindingL,
      selectedBindingR,
      setBindingR,
    };
  }, [selectedBoard, selectedBindingL, selectedBindingR]);

  return (
    <CustomizerControlsContext.Provider value={value}>
      {children}
    </CustomizerControlsContext.Provider>
  );
}

export function useCustomizerControls() {
  return useContext(CustomizerControlsContext);
}
