import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
  ThemeProvider,
  createTheme,
  AppBar,
  Toolbar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import Header from "../components/Header";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";

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

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Çıkış yapılırken hata oluştu:", error);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    if (user && user.email) {
      const storedFavorites = localStorage.getItem(`favorites_${user.email}`);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      } else {
        setFavorites([]);
      }
    }
  }, [user, navigate]);

  const removeFavorite = (bookId) => {
    const updatedFavorites = favorites.filter((book) => book.id !== bookId);
    setFavorites(updatedFavorites);
    if (user && user.email) {
      localStorage.setItem(`favorites_${user.email}`, JSON.stringify(updatedFavorites));
    }
  };

  const handleBookDetails = (book) => {
    setSelectedBook(book);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBook(null);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}>
        <Header onLogout={handleLogout} />

        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <AnimatePresence>
            {favorites.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Box
                  sx={{
                    textAlign: "center",
                    py: 8,
                    px: 2,
                  }}
                >
                  <FavoriteIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
                  <Typography variant="h5" color="text.secondary" gutterBottom>
                    Henüz favori kitabınız yok
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Kitap aramak için geri dönün ve kitapları favorilerinize ekleyin.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/books")}
                  >
                    Kitapları Keşfet
                  </Button>
                </Box>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Grid container spacing={4}>
                  {favorites.map((book) => (
                    <Grid item xs={12} sm={6} md={4} key={book.id}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          sx={{
                            width: 200,
                            height: 320,
                            display: "flex",
                            flexDirection: "column",
                            bgcolor: "background.paper",
                            position: "relative",
                            overflow: "hidden",
                            mx: "auto",
                          }}
                        >
                          <Box
                            sx={{
                              width: "100%",
                              height: 200,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              bgcolor: "background.default",
                            }}
                          >
                            <CardMedia
                              component="img"
                              image={book.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/120x160?text=No+Image"}
                              alt={book.volumeInfo.title}
                              sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                                p: 1,
                              }}
                            />
                          </Box>
                          <CardContent sx={{ flexGrow: 1, p: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <Typography variant="subtitle1" fontWeight={600} noWrap sx={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {book.volumeInfo.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {book.volumeInfo.authors?.join(", ") || "Bilinmeyen Yazar"}
                            </Typography>
                          </CardContent>
                          <Divider />
                          <CardActions sx={{ justifyContent: "space-between", p: 1 }}>
                            <Button
                              size="small"
                              startIcon={<InfoIcon />}
                              onClick={() => handleBookDetails(book)}
                            >
                              Detaylar
                            </Button>
                            <IconButton
                              size="small"
                              color="secondary"
                              onClick={() => removeFavorite(book.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </CardActions>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            )}
          </AnimatePresence>
        </Container>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          {selectedBook && (
            <>
              <DialogTitle>
                <Typography variant="h6">{selectedBook.volumeInfo.title}</Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {selectedBook.volumeInfo.authors?.join(", ") || "Bilinmeyen Yazar"}
                </Typography>
              </DialogTitle>
              <DialogContent>
                <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                  <CardMedia
                    component="img"
                    image={selectedBook.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/120x160?text=No+Image"}
                    alt={selectedBook.volumeInfo.title}
                    sx={{ width: 120, height: 180, objectFit: "cover" }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" paragraph>
                      {selectedBook.volumeInfo.description || "Açıklama bulunmuyor."}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {selectedBook.volumeInfo.categories?.map((category) => (
                        <Chip
                          key={category}
                          label={category}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Kapat</Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default Favorites;
