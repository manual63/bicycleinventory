import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import { Link, NavLink } from "react-router";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { label: "Home", to: "/" },
  { label: "My Bikes", to: "/bikes" },
] as const;

const AppHeader = () => {
  return (
    <AppBar position="sticky">
      <Container>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ color: "inherit", textDecoration: "none" }}
            component={Link}
            to="/">
            Shad Bikeworks
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {navItems.map((item, key) => (
            <Button
              component={NavLink}
              to={item.to}
              color="inherit"
              sx={{
                opacity: 0.75,
                borderRadius: 0,
                borderBottom: 2,
                borderColor: "transparent",
                "&:hover": { opacity: 1 },
                "&.active": { opacity: 1, borderColor: "currentColor" },
              }}
              key={key}
            >
              {item.label}
            </Button>
          ))}
          <ThemeToggle />
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default AppHeader;
