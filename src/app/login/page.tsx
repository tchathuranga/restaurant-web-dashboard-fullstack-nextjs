"use client";

import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { signin } from "@/redux/slice/authSlice";
import Image from "next/image";

const HIGHLIGHTS = ["Update the menu and prices", "Post news and promotions", "Manage branches and banners"];

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

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
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_15%_20%,rgba(232,195,106,0.25),transparent_35%),radial-gradient(circle_at_85%_80%,rgba(232,93,4,0.18),transparent_35%),linear-gradient(135deg,#fff8f0,#f8ede3)] p-4">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-[1.75rem] border border-gold/40 bg-ivory shadow-[0_30px_70px_rgba(74,18,32,0.22)] md:grid-cols-[1fr_1.1fr]">
        {/* Welcome panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-maroon via-maroon-deep to-[#2e0b14] p-10 text-ivory md:flex">
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[repeating-conic-gradient(rgba(232,195,106,0.18)_0deg_6deg,transparent_6deg_18deg)] [mask:radial-gradient(circle,transparent_30%,#000_31%,#000_70%,transparent_71%)]" />
          <div>
            <div className="inline-block rounded-2xl bg-ivory px-4 py-3 shadow-lg">
              <Image src="/images/logos/logo.png" alt="Sri Vihar" width={220} height={72} className="h-auto w-48" priority />
            </div>
            <h1 className="mt-8 text-4xl font-bold leading-tight text-ivory">Welcome back</h1>
            <p className="mt-2 text-sm text-ivory/75">Everything on the Sri Vihar website is managed from here.</p>
          </div>

          <ul className="relative mt-10 space-y-3">
            {HIGHLIGHTS.map((text) => (
              <li key={text} className="flex items-center gap-3 text-sm text-ivory/90">
                <span className="h-2 w-2 rotate-45 bg-gold-soft" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* Form */}
        <div className="p-7 sm:p-10">
          <div className="mb-6 text-center md:hidden">
            <Image src="/images/logos/logo.png" alt="Sri Vihar" width={220} height={72} className="mx-auto h-auto w-44" priority />
          </div>

          <div className="mb-1 h-1 w-12 rounded-full bg-gradient-to-r from-saffron to-gold" />
          <h2 className="text-3xl font-bold text-maroon">Sign in</h2>
          <p className="mb-6 mt-1 text-sm text-ink-muted">Use your Sri Vihar admin account.</p>

          <form onSubmit={handleSubmit}>
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
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineRoundedIcon sx={{ color: "#c9a227" }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyUp={(e) => setCapsLock(e.getModifierState("CapsLock"))}
              disabled={isLoading}
              helperText={capsLock ? "Caps Lock is on" : " "}
              slotProps={{
                formHelperText: { sx: { color: "#c2410c", fontWeight: 500 } },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: "#c9a227" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((show) => !show)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                py: 1.5,
                fontSize: "1rem",
                background: "linear-gradient(135deg, #e85d04, #c2410c)",
                boxShadow: "0 10px 22px rgba(194, 65, 12, 0.28)",
                "&:hover": { background: "linear-gradient(135deg, #c2410c, #9a3412)" },
              }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
