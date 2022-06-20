import { createContext, useReducer } from "react";

const defaultValues = ["firstName", "lastName", "username", "phone"];

const INITIAL_STATE = {
  notifications: false,
  targetValues: defaultValues,
};

export const settingsContext = createContext(INITIAL_STATE);

const SettingsReducer = (state, action) => {
  switch (action.type) {
    case "settings":
      return {
        notifications: action.payload.notifications,
        targetValues: action.payload.targetValues,
      };
    case "default":
      return {
        notifications: false,
        targetValues: defaultValues,
      };
    default:
      return state;
  }
};

export const SettingsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(SettingsReducer, INITIAL_STATE);

  return (
    <SettingsContext.Provider
      value={{
        notifications: state.notifications,
        targetValues: state.targetValues,
        dispatch,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
