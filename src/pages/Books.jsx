import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
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
  InputAdornment,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { styled } from '@mui/material/styles';
import MotionWrapper from "../components/MotionWrapper";
import Header from "../components/Header";

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

// Flip Card stilleri
const FlipCard = styled(Box)({
  perspective: '1000px',
  width: 200,
  height: 300,
  margin: 'auto',
});
const FlipCardInner = styled(Box)(({ flipped }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  transition: 'transform 0.6s',
  transformStyle: 'preserve-3d',
  transform: flipped ? 'rotateY(180deg)' : 'none',
}));
const FlipCardFront = styled(Box)({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  background: '#1e1e1e',
  borderRadius: 8,
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
});
const FlipCardBack = styled(Box)({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  background: '#232323',
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
  borderRadius: 8,
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  transform: 'rotateY(180deg)',
  padding: '1rem',
});

const Books = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [flippedIndex, setFlippedIndex] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    // Favorileri localStorage'dan yükle
    if (user && user.email) {
      const storedFavorites = localStorage.getItem(`favorites_${user.email}`);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      } else {
        setFavorites([]);
      }
    }
  }, [user, navigate]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          searchQuery
        )}&maxResults=6`
      );
      const data = await response.json();
      setBooks(data.items || []);
    } catch (error) {
      console.error("Kitap arama hatası:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addFavorite = (book) => {
    if (!favorites.some((fav) => fav.id === book.id)) {
      const updated = [...favorites, book];
      setFavorites(updated);
      if (user && user.email) {
        localStorage.setItem(`favorites_${user.email}`, JSON.stringify(updated));
      }
    }
  };

  const handleLogout = async () => { await logout(); navigate('/login'); };

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
          <MotionWrapper>
            <Box sx={{ mb: 4 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Kitap adı, yazar veya konu ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        variant="contained"
                        onClick={handleSearch}
                        disabled={isLoading}
                      >
                        Ara
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {books.length > 0 && (
              <>
                <Typography variant="h5" sx={{ mb: 2 ,color: "#90caf9"}}>
                  Arama Sonuçları
                </Typography>
                <Grid container spacing={4} justifyContent="center">
                  {Array.from({ length: 6 }).map((_, idx) => {
                    const book = books[idx];
                    if (!book) {
                      // Boş placeholder kart
                      return (
                        <Grid item xs={12} sm={6} md={4} key={idx}>
                          <Box sx={{ width: 200, height: 300, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1, opacity: 0.2 }} />
                        </Grid>
                      );
                    }
                    const isFav = favorites.some((fav) => fav.id === book.id);
                    return (
                      <Grid item xs={12} sm={6} md={4} key={book.id}>
                        <FlipCard
                          onMouseEnter={() => setFlippedIndex(idx)}
                          onMouseLeave={() => setFlippedIndex(null)}
                        >
                          <FlipCardInner flipped={flippedIndex === idx ? 1 : 0}>
                            <FlipCardFront>
                              <Box sx={{ width: '100%', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', borderBottom: 1, borderColor: 'divider', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                                <CardMedia
                                  component="img"
                                  image={book.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/120x160?text=No+Image"}
                                  alt={book.volumeInfo.title}
                                  sx={{ width: 120, height: 160, objectFit: 'cover', mx: 'auto' }}
                                />
                              </Box>
                              <CardContent sx={{ width: '100%', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', p: 2 }}>
                                <Typography variant="subtitle1" color="text.secondary" fontWeight={800} noWrap sx={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {book.volumeInfo.title}
                                </Typography>
                                <Typography variant="body3" color="text.secondary" noWrap sx={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {book.volumeInfo.authors?.join(", ") || "Bilinmeyen Yazar"}
                                </Typography>
                              </CardContent>
                            </FlipCardFront>
                            <FlipCardBack>
                              {isFav ? (
                                <Typography color="secondary" fontWeight={600}>Favorilerde</Typography>
                              ) : (
                                <Button variant="contained" color="secondary" onClick={() => addFavorite(book)}>
                                  Favorilere Ekle
                                </Button>
                              )}
                              <Button 
                                variant="outlined" 
                                color="primary"
                                onClick={() => handleBookDetails(book)}
                              >
                                Detaylar
                              </Button>
                            </FlipCardBack>
                          </FlipCardInner>
                        </FlipCard>
                      </Grid>
                    );
                  })}
                </Grid>
              </>
            )}
          </MotionWrapper>
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

export default Books; 