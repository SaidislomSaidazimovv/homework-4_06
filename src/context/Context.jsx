import { createContext, useReducer } from "react";

export const Context = createContext();

export const ApiContextReducer = ({ children }) => {
  return (
    <Context.Provider>{children}</Context.Provider>
  );
};
