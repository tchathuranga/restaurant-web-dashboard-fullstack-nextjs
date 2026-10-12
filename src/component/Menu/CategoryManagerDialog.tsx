"use client";

import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import RowActions from "@/component/common/RowActions";
import ConfirmDialog from "@/component/common/ConfirmDialog";
import { useToast } from "@/component/common/Toast";
import { ICategory } from "@/interfaces/Category";
import {
  createCategory,
  createSubcategory,
  deleteCategory,
  deleteSubcategory,
  renameCategory,
  renameSubcategory,
} from "@/services/categoryService";

interface CategoryManagerDialogProps {
  open: boolean;
  categories: ICategory[];
  onClose: () => void;
  /** Called after any change so the menu can reload */
  onChanged: () => void | Promise<void>;
}

type DeleteTarget = { kind: "category" | "subcategory"; id: string; name: string };

// Inline "type a name and press Enter" field used for adding and renaming
const NameForm = ({
  initial = "",
  placeholder,
  submitLabel,
  busy,
  onSubmit,
  onCancel,
}: {
  initial?: string;
  placeholder: string;
  submitLabel: string;
  busy: boolean;
  onSubmit: (name: string) => void;
  onCancel?: () => void;
}) => {
  const [value, setValue] = useState(initial);
  return (
    <form
      className="flex flex-wrap gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim() && !busy) onSubmit(value.trim());
      }}
    >
      <input
        className="sv-input flex-1 min-w-40"
        autoFocus={!!onCancel}
        placeholder={placeholder}
        maxLength={100}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit" disabled={busy || !value.trim()} className="sv-btn-primary px-4 py-2 disabled:opacity-60">
        {submitLabel}
      </button>
      {onCancel && (
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-xl border border-gold/60 text-ink hover:bg-cream">
          Cancel
        </button>
      )}
    </form>
  );
};

const CategoryManagerDialog = ({ open, categories, onClose, onChanged }: CategoryManagerDialogProps) => {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  // Which row is being renamed: "c:<id>" or "s:<id>"
  const [editing, setEditing] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  const run = async (action: () => Promise<{ success: boolean; error?: string }>, done: string) => {
    setBusy(true);
    const result = await action();
    setBusy(false);
    if (!result.success) {
      toast.error(result.error || "Something went wrong. Please try again");
      return false;
    }
    toast.success(done);
    setEditing(null);
    await onChanged();
    return true;
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { kind, id, name } = deleteTarget;
    await run(
      () => (kind === "category" ? deleteCategory(id) : deleteSubcategory(id)),
      `"${name}" deleted`
    );
    setDeleteTarget(null); // on failure the toast explains why (e.g. dishes still use it)
  };

  return (
    <Dialog open={open} onClose={busy ? undefined : onClose} fullWidth maxWidth="md">
      <div className="bg-ivory p-5 sm:p-8 border-t-4 border-gold">
        <h2 className="text-3xl font-bold text-maroon text-center mb-1">Manage categories</h2>
        <p className="text-sm text-ink-muted text-center mb-6">
          Renaming moves the dishes with it. A category or subcategory can only be deleted once it has no dishes.
        </p>

        <div className="mb-6">
          <NameForm
            key={categories.length}
            placeholder="New category, e.g. Starters"
            submitLabel="Add category"
            busy={busy}
            onSubmit={(name) => run(() => createCategory(name), `"${name}" category added`)}
          />
        </div>

        <div className="grid gap-4">
          {categories.map((category) => (
            <div key={category._id} className="sv-panel p-4">
              {editing === `c:${category._id}` ? (
                <NameForm
                  initial={category.name}
                  placeholder="Category name"
                  submitLabel="Save"
                  busy={busy}
                  onCancel={() => setEditing(null)}
                  onSubmit={(name) => run(() => renameCategory(category._id, name), "Category renamed")}
                />
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-xl font-bold text-maroon">{category.name}</h3>
                  <RowActions
                    onEdit={() => setEditing(`c:${category._id}`)}
                    onDelete={() => setDeleteTarget({ kind: "category", id: category._id, name: category.name })}
                  />
                </div>
              )}

              <div className="mt-3 pl-3 border-l-2 border-gold/40 grid gap-2">
                {category.subcategories.length === 0 && (
                  <p className="text-sm text-ink-muted">No subcategories yet.</p>
                )}
                {category.subcategories.map((sub) =>
                  editing === `s:${sub._id}` ? (
                    <NameForm
                      key={sub._id}
                      initial={sub.name}
                      placeholder="Subcategory name"
                      submitLabel="Save"
                      busy={busy}
                      onCancel={() => setEditing(null)}
                      onSubmit={(name) => run(() => renameSubcategory(sub._id, name), "Subcategory renamed")}
                    />
                  ) : (
                    <div key={sub._id} className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-ink">{sub.name}</span>
                      <RowActions
                        onEdit={() => setEditing(`s:${sub._id}`)}
                        onDelete={() => setDeleteTarget({ kind: "subcategory", id: sub._id, name: sub.name })}
                      />
                    </div>
                  )
                )}
                <NameForm
                  key={`${category._id}-${category.subcategories.length}`}
                  placeholder={`New subcategory in ${category.name}`}
                  submitLabel="Add"
                  busy={busy}
                  onSubmit={(name) => run(() => createSubcategory(category._id, name), `"${name}" added`)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="px-6 py-2.5 rounded-xl border border-maroon text-maroon font-semibold hover:bg-maroon hover:text-ivory transition disabled:opacity-50"
          >
            Done
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title={`Delete this ${deleteTarget?.kind ?? "category"}?`}
        message={
          deleteTarget?.kind === "category"
            ? `"${deleteTarget.name}" and all its subcategories will be removed. This can't be undone.`
            : `"${deleteTarget?.name ?? ""}" will be removed. This can't be undone.`
        }
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Dialog>
  );
};

export default CategoryManagerDialog;
