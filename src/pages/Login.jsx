import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      let errorMessage = "Giriş yapılırken bir hata oluştu.";
      if (err.code === "auth/user-not-found") {
        errorMessage = "Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı.";
      } else if (err.code === "auth/wrong-password") {
        errorMessage = "Hatalı şifre.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Geçersiz e-posta adresi.";
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
          py: 4,
        }}
      >
        <Container maxWidth="sm">
    <motion.div
            initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
            <Paper
              elevation={24}
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                bgcolor: "background.paper",
                borderRadius: 2,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <LockOutlinedIcon />
              </Box>

              <Typography component="h1" variant="h4" sx={{ mb: 3 }}>
                Giriş Yap
              </Typography>

              {error && (
                <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleLogin} sx={{ width: "100%" }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="E-posta Adresi"
                  name="email"
                  autoComplete="email"
                  autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
                <TextField
                  margin="normal"
          required
                  fullWidth
                  name="password"
                  label="Şifre"
          type="password"
                  id="password"
                  autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
        />
                <Button
          type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, py: 1.5 }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Giriş Yap"
                  )}
                </Button>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
          Hesabın yok mu?{" "}
                    <Link
                      to="/register"
                      style={{
                        color: darkTheme.palette.primary.main,
                        textDecoration: "none",
                      }}
                    >
            Kayıt Ol
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Paper>
    </motion.div>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
