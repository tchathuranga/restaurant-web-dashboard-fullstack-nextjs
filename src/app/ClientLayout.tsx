"use client";
import { Providers } from "@/redux/provider";
import LayoutWrapper from "@/components/common/LayoutWrapper";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { ToastProvider } from "@/components/common/Toast";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <ToastProvider>
        <ProtectedRoute>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </ProtectedRoute>
      </ToastProvider>
    </Providers>
  );
}
