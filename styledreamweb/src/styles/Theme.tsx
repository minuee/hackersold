import { createMuiTheme } from "@material-ui/core/styles";

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#000",
      contrastText: "#fff",
    },
    secondary: {
      main: "#fff",
      contrastText: "#000",
    },
    text: {
      primary: "#000",
      secondary: "#999",
    },

    divider: "#eee",
  },

  props: {
    MuiButton: {
      variant: "contained",
    },
    MuiTextField: {
      variant: "outlined",
      FormHelperTextProps: {
        style: { display: "none" },
      },
    },
    MuiSelect: {
      variant: "outlined",
    },
  },

  overrides: {
    MuiButton: {
      contained: {
        backgroundColor: "#fff",
        color: "#000",
        border: "solid 1px #bbb",
      },
      containedPrimary: {
        color: "#fff",
      },
    },
    MuiTextField: {
      root: {
        backgroundColor: "#fff",
      },
    },
    MuiDivider: {
      root: {
        height: "2px",
      },
    },
  },

  typography: {
    fontFamily: "'Noto Sans KR', sans-serif",

    h1: { fontWeight: 400 },
    h2: { fontWeight: 400 },
    h3: { fontWeight: 400 },
    h4: { fontWeight: 400 },
    h5: { fontWeight: 400 },
    h6: { fontWeight: 400 },
    caption: { color: "red" },
  },
});
