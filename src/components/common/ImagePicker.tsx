"use client";

import { useEffect, useRef, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface ImagePickerProps {
  /** Image already saved (shown until a new file is chosen) */
  currentUrl?: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  /** Called when the chosen file is rejected, with a readable reason */
  onReject?: (message: string) => void;
  /** Clears the saved image too (edit forms) */
  onClearCurrent?: () => void;
  maxMB?: number;
  hint?: string;
  previewClassName?: string;
}

// Choose or drop an image; it is uploaded later, when the form is saved
const ImagePicker = ({
  currentUrl,
  file,
  onFileChange,
  onReject,
  onClearCurrent,
  maxMB = 5,
  hint = "Drag and drop, or click to browse",
  previewClassName = "h-48",
}: ImagePickerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [objectUrl, setObjectUrl] = useState("");

  useEffect(() => {
    if (!file) {
      setObjectUrl("");
      return;
    }
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const accept = (candidate?: File) => {
    if (!candidate) return;
    if (!candidate.type.startsWith("image/")) {
      onReject?.("Please choose an image file (JPG, PNG, WebP)");
      return;
    }
    if (candidate.size > maxMB * 1024 * 1024) {
      onReject?.(`That image is larger than ${maxMB}MB. Please choose a smaller one`);
      return;
    }
    onFileChange(candidate);
  };

  const preview = objectUrl || currentUrl || "";

  const reset = () => {
    onFileChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => accept(e.target.files?.[0])}
      />

      {preview ? (
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Preview" className={`w-full ${previewClassName} object-cover rounded-xl border border-gold/40`} />
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg border border-gold/60 text-sm hover:bg-cream transition"
            >
              Replace image
            </button>
            {(file || (currentUrl && onClearCurrent)) && (
              <button
                type="button"
                onClick={() => {
                  reset();
                  if (!file) onClearCurrent?.();
                }}
                className="px-3 py-1.5 rounded-lg text-sm text-red-700 hover:bg-red-50 transition"
              >
                Remove
              </button>
            )}
            {file && <span className="self-center text-xs text-ink-muted">New image, uploads when you save</span>}
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            accept(e.dataTransfer.files?.[0]);
          }}
          className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-8 cursor-pointer transition ${
            dragging ? "border-saffron bg-cream" : "border-gold/60 bg-white hover:bg-cream/60"
          }`}
        >
          <CloudUploadIcon sx={{ fontSize: 44, color: "#e85d04" }} />
          <span className="font-semibold text-ink mt-2">Choose an image</span>
          <span className="text-sm text-ink-muted mt-0.5">{hint}</span>
          <span className="text-xs text-ink-muted mt-1">Max {maxMB}MB</span>
        </div>
      )}
    </div>
  );
};

export default ImagePicker;
