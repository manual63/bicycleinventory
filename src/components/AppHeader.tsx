import { AppBar, Toolbar, Typography } from "@mui/material";
import AddBikeButton from "./AddBikeButton";
import ThemeToggle from "./ThemeToggle";

type AppHeaderProps = {
  onAddBike: () => void;
};

const AppHeader = ({ onAddBike }: AppHeaderProps) => {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>Bike Inventory</Typography>
        <ThemeToggle />
        <AddBikeButton onClick={onAddBike} variant="outlined" color="inherit" />
      </Toolbar>
    </AppBar>
  )
}

export default AppHeader;
