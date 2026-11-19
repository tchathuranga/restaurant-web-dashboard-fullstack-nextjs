"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import NavBar from "@/components/common/NavBar";
import { findNavItem } from "@/constants/navigation";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname === "/login") {
    return <>{children}</>;
  }

  const current = findNavItem(pathname);

  return (
    <div className="flex min-h-screen">
      <NavBar isMobile={isMobile} mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Phones and tablets get a slim top bar instead of the fixed sidebar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-gold/25 bg-ivory/90 px-4 py-2.5 backdrop-blur-md md:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="grid h-10 w-10 place-items-center rounded-xl bg-maroon text-ivory shadow-md transition active:scale-95"
          >
            <MenuIcon />
          </button>
          <Image src="/images/logos/logo.png" alt="Sri Vihar" width={120} height={40} className="h-8 w-auto" />
          {current && <span className="ml-auto truncate text-sm font-semibold text-maroon">{current.label}</span>}
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
