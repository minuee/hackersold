import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import "styles/global.css";

import { RecoilRoot } from "recoil";
import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import { theme } from "./styles";

ReactDOM.render(
  <RecoilRoot>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </RecoilRoot>,
  document.getElementById("root"),
);
reportWebVitals();
