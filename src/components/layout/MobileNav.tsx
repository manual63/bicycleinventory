import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material";
import { NavLink } from "react-router";
import { navItems } from "../../navigation";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
}

export const MobileNav = ({ open, onClose }: MobileNavProps) => {
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ width: 280 }}>
        <Typography variant="h6" sx={{ p: 2 }}>Shad's Cycleworks</Typography>
        <Divider />
        <List>
          {navItems.map((item) => {
            return (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  component={NavLink}
                  to={item.to}
                  sx={{ "&.active": { bgcolor: "action.selected" } }}
                  onClick={onClose}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      </Box>
    </Drawer>
  )
}
