"use client";

import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import FormContainer from "@/component/common/FormContainer";
import Field from "@/component/common/Field";
import Editor from "@/component/common/Editor";
import ImagePicker from "@/component/common/ImagePicker";
import { useToast } from "@/component/common/Toast";
import { News } from "@/interfaces/News";
import { createNews, updateNews } from "@/services/newsService";
import { uploadNewsImageToCloudinary } from "@/services/uploadService";

interface NewsFormDialogProps {
  open: boolean;
  news: News | null;
  onClose: () => void;
  onSaved: () => void;
}

const NewsFormDialog = ({ open, news, onClose, onSaved }: NewsFormDialogProps) => {
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [session, setSession] = useState(0);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    setTitle(news?.title || "");
    setDescription(news?.description || "");
    setImage(news?.image || "");
    setFile(null);
    setErrors({});
    setSession((s) => s + 1);
  }, [open, news]);

  const handleSave = async () => {
    const next: Record<string, string> = {};
    if (!title.trim()) next.title = "Please enter a headline";
    if (!description.replace(/<[^>]*>/g, "").trim()) next.description = "Please write the news text";
    if (!file && !image) next.image = "Please add a picture";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    try {
      let imageUrl = image;
      if (file) {
        const upload = await uploadNewsImageToCloudinary(file);
        if (!upload.success || !upload.url) {
          toast.error(upload.error || "The image could not be uploaded. Please try again");
          return;
        }
        imageUrl = upload.url;
      }

      const payload = { title: title.trim(), description, image: imageUrl };
      const result = news?._id ? await updateNews(news._id, payload) : await createNews(payload);
      if (!result.success) {
        toast.error(result.error || "Could not save the news. Please try again");
        return;
      }
      toast.success(news?._id ? "News updated" : "News published");
      onSaved();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="sm">
      <FormContainer
        title={news ? "Edit news" : "Add news"}
        actionLabel={news ? "Save changes" : "Publish"}
        saving={saving}
        onSave={handleSave}
        onDiscard={onClose}
      >
        <Field label="Headline" htmlFor="news-title" required error={errors.title}>
          <input id="news-title" type="text" autoFocus className="sv-input" placeholder="e.g. Now open in Wattala!" value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>

        <Field label="News text" required error={errors.description}>
          <Editor key={session} initialValue={description} onChange={setDescription} />
        </Field>

        <Field label="Picture" required error={errors.image}>
          <ImagePicker
            currentUrl={image}
            file={file}
            onFileChange={(f) => {
              setFile(f);
              setErrors((e) => ({ ...e, image: "" }));
            }}
            onReject={(message) => setErrors((e) => ({ ...e, image: message }))}
            onClearCurrent={() => setImage("")}
          />
        </Field>
      </FormContainer>
    </Dialog>
  );
};

export default NewsFormDialog;
