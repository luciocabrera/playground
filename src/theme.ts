import { createTheme } from "@mui/material/styles";

export const playgroundTheme = createTheme({
  palette: {
    primary: { main: "#c4492c", contrastText: "#fffaf3" },
    text: { primary: "#221e1a", secondary: "#6b635a" },
    divider: "#e4d9c8",
    background: { paper: "#fffdf9", default: "#f3eee4" },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: 'Outfit, "Avenir Next", "Segoe UI", sans-serif',
  },
});
