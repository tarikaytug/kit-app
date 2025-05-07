import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  CircularProgress,
  ThemeProvider,
  createTheme,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
} from "@mui/material";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import BookIcon from "@mui/icons-material/Book";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SearchIcon from "@mui/icons-material/Search";
import HistoryIcon from "@mui/icons-material/History";
import BookmarksIcon from '@mui/icons-material/Bookmarks';

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
});

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      setIsLoading(false);
      if (user && user.email) {
        const storedFavorites = localStorage.getItem(`favorites_${user.email}`);
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        } else {
          setFavorites([]);
        }
      }
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Çıkış yapılırken hata oluştu:", error);
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}>
        <AppBar position="sticky" elevation={3} sx={{ bgcolor: 'background.paper', color: 'text.primary', boxShadow: 3 }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <BookIcon sx={{ color: 'primary.main', fontSize: 32, mr: 1 }} />
              <Typography variant="h6" component="div" sx={{ fontWeight: 700, letterSpacing: 1 }}>
                KitApp
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                color={window.location.pathname === '/dashboard' ? 'primary' : 'inherit'}
                variant={window.location.pathname === '/dashboard' ? 'contained' : 'text'}
                onClick={() => navigate('/dashboard')}
                sx={{ borderRadius: 2, fontWeight: 600, px: 2 }}
              >
                Ana Sayfa
              </Button>
              <Button
                color={window.location.pathname === '/books' ? 'primary' : 'inherit'}
                variant={window.location.pathname === '/books' ? 'contained' : 'text'}
                onClick={() => navigate('/books')}
                sx={{ borderRadius: 2, fontWeight: 600, px: 2 }}
                startIcon={<SearchIcon />}
              >
                Kitap Ara
              </Button>
              <Button
                color={window.location.pathname === '/favorites' ? 'primary' : 'inherit'}
                variant={window.location.pathname === '/favorites' ? 'contained' : 'text'}
                onClick={() => navigate('/favorites')}
                sx={{ borderRadius: 2, fontWeight: 600, px: 2 }}
                startIcon={<BookmarksIcon />}
              >
                Favoriler
              </Button>
            </Box>
            <Box>
              <IconButton color="error" onClick={handleLogout} sx={{ ml: 2 }}>
                <LogoutIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                bgcolor: "background.paper",
                borderRadius: 2,
                mb: 4,
              }}
            >
              <Typography variant="h4" component="h1" gutterBottom>
                Hoş Geldin, {user?.displayName || "Kullanıcı"}!
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Kitap dünyasına hoş geldin! Favori kitaplarını keşfet ve okuma listeni oluştur.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 2 }}
                onClick={() => navigate("/books")}
                startIcon={<SearchIcon />}
              >
                Kitapları Keşfet
              </Button>
            </Paper>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6} sx={{ mx: "auto", width: "100%" }}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    height: "100%",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <FavoriteIcon sx={{ mr: 1, color: "secondary.main" }} />
                    <Typography variant="h6">Favori Kitapların</Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  {favorites.length > 0 ? (
                    <Grid container spacing={2}>
                      {favorites.slice(0, 3).map((book) => (
                        <Grid item xs={12} key={book.id}>
                          <Card sx={{ display: "flex", bgcolor: "background.default" }}>
                            <CardMedia
                              component="img"
                              sx={{ width: 80, height: 120 }}
                              image={book.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/80x120?text=No+Image"}
                              alt={book.volumeInfo.title}
                            />
                            <CardContent>
                              <Typography variant="subtitle1" noWrap>
                                {book.volumeInfo.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {book.volumeInfo.authors?.join(", ") || "Bilinmeyen Yazar"}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Henüz favori kitabın yok. Kitapları keşfetmeye başla!
                    </Typography>
                  )}
                  {favorites.length > 0 && (
                    <Button
                      variant="text"
                      color="primary"
                      onClick={() => navigate("/favorites")}
                      sx={{ mt: 2 }}
                    >
                      Tüm Favorileri Gör
                    </Button>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;
