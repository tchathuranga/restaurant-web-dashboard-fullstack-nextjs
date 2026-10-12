"use client";

import { useCallback, useEffect, useState } from "react";
import ContainerBox from "@/component/common/ContainerBox";
import ConfirmDialog from "@/component/common/ConfirmDialog";
import ImagePicker from "@/component/common/ImagePicker";
import RowActions from "@/component/common/RowActions";
import { EmptyState, ErrorState, LoadingState } from "@/component/common/StateViews";
import { useToast } from "@/component/common/Toast";
import { UploadResponse } from "@/services/uploadService";

interface LibraryImage {
  _id?: string;
  image: string;
}

interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface ImageLibraryProps {
  /** Singular name used in messages, e.g. "gallery image" */
  noun: string;
  /** Where the images show up on the website, shown as a hint */
  shownOn: string;
  gridClassName: string;
  list: () => Promise<Result<LibraryImage[]>>;
  create: (item: { image: string }) => Promise<Result<unknown>>;
  remove: (id: string) => Promise<Result<unknown>>;
  upload: (file: File) => Promise<UploadResponse>;
}

// Upload box + grid of uploaded images; shared by Gallery and Promotions
const ImageLibrary = ({ noun, shownOn, gridClassName, list, create, remove, upload }: ImageLibraryProps) => {
  const toast = useToast();
  const [images, setImages] = useState<LibraryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [adding, setAdding] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<LibraryImage | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    const response = await list();
    if (response.success && response.data) {
      setImages(response.data);
      setError("");
    } else {
      setError(response.error || "Could not load the images");
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async () => {
    if (!file) return;
    setAdding(true);
    try {
      const uploaded = await upload(file);
      if (!uploaded.success || !uploaded.url) {
        toast.error(uploaded.error || "The image could not be uploaded. Please try again");
        return;
      }
      const saved = await create({ image: uploaded.url });
      if (!saved.success) {
        toast.error(saved.error || `Could not save the ${noun}. Please try again`);
        return;
      }
      toast.success(`${noun[0].toUpperCase()}${noun.slice(1)} added`);
      setFile(null);
      await load();
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?._id) return;
    setDeleting(true);
    const response = await remove(deleteTarget._id);
    setDeleting(false);

    if (response.success) {
      toast.success(`${noun[0].toUpperCase()}${noun.slice(1)} deleted`);
      setImages((prev) => prev.filter((img) => img._id !== deleteTarget._id));
      setDeleteTarget(null);
    } else {
      toast.error(response.error || `Could not delete the ${noun}. Please try again`);
    }
  };

  return (
    <>
      <div className="sv-panel p-5 sm:p-6 mb-8">
        <h2 className="text-2xl font-bold text-maroon mb-1">Add a new {noun}</h2>
        <p className="text-sm text-ink-muted mb-4">Shown on {shownOn}.</p>
        <ImagePicker
          file={file}
          onFileChange={setFile}
          onReject={(message) => toast.error(message)}
          previewClassName="h-56"
        />
        {file && (
          <div className="mt-4">
            <button type="button" disabled={adding} onClick={handleAdd} className="sv-btn-primary px-6 py-2.5 disabled:opacity-60 disabled:pointer-events-none">
              {adding ? "Uploading..." : `Add ${noun}`}
            </button>
          </div>
        )}
      </div>

      <ContainerBox>
        <h2 className="text-2xl font-bold text-maroon mb-5">
          Uploaded images{!loading && !error ? ` (${images.length})` : ""}
        </h2>
        {loading ? (
          <LoadingState label="Loading images..." />
        ) : error ? (
          <ErrorState message={error} onRetry={() => { setLoading(true); load(); }} />
        ) : images.length === 0 ? (
          <EmptyState title="Nothing uploaded yet" hint={`Add your first ${noun} using the box above.`} />
        ) : (
          <div className={`grid gap-5 ${gridClassName}`}>
            {images.map((img) => (
              <div key={img._id} className="rounded-xl overflow-hidden border border-gold/30 bg-white">
                <div className="aspect-video">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.image} alt={noun} className="w-full h-full object-cover" />
                </div>
                <div className="p-3 flex justify-end">
                  <RowActions onDelete={() => setDeleteTarget(img)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </ContainerBox>

      <ConfirmDialog
        open={deleteTarget !== null}
        title={`Delete this ${noun}?`}
        message="It will be removed from the website. This can't be undone."
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
};

export default ImageLibrary;
