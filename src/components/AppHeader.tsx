import { AppBar, Button, Toolbar, Typography } from "@mui/material"
import ThemeToggle from "./ThemeToggle";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

type AppHeaderProps = {
  onAddBike: () => void;
};

const AppHeader = ({onAddBike} : AppHeaderProps) => {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>Bike Inventory</Typography>
        <ThemeToggle />
        <Button
          startIcon={<AddOutlinedIcon />}
          variant="outlined"
          color="inherit"
          onClick={onAddBike}
        >
            Add Bike
          </Button>
      </Toolbar>
    </AppBar>
  )
}

export default AppHeader;