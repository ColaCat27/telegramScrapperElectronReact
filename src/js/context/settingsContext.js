import React, { createContext, useEffect, useReducer } from "react";

const defaultSettings = {
  notifications: false,
  language: "eng",
  theme: "dark",
};

const INITIAL_STATE = {
  settings: JSON.parse(localStorage.getItem("settings")) || defaultSettings,
};

const SettingsContext = createContext(INITIAL_STATE);

const SettingsReducer = (state, action) => {
  switch (action.type) {
    case "SETTINGS":
      return {
        settings: action.payload,
      };
    default:
      return state;
  }
};

export const SettingsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(SettingsReducer, INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(state.settings));
  }, [state.settings]);

  return (
    <SettingsContext.Provider
      value={{
        settings: state,
        dispatch,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
