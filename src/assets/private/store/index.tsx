// Libs
import React, { createContext, useContext, useReducer } from "react";
import { initialState } from "./initialState";
import { asyncDispatch } from "./middlewares";
import { rootReducer } from "./reducers";
import { ContextProps, ProviderProps } from "./types";

// Context lets us pass a value deep into the component tree
// without explicitly threading it through every component.
const GlobalContext = createContext<ContextProps>({} as ContextProps);

// global state provider
const GlobalProvider = ({ children }: ProviderProps) => {
  // holds the Provider state
  const [state, _dispatch] = useReducer(rootReducer, { ...initialState });

  // make dispatch return a Promise
  const dispatch = asyncDispatch(_dispatch, state);

  // finally app is ready, display the rest
  return (
    <GlobalContext.Provider value={{ state, dispatch }} children={children} />
  );
};

// hot loader
export default GlobalProvider;

// Function to return the current Context values
export const useGlobal = () => useContext(GlobalContext);
