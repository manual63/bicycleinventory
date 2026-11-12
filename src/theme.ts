import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: { main: "#2e7d32" },
        background: { default: "#f4f6f8" },
      },
    },
    dark: {
      palette: {
        primary: { main: "#66bb6a" },
      },
    },
  },
});
