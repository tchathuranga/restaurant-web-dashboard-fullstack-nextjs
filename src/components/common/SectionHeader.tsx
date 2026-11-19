"use client";

import { usePathname } from "next/navigation";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useAppSelector } from "@/redux/store";
import { findNavItem } from "@/constants/navigation";

interface SectionHeaderProps {
  title: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
}

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// Page banner: icon, title, what the page controls on the website, and the page's main action
const SectionHeader = ({ title, buttonLabel, onButtonClick }: SectionHeaderProps) => {
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);
  const nav = findNavItem(pathname);

  return (
    <div className="sv-hero mb-6 flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:p-7">
      <div className="flex items-start gap-4">
        {nav && <div className="sv-hero-icon">{nav.icon}</div>}
        <div className="min-w-0">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.28em] text-saffron-deep">
            {greeting()}, {user?.name || user?.username || "there"}
          </p>
          <h1 className="text-3xl font-bold leading-tight text-maroon sm:text-4xl">{title}</h1>
          {nav && <p className="mt-1 text-sm text-ink-muted">{nav.description}</p>}
        </div>
      </div>

      {buttonLabel && (
        <button
          type="button"
          onClick={onButtonClick}
          className="sv-btn-primary flex w-full items-center justify-center gap-1.5 px-5 py-3 sm:w-auto"
        >
          <AddRoundedIcon fontSize="small" />
          {buttonLabel}
        </button>
      )}
    </div>
  );
};

export default SectionHeader;
