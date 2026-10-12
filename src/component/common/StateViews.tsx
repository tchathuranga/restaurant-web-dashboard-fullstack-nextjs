import CircularProgress from "@mui/material/CircularProgress";

export const LoadingState = ({ label = "Loading..." }: { label?: string }) => (
  <div className="flex flex-col items-center gap-3 py-12 text-ink-muted" role="status">
    <CircularProgress size={32} sx={{ color: "#e85d04" }} />
    <p>{label}</p>
  </div>
);

interface EmptyStateProps {
  title: string;
  hint?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({ title, hint, actionLabel, onAction }: EmptyStateProps) => (
  <div className="text-center py-12 px-4">
    <p className="text-xl font-semibold text-maroon">{title}</p>
    {hint && <p className="text-sm text-ink-muted mt-1">{hint}</p>}
    {actionLabel && onAction && (
      <button type="button" onClick={onAction} className="sv-btn-primary px-5 py-2.5 mt-5">
        {actionLabel}
      </button>
    )}
  </div>
);

export const ErrorState = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div className="text-center py-10 px-4 bg-red-50 rounded-xl" role="alert">
    <p className="text-red-700 font-medium">{message}</p>
    {onRetry && (
      <button type="button" onClick={onRetry} className="mt-4 px-4 py-2 rounded-xl border border-red-300 text-red-700 hover:bg-red-100 transition">
        Try again
      </button>
    )}
  </div>
);
