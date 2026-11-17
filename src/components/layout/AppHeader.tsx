import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, Button, Container, IconButton, Toolbar, Typography } from "@mui/material";
import { useState } from 'react';
import { Link, NavLink } from "react-router";
import { navItems } from '../../navigation';
import { MobileNav } from './MobileNav';
import ThemeToggle from "./ThemeToggle";

export const AppHeader = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = () => setDrawerOpen(true);

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      <AppBar position="sticky">
        <Container>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Open navigation menu"
              edge="start"
              sx={{ display: { xs: "flex", md: "none" } }}
              onClick={openDrawer}
              aria-expanded={drawerOpen}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              sx={{ color: "inherit", textDecoration: "none", mr: 1 }}
              component={Link}
              to="/">
              Shad's Cycleworks
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              {navItems.map((item) => (
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
                  key={item.to}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
            <ThemeToggle />
          </Toolbar>
        </Container>
      </AppBar>
      <MobileNav open={drawerOpen} onClose={closeDrawer} />
    </>
  )
}
