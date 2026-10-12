"use client";

import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import FormContainer from "@/component/common/FormContainer";
import Field from "@/component/common/Field";
import ImagePicker from "@/component/common/ImagePicker";
import { useToast } from "@/component/common/Toast";
import { ICategory } from "@/interfaces/Category";
import { IItem } from "@/interfaces/Items";
import { createItem, updateItem } from "@/services/itemService";
import { uploadMenuImageToCloudinary } from "@/services/uploadService";

interface ItemFormDialogProps {
  open: boolean;
  /** Item being edited; null when adding */
  item: IItem | null;
  categories: ICategory[];
  /** Category preselected when adding (the filter currently chosen) */
  defaultCategory?: string;
  onClose: () => void;
  onSaved: () => void;
}

const ItemFormDialog = ({ open, item, categories, defaultCategory, onClose, onSaved }: ItemFormDialogProps) => {
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [image, setImage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; category?: string; image?: string }>({});

  // Fill the form each time the dialog opens
  useEffect(() => {
    if (!open) return;
    setTitle(item?.title || "");
    setCategory(item?.category || defaultCategory || "");
    setSubcategory(item?.subcategory || "");
    setImage(item?.image || "");
    setFile(null);
    setErrors({});
  }, [open, item, defaultCategory]);

  const handleSave = async () => {
    const next: typeof errors = {};
    if (!title.trim()) next.title = "Please enter the name of the dish";
    if (!category) next.category = "Please choose a category";
    if (!file && !image) next.image = "Please add a photo of the dish";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    try {
      let imageUrl = image;
      if (file) {
        const upload = await uploadMenuImageToCloudinary(file, category);
        if (!upload.success || !upload.url) {
          toast.error(upload.error || "The image could not be uploaded. Please try again");
          return;
        }
        imageUrl = upload.url;
      }

      const payload = {
        title: title.trim(),
        category,
        subcategory: subcategory || undefined,
        image: imageUrl,
      };
      const result = item?._id
        ? await updateItem(item._id, payload)
        : await createItem({ ...payload, description: "null", price: "null", imageAlt: "null" });

      if (!result.success) {
        toast.error(result.error || "Could not save the item. Please try again");
        return;
      }
      toast.success(item?._id ? `"${payload.title}" updated` : `"${payload.title}" added to the menu`);
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
        title={item ? "Edit menu item" : "Add a menu item"}
        actionLabel={item ? "Save changes" : "Add item"}
        saving={saving}
        onSave={handleSave}
        onDiscard={onClose}
      >
        <Field label="Dish name" htmlFor="item-title" required error={errors.title}>
          <input
            id="item-title"
            type="text"
            autoFocus
            maxLength={100}
            placeholder="e.g. Masala Dosa"
            className="sv-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>

        <Field label="Category" htmlFor="item-category" required error={errors.category}>
          <select
            id="item-category"
            className="sv-input"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSubcategory("");
            }}
          >
            <option value="" disabled>Select a category</option>
            {categories.map(({ name }) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </Field>

        <Field
          label="Subcategory"
          htmlFor="item-subcategory"
          hint={category ? "Leave on auto-detect unless the dish ends up in the wrong group" : "Choose a category first"}
        >
          <select
            id="item-subcategory"
            className="sv-input"
            value={subcategory}
            disabled={!category}
            onChange={(e) => setSubcategory(e.target.value)}
          >
            <option value="">Auto-detect from the dish name</option>
            {(categories.find((c) => c.name === category)?.subcategories || []).map(({ name }) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </Field>

        <Field label="Photo" required error={errors.image}>
          <ImagePicker
            currentUrl={image}
            file={file}
            onFileChange={(f) => {
              setFile(f);
              setErrors((e) => ({ ...e, image: undefined }));
            }}
            onReject={(message) => setErrors((e) => ({ ...e, image: message }))}
            onClearCurrent={() => setImage("")}
          />
        </Field>
      </FormContainer>
    </Dialog>
  );
};

export default ItemFormDialog;
