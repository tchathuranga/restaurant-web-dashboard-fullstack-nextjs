"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { signin } from "@/redux/slice/authSlice";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(signin({ username, password }));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #4a1220 0%, #6b1d2a 55%, #c2410c 100%)",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            padding: { xs: 3, sm: 5 },
            backgroundColor: "#fffdf8",
            borderTop: "4px solid #c9a227",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 4,
          }}
        >
          <Image
            src="/images/logos/logo.png"
            alt="logo"
            width={300}
            height={100}
          />

          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            fontWeight="bold"
            sx={{ color: "#6b1d2a", fontFamily: "var(--font-display), serif", textAlign: "center" }}
          >
            Sri Vihar Dashboard
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Sign in to your account
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
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
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 600,
                background: "linear-gradient(135deg, #e85d04, #c2410c)",
                "&:hover": { background: "linear-gradient(135deg, #c2410c, #9a3412)" },
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
