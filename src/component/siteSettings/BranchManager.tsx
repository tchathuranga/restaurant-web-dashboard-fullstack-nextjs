"use client";

import { useCallback, useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import FormContainer from "@/component/common/FormContainer";
import Field from "@/component/common/Field";
import RowActions from "@/component/common/RowActions";
import ConfirmDialog from "@/component/common/ConfirmDialog";
import { EmptyState, ErrorState, LoadingState } from "@/component/common/StateViews";
import { useToast } from "@/component/common/Toast";
import { IBranch } from "@/interfaces/branch";
import {
  getBranches,
  createBranch,
  updateBranch,
  deleteBranch,
  importDefaultBranches,
} from "@/services/siteService";

const EMPTY_FORM = { name: "", address: "", hours: "", phone: "", uberUrl: "", pickmeUrl: "" };
type FormState = typeof EMPTY_FORM;

const FIELDS: { key: keyof FormState; label: string; placeholder: string; required?: boolean; hint?: string }[] = [
  { key: "name", label: "Branch name", placeholder: "Sri Vihar – Nugegoda", required: true, hint: "Shown in the header menus. The footer drops the \"Sri Vihar –\" part." },
  { key: "address", label: "Address", placeholder: "280 High Level Road, Nugegoda", required: true },
  { key: "hours", label: "Opening hours", placeholder: "10:00 AM - 10:00 PM", required: true },
  { key: "phone", label: "Phone", placeholder: "+94 11 282 9298", required: true },
  { key: "uberUrl", label: "Uber Eats link", placeholder: "https://www.ubereats.com/...", hint: "Optional. Leave empty to hide Uber Eats for this branch." },
  { key: "pickmeUrl", label: "PickMe Food link", placeholder: "https://food.pickme.lk/...", hint: "Optional. Leave empty to hide PickMe for this branch." },
];

const BranchManager = () => {
  const toast = useToast();
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<IBranch | null>(null);
  const [deleting, setDeleting] = useState(false);

  const refresh = useCallback(async () => {
    const result = await getBranches();
    if (result.success) {
      setBranches(result.data || []);
      setError("");
    } else {
      setError(result.error || "Could not load branches");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setOpen(true);
  };

  const openEdit = (branch: IBranch) => {
    setEditingId(branch._id || null);
    setForm({
      name: branch.name,
      address: branch.address,
      hours: branch.hours,
      phone: branch.phone,
      uberUrl: branch.uberUrl || "",
      pickmeUrl: branch.pickmeUrl || "",
    });
    setErrors({});
    setOpen(true);
  };

  const validate = () => {
    const next: typeof errors = {};
    for (const f of FIELDS) {
      const value = form[f.key].trim();
      if (f.required && !value) next[f.key] = `Please enter the ${f.label.toLowerCase()}`;
      if ((f.key === "uberUrl" || f.key === "pickmeUrl") && value && !/^https?:\/\/\S+$/i.test(value)) {
        next[f.key] = "Enter a full link starting with https://";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setSaving(true);
    const result = editingId ? await updateBranch(editingId, form) : await createBranch(form);
    setSaving(false);

    if (!result.success) {
      toast.error(result.error || "Could not save the branch. Please try again");
      return;
    }
    toast.success(editingId ? "Branch updated. The website shows it right away." : "Branch added to the website.");
    setOpen(false);
    await refresh();
  };

  const handleDelete = async () => {
    if (!deleteTarget?._id) return;
    setDeleting(true);
    const result = await deleteBranch(deleteTarget._id);
    setDeleting(false);

    if (result.success) {
      toast.success(`"${deleteTarget.name}" deleted`);
      setDeleteTarget(null);
      await refresh();
    } else {
      toast.error(result.error || "Could not delete the branch. Please try again");
    }
  };

  const handleImport = async () => {
    const result = await importDefaultBranches();
    if (result.success) {
      toast.success("Current website branches imported. You can now edit them.");
      await refresh();
    } else {
      toast.error(result.error || "Could not import the branches");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <p className="text-sm text-ink-muted max-w-xl">
          Branch details appear on the Contact Us and Our Story pages, the footer, and the header&apos;s hours and
          &quot;Order online&quot; menus.
        </p>
        <button type="button" onClick={openAdd} className="sv-btn-primary px-5 py-2.5">
          + Add branch
        </button>
      </div>

      {loading ? (
        <LoadingState label="Loading branches..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => { setLoading(true); refresh(); }} />
      ) : branches.length === 0 ? (
        <div className="sv-panel">
          <EmptyState
            title="No branches saved yet"
            hint="The website is showing its built-in branches. Import them to start editing, or add a new one."
            actionLabel="Import current branches"
            onAction={handleImport}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {branches.map((branch) => (
            <div key={branch._id} className="sv-panel p-5 flex flex-col">
              <h3 className="text-2xl font-bold text-maroon">{branch.name}</h3>
              <dl className="mt-3 text-sm text-ink grid gap-1.5">
                <div><dt className="inline font-semibold">Address: </dt><dd className="inline">{branch.address}</dd></div>
                <div><dt className="inline font-semibold">Hours: </dt><dd className="inline">{branch.hours}</dd></div>
                <div><dt className="inline font-semibold">Phone: </dt><dd className="inline">{branch.phone}</dd></div>
                <div className="truncate"><dt className="inline font-semibold">Uber Eats: </dt><dd className="inline">{branch.uberUrl || <span className="text-gray-400">not set</span>}</dd></div>
                <div className="truncate"><dt className="inline font-semibold">PickMe: </dt><dd className="inline">{branch.pickmeUrl || <span className="text-gray-400">not set</span>}</dd></div>
              </dl>
              <RowActions
                className="mt-4 pt-3 border-t border-gold/30"
                onEdit={() => openEdit(branch)}
                onDelete={() => setDeleteTarget(branch)}
              />
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onClose={saving ? undefined : () => setOpen(false)} fullWidth maxWidth="sm">
        <FormContainer
          title={editingId ? "Edit branch" : "Add a branch"}
          actionLabel={editingId ? "Save changes" : "Add branch"}
          saving={saving}
          onSave={handleSave}
          onDiscard={() => setOpen(false)}
        >
          {FIELDS.map((field, index) => (
            <Field key={field.key} label={field.label} htmlFor={`branch-${field.key}`} required={field.required} hint={field.hint} error={errors[field.key]}>
              <input
                id={`branch-${field.key}`}
                type="text"
                autoFocus={index === 0}
                className="sv-input"
                placeholder={field.placeholder}
                value={form[field.key]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
              />
            </Field>
          ))}
        </FormContainer>
      </Dialog>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete this branch?"
        message={`"${deleteTarget?.name ?? ""}" will disappear from every page of the website.`}
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default BranchManager;
