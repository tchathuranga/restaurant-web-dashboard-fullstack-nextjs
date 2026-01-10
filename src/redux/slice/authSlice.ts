import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

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

const HARDCODED_USERS = [
  {
    id: "1",
    username: "admin",
    password: "admin123",
    email: "admin@srivihar.com",
    name: "Admin User",
  },
  {
    id: "2",
    username: "user",
    password: "user123",
    email: "user@srivihar.com",
    name: "Regular User",
  },
];

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const signin = createAsyncThunk(
  "auth/signin",
  async (
    { username, password }: { username: string; password: string },
    { rejectWithValue }
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = HARDCODED_USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      return {
        username: user.username,
        email: user.email,
        name: user.name,
      };
    } else {
      return rejectWithValue("Invalid username or password");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
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
        const hardcodedUser = HARDCODED_USERS.find(
          (u) => u.username === action.payload.username
        );
        state.user = {
          id: hardcodedUser?.id || "",
          ...action.payload,
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

export const { signout } = authSlice.actions;
export default authSlice.reducer;

