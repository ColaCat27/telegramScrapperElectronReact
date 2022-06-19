import React from "react";
import ReactDom from "react-dom";

import App from "./App";
import { AuthContextProvider } from "./context/authContext";
import { SnackbarProvider } from "notistack";

ReactDom.render(
  <AuthContextProvider>
    <SnackbarProvider>
      <App />
    </SnackbarProvider>
  </AuthContextProvider>,

  document.getElementById("root")
);
