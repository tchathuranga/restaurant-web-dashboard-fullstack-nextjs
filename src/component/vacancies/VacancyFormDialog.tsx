"use client";

import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import FormContainer from "@/component/common/FormContainer";
import Field from "@/component/common/Field";
import Editor from "@/component/common/Editor";
import { useToast } from "@/component/common/Toast";
import { Vacancy } from "@/interfaces/vacancy";
import { createVacancy, updateVacancy } from "@/services/vacancyService";

interface VacancyFormDialogProps {
  open: boolean;
  vacancy: Vacancy | null;
  onClose: () => void;
  onSaved: () => void;
}

const TYPES = ["Full-time", "Part-time"];

const VacancyFormDialog = ({ open, vacancy, onClose, onSaved }: VacancyFormDialogProps) => {
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [session, setSession] = useState(0);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    setTitle(vacancy?.title || "");
    setLocation(vacancy?.location || "");
    setType(vacancy?.type || "");
    setDescription(vacancy?.description || "");
    setErrors({});
    setSession((s) => s + 1); // remounts the editor so it shows this vacancy's text
  }, [open, vacancy]);

  const handleSave = async () => {
    const next: Record<string, string> = {};
    if (!title.trim()) next.title = "Please enter the job title";
    if (!location.trim()) next.location = "Please enter where the job is based";
    if (!type) next.type = "Please choose the job type";
    if (!description.replace(/<[^>]*>/g, "").trim()) next.description = "Please describe the role";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    const payload = { title: title.trim(), location: location.trim(), type, description };
    const result = vacancy?._id ? await updateVacancy(vacancy._id, payload) : await createVacancy(payload);
    setSaving(false);

    if (!result.success) {
      toast.error(result.error || "Could not save the vacancy. Please try again");
      return;
    }
    toast.success(vacancy?._id ? "Vacancy updated" : "Vacancy published");
    onSaved();
    onClose();
  };

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="sm">
      <FormContainer
        title={vacancy ? "Edit vacancy" : "Add a vacancy"}
        actionLabel={vacancy ? "Save changes" : "Publish"}
        saving={saving}
        onSave={handleSave}
        onDiscard={onClose}
      >
        <Field label="Job title" htmlFor="vacancy-title" required error={errors.title}>
          <input id="vacancy-title" type="text" autoFocus className="sv-input" placeholder="e.g. Head Chef" value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>

        <Field label="Location" htmlFor="vacancy-location" required error={errors.location}>
          <input id="vacancy-location" type="text" className="sv-input" placeholder="e.g. Colombo 05" value={location} onChange={(e) => setLocation(e.target.value)} />
        </Field>

        <Field label="Job type" htmlFor="vacancy-type" required error={errors.type}>
          <select id="vacancy-type" className="sv-input" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="" disabled>Select type</option>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>

        <Field label="Description" required error={errors.description} hint="Use the toolbar for bullet points and bold text">
          <Editor key={session} initialValue={description} onChange={setDescription} />
        </Field>
      </FormContainer>
    </Dialog>
  );
};

export default VacancyFormDialog;
