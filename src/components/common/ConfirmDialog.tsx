"use client";

import Dialog from "@mui/material/Dialog";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({ open, title, message, confirmLabel = "Delete", busy, onConfirm, onCancel }: ConfirmDialogProps) => (
  <Dialog open={open} onClose={busy ? undefined : onCancel} maxWidth="xs" fullWidth>
    <div className="p-6 text-center sm:p-7">
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-600 ring-8 ring-red-50/60">
        <DeleteForeverRoundedIcon sx={{ fontSize: 30 }} />
      </div>
      <h2 className="mb-2 text-2xl font-bold text-maroon">{title}</h2>
      <p className="mb-6 text-sm text-ink-muted">{message}</p>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          disabled={busy}
          onClick={onCancel}
          className="rounded-xl border border-gold/60 px-5 py-2.5 font-medium text-ink transition hover:bg-cream disabled:opacity-50"
        >
          Keep it
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={onConfirm}
          className="rounded-xl bg-red-700 px-5 py-2.5 font-semibold text-white shadow-md transition hover:bg-red-600 disabled:opacity-60"
        >
          {busy ? "Deleting..." : confirmLabel}
        </button>
      </div>
    </div>
  </Dialog>
);

export default ConfirmDialog;
