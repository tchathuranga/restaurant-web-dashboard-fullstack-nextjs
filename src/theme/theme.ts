"use client";

import { createTheme } from "@mui/material/styles";

// Sri Vihar brand colours, shared with globals.css
export const brand = {
  ivory: "#fff8f0",
  paper: "#fffdf8",
  cream: "#fff1d6",
  parchment: "#f8ede3",
  saffron: "#e85d04",
  saffronDeep: "#c2410c",
  gold: "#c9a227",
  goldSoft: "#e8c36a",
  maroon: "#6b1d2a",
  maroonDeep: "#4a1220",
  maroonNight: "#2e0b14",
  peacock: "#0f5c5b",
  ink: "#2c1810",
  inkMuted: "#5c4033",
};

const bodyFont = 'var(--font-body), "Outfit", system-ui, sans-serif';
const displayFont = 'var(--font-display), "Cormorant Garamond", Georgia, serif';

// Makes MUI parts (sidebar, dialogs, tabs, inputs, toasts) match the rest of the dashboard
const theme = createTheme({
  palette: {
    primary: { main: brand.saffron, dark: brand.saffronDeep, contrastText: brand.ivory },
    secondary: { main: brand.maroon, dark: brand.maroonDeep, contrastText: brand.ivory },
    success: { main: brand.peacock },
    background: { default: brand.ivory, paper: brand.paper },
    text: { primary: brand.ink, secondary: brand.inkMuted },
    divider: "rgba(201, 162, 39, 0.3)",
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: bodyFont,
    h1: { fontFamily: displayFont, fontWeight: 700 },
    h2: { fontFamily: displayFont, fontWeight: 700 },
    h3: { fontFamily: displayFont, fontWeight: 700 },
    h4: { fontFamily: displayFont, fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: { root: { borderRadius: 12, boxShadow: "none" } },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          border: "1px solid rgba(201, 162, 39, 0.35)",
          boxShadow: "0 30px 60px rgba(46, 11, 20, 0.25)",
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: { "&:not(.MuiBackdrop-invisible)": { backgroundColor: "rgba(46, 11, 20, 0.45)", backdropFilter: "blur(3px)" } },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "#fff",
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(201, 162, 39, 0.5)" },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: brand.gold },
        },
      },
    },
    MuiTab: {
      styleOverrides: { root: { textTransform: "none", fontWeight: 600, fontSize: "0.95rem" } },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { backgroundColor: brand.maroonDeep, fontSize: "0.78rem", borderRadius: 8, padding: "6px 10px" },
        arrow: { color: brand.maroonDeep },
      },
    },
    MuiAlert: {
      styleOverrides: { root: { borderRadius: 12, fontWeight: 500 } },
    },
  },
});

export default theme;
