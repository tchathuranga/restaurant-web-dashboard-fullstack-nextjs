"use client";

import Dialog from "@mui/material/Dialog";

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
  <Dialog open={open} onClose={busy ? undefined : onCancel} PaperProps={{ sx: { borderRadius: "1.25rem" } }}>
    <div className="p-6 max-w-md">
      <h2 className="text-2xl font-bold text-maroon mb-2">{title}</h2>
      <p className="mb-6 text-ink-muted">{message}</p>
      <div className="flex justify-end gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={onCancel}
          className="px-5 py-2 rounded-xl border border-gold/60 text-ink hover:bg-cream transition disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={onConfirm}
          className="px-5 py-2 rounded-xl bg-red-700 text-white font-semibold hover:bg-red-600 transition disabled:opacity-60"
        >
          {busy ? "Deleting..." : confirmLabel}
        </button>
      </div>
    </div>
  </Dialog>
);

export default ConfirmDialog;
