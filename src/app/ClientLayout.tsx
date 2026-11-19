"use client";
import { ThemeProvider } from "@mui/material/styles";
import { Providers } from "@/redux/provider";
import LayoutWrapper from "@/components/common/LayoutWrapper";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { ToastProvider } from "@/components/common/Toast";
import theme from "@/theme/theme";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <Providers>
        <ToastProvider>
          <ProtectedRoute>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </ProtectedRoute>
        </ToastProvider>
      </Providers>
    </ThemeProvider>
  );
}
