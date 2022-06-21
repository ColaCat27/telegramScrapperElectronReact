import React from "react";
import ReactDom from "react-dom";

import App from "./App";
import { AuthContextProvider } from "./context/authContext";
import { SnackbarProvider } from "notistack";
import { SettingsContextProvider } from "./context/settingsContext";

ReactDom.render(
  <AuthContextProvider>
    <SnackbarProvider>
      <SettingsContextProvider>
        <App />
      </SettingsContextProvider>
    </SnackbarProvider>
  </AuthContextProvider>,

  document.getElementById("root")
);
