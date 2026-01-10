"use client";
import { Providers } from "@/redux/provider";
import LayoutWrapper from "@/component/common/LayoutWrapper";
import ProtectedRoute from "@/component/common/ProtectedRoute";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <ProtectedRoute>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </ProtectedRoute>
    </Providers>
  );
}
