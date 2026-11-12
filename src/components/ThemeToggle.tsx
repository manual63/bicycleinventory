import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { IconButton, useColorScheme } from "@mui/material";

const ThemeToggle = () => {
  const { mode, systemMode, setMode } = useColorScheme();

  const currentMode = mode === "system" ? systemMode : mode;

  const alternateMode = () => {
    setMode(currentMode === "dark" ? "light" : "dark");
  }

  if (!currentMode) return null;

  return (
    <IconButton
      aria-label={`Switch to ${currentMode === "dark" ? "light" : "dark"} mode`}
      onClick={alternateMode}
    >
      {currentMode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
}

export default ThemeToggle;