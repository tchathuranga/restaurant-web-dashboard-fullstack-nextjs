"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Drawer from "@mui/material/Drawer";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import LogoutIcon from "@mui/icons-material/Logout";
import { NAV_ITEMS, NavItem } from "@/constants/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { signout } from "@/redux/slice/authSlice";
import { brand } from "@/theme/theme";

export const SIDEBAR_WIDTH = 272;

const GROUPS: NavItem["group"][] = ["Content", "Website"];

interface NavBarProps {
  isMobile: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

function SidebarContent({ onNavigate }: { onNavigate: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const name = user?.name || user?.username || "Admin";

  const go = (path: string) => {
    router.push(path);
    onNavigate();
  };

  const handleSignOut = async () => {
    // Clear the server session first, otherwise /login would bounce straight back to the dashboard
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    dispatch(signout());
    router.push("/login");
    onNavigate();
  };

  return (
    <div className="flex h-full flex-col">
      <div className="px-5 pb-5 pt-6">
        <div className="rounded-2xl bg-ivory px-4 py-3 shadow-[0_8px_20px_rgba(0,0,0,0.25)]">
          <Image src="/images/logos/logo.png" alt="Sri Vihar" width={300} height={100} className="h-auto w-full" priority />
        </div>
        <p className="mt-3 text-center text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-gold-soft/80">
          Admin dashboard
        </p>
      </div>

      <div className="sv-sidebar-rule mx-5" />

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Dashboard sections">
        {GROUPS.map((group) => (
          <div key={group} className="mb-4">
            <p className="px-3 pb-2 text-[0.68rem] font-semibold uppercase tracking-[0.25em] text-ivory/45">{group}</p>
            <ul className="space-y-1">
              {NAV_ITEMS.filter((item) => item.group === group).map((item) => {
                const active = pathname === item.path;
                return (
                  <li key={item.path}>
                    <button
                      type="button"
                      onClick={() => go(item.path)}
                      aria-current={active ? "page" : undefined}
                      className={`sv-nav-item ${active ? "sv-nav-item-active" : ""}`}
                    >
                      <span className="sv-nav-icon">{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="m-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
        <Avatar sx={{ width: 38, height: 38, bgcolor: brand.saffron, fontWeight: 700, fontSize: "1rem" }}>
          {name.charAt(0).toUpperCase()}
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ivory">{name}</p>
          <p className="text-xs text-ivory/55">Signed in</p>
        </div>
        <Tooltip title="Sign out" arrow>
          <button
            type="button"
            onClick={handleSignOut}
            aria-label="Sign out"
            className="grid h-9 w-9 place-items-center rounded-xl text-ivory/75 transition hover:bg-saffron hover:text-ivory"
          >
            <LogoutIcon fontSize="small" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}

// Deep maroon sidebar: fixed on desktop, a slide-out drawer on phones and tablets
export default function NavBar({ isMobile, mobileOpen, onMobileClose }: NavBarProps) {
  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? mobileOpen : true}
      onClose={onMobileClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: isMobile ? 0 : SIDEBAR_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: SIDEBAR_WIDTH,
          boxSizing: "border-box",
          border: "none",
          color: brand.ivory,
          background: `radial-gradient(circle at 20% 0%, rgba(232, 195, 106, 0.16), transparent 40%), linear-gradient(180deg, ${brand.maroon} 0%, ${brand.maroonDeep} 55%, ${brand.maroonNight} 100%)`,
          boxShadow: "6px 0 24px rgba(46, 11, 20, 0.18)",
        },
      }}
    >
      <SidebarContent onNavigate={isMobile ? onMobileClose : () => undefined} />
    </Drawer>
  );
}
