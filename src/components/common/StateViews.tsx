import CircularProgress from "@mui/material/CircularProgress";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

export const LoadingState = ({ label = "Loading..." }: { label?: string }) => (
  <div className="flex flex-col items-center gap-3 py-14 text-ink-muted" role="status">
    <CircularProgress size={34} thickness={4.5} sx={{ color: "#e85d04" }} />
    <p className="text-sm">{label}</p>
  </div>
);

interface EmptyStateProps {
  title: string;
  hint?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({ title, hint, actionLabel, onAction }: EmptyStateProps) => {
  // A "clear search" action means the list is empty because of the search, not because nothing exists
  const isSearch = actionLabel?.toLowerCase().includes("search");
  const Icon = isSearch ? SearchOffRoundedIcon : Inventory2OutlinedIcon;

  return (
    <div className="flex flex-col items-center px-4 py-14 text-center">
      <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl border border-gold/40 bg-cream text-saffron-deep">
        <Icon sx={{ fontSize: 32 }} />
      </div>
      <p className="text-xl font-semibold text-maroon">{title}</p>
      {hint && <p className="mt-1 max-w-md text-sm text-ink-muted">{hint}</p>}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className={
            isSearch
              ? "mt-5 rounded-xl border border-gold/60 px-5 py-2.5 font-semibold text-maroon transition hover:bg-cream"
              : "sv-btn-primary mt-5 flex items-center gap-1.5 px-5 py-2.5"
          }
        >
          {!isSearch && <AddRoundedIcon fontSize="small" />}
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export const ErrorState = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div className="flex flex-col items-center rounded-2xl border border-red-200 bg-red-50 px-4 py-10 text-center" role="alert">
    <ErrorOutlineRoundedIcon sx={{ fontSize: 36 }} className="mb-2 text-red-600" />
    <p className="font-medium text-red-700">{message}</p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-xl border border-red-300 px-4 py-2 text-red-700 transition hover:bg-red-100"
      >
        Try again
      </button>
    )}
  </div>
);
