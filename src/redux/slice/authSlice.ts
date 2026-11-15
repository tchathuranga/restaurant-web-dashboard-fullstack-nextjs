import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Credentials are checked on the server, which sets an httpOnly session cookie.
// This state only mirrors that session for the UI; it grants no access by itself.
export const signin = createAsyncThunk(
  "auth/signin",
  async (
    { username, password }: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        return rejectWithValue(result?.error || "Sign in failed");
      }
      return { username: result.data.username as string };
    } catch {
      return rejectWithValue("Could not reach the server");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // The server confirmed a valid session cookie, so adopt it even if the remembered state was lost
    sessionRestored: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = true;
      state.error = null;
      state.user = { id: action.payload, username: action.payload, email: "", name: action.payload };
    },
    signout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.error = null;
        state.user = {
          id: action.payload.username,
          username: action.payload.username,
          email: "",
          name: action.payload.username,
        };
      })
      .addCase(signin.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
        state.user = null;
      });
  },
});

export const { signout, sessionRestored } = authSlice.actions;
export default authSlice.reducer;
