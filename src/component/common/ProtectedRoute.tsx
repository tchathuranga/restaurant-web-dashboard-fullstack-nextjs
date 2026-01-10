"use client"

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import { CircularProgress, Box } from "@mui/material";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Wait for component to mount and Redux to initialize
    if (!isMounted || isLoading) {
      return;
    }

    // Don't protect the login page - allow access
    if (pathname === "/login") {
      return;
    }

    // If not authenticated and not on login page, redirect to login
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, isMounted, pathname, router]);

  // Show loading spinner while checking authentication or during initial mount
  if (!isMounted || isLoading) {
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

  // If on login page, always show it (no protection needed)
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // If not authenticated, show loading while redirect happens
  if (!isAuthenticated) {
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

  // User is authenticated, render children
  return <>{children}</>;
}

