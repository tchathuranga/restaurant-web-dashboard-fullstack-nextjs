"use client"

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { signout, sessionRestored } from "@/redux/slice/authSlice";
import { CircularProgress, Box } from "@mui/material";

function FullPageSpinner() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <CircularProgress />
    </Box>
  );
}

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const [sessionChecked, setSessionChecked] = useState(false);

  // The remembered login can outlive the server session (expiry, sign-out in another tab),
  // so drop it when the server no longer recognises the cookie.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then(async (response) => {
        if (response.status === 401) {
          dispatch(signout());
        } else if (response.ok) {
          const result = await response.json();
          dispatch(sessionRestored(result.data.username));
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setSessionChecked(true);
      });
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  useEffect(() => {
    if (!sessionChecked || isLoading || pathname === "/login") {
      return;
    }
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, sessionChecked, pathname, router]);

  if (!sessionChecked) {
    return <FullPageSpinner />;
  }

  // The login page is always reachable
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // Not signed in: keep showing the spinner while the redirect happens
  if (!isAuthenticated) {
    return <FullPageSpinner />;
  }

  return <>{children}</>;
}
