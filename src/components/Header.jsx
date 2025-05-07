import React from "react";
import { AppBar, Toolbar, Box, Button, IconButton, Typography } from "@mui/material";
import BookIcon from "@mui/icons-material/Book";
import SearchIcon from "@mui/icons-material/Search";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const navItems = [
  { label: "Ana Sayfa", path: "/dashboard" },
  { label: "Kitap Ara", path: "/books", icon: <SearchIcon /> },
  { label: "Favoriler", path: "/favorites", icon: <BookmarksIcon /> },
];

const Header = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar position="sticky" elevation={3} sx={{ bgcolor: 'background.paper', color: 'text.primary', boxShadow: 3 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <BookIcon sx={{ color: 'primary.main', fontSize: 32, mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 700, letterSpacing: 1 }}>
            KitApp
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              color={location.pathname === item.path ? 'primary' : 'inherit'}
              variant={location.pathname === item.path ? 'contained' : 'text'}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                px: 2,
                bgcolor: location.pathname === item.path ? 'primary.main' : 'transparent',
                color: location.pathname === item.path ? 'white' : 'inherit',
                boxShadow: location.pathname === item.path ? 2 : 0,
                '&:hover': {
                  bgcolor: location.pathname === item.path ? 'primary.dark' : 'action.hover',
                },
              }}
              startIcon={item.icon}
            >
              {item.label}
            </Button>
          ))}
        </Box>
        <Box>
          <IconButton color="error" onClick={onLogout} sx={{ ml: 2 }}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default Header;
