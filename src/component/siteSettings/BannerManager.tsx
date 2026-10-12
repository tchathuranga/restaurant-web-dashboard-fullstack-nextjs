"use client";

import { useEffect, useRef, useState } from "react";
import { useToast } from "@/component/common/Toast";
import { LoadingState } from "@/component/common/StateViews";
import { BANNER_PAGES } from "@/component/const/siteBanners";
import { getBanners, saveBanner, uploadBannerImage } from "@/services/siteService";

const sameImages = (a: string[], b: string[]) => a.length === b.length && a.every((url, i) => url === b[i]);

const BannerManager = () => {
  const toast = useToast();
  const [saved, setSaved] = useState<Record<string, string[]>>({});
  const [drafts, setDrafts] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [busyPage, setBusyPage] = useState<string>("");
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    getBanners().then((result) => {
      if (result.success && result.data) {
        setSaved(result.data);
        setDrafts(result.data);
      } else {
        toast.error(result.error || "Could not load the banners");
      }
      setLoading(false);
    });
  }, []);

  const tell = (_page: string, n: { severity: "success" | "error"; text: string }) =>
    n.severity === "success" ? toast.success(n.text) : toast.error(n.text);
  const setDraft = (page: string, images: string[]) => setDrafts((prev) => ({ ...prev, [page]: images }));

  const handleFiles = async (page: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (!file.type.startsWith("image/")) {
      tell(page, { severity: "error", text: "Please select an image file" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      tell(page, { severity: "error", text: "File size must be less than 10MB" });
      return;
    }

    setBusyPage(page);
    const result = await uploadBannerImage(file);
    setBusyPage("");

    if (result.success && result.url) {
      setDraft(page, [...(drafts[page] || []), result.url]);
      tell(page, { severity: "success", text: "Image uploaded. Click Save to publish it." });
    } else {
      tell(page, { severity: "error", text: result.error || "Image upload failed" });
    }
    const input = fileInputs.current[page];
    if (input) input.value = "";
  };

  const move = (page: string, index: number, direction: -1 | 1) => {
    const images = [...(drafts[page] || [])];
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    [images[index], images[target]] = [images[target], images[index]];
    setDraft(page, images);
  };

  const persist = async (page: string, images: string[], successText: string) => {
    setBusyPage(page);
    const result = await saveBanner(page, images);
    setBusyPage("");

    if (result.success) {
      setSaved((prev) => ({ ...prev, [page]: images }));
      setDraft(page, images);
      tell(page, { severity: "success", text: successText });
    } else {
      tell(page, { severity: "error", text: result.error || "Failed to save banner" });
    }
  };

  if (loading) {
    return <LoadingState label="Loading banners..." />;
  }

  return (
    <div className="grid gap-6">
      {BANNER_PAGES.map((page) => {
        const draft = drafts[page.key] || [];
        const current = saved[page.key] || [];
        const dirty = !sameImages(draft, current);
        const busy = busyPage === page.key;

        return (
          <section key={page.key} className="sv-panel p-5">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <div>
                <h3 className="text-2xl font-bold text-maroon">{page.label}</h3>
                <p className="text-sm text-ink-muted">{page.hint}</p>
              </div>
              <span
                className={`self-start text-xs font-semibold px-3 py-1 rounded-full ${
                  current.length > 0 ? "bg-green-100 text-green-800" : "bg-cream text-amber-800"
                }`}
              >
                {current.length > 0 ? `${current.length} custom image${current.length > 1 ? "s" : ""} live` : "Using website default"}
              </span>
            </div>

            {draft.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {draft.map((url, index) => (
                  <div key={`${url}-${index}`} className="rounded-xl overflow-hidden border border-gold/40 bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`${page.label} banner ${index + 1}`} className="w-full h-36 object-cover" />
                    <div className="flex items-center justify-between p-2 text-sm">
                      <span className="text-ink-muted">#{index + 1}</span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          aria-label="Move earlier"
                          disabled={index === 0}
                          onClick={() => move(page.key, index, -1)}
                          className="px-2 py-1 rounded-lg border border-gold/40 disabled:opacity-30 hover:bg-cream"
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          aria-label="Move later"
                          disabled={index === draft.length - 1}
                          onClick={() => move(page.key, index, 1)}
                          className="px-2 py-1 rounded-lg border border-gold/40 disabled:opacity-30 hover:bg-cream"
                        >
                          →
                        </button>
                        <button
                          type="button"
                          onClick={() => setDraft(page.key, draft.filter((_, i) => i !== index))}
                          className="px-2 py-1 rounded-lg bg-red-700 text-white hover:bg-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink-muted mb-4">
                No custom image. The website shows its built-in banner for this page.
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <input
                ref={(el) => { fileInputs.current[page.key] = el; }}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFiles(page.key, e.target.files)}
              />
              <button
                type="button"
                disabled={busy}
                onClick={() => fileInputs.current[page.key]?.click()}
                className="px-4 py-2 rounded-xl border border-maroon text-maroon font-semibold hover:bg-maroon hover:text-ivory transition disabled:opacity-50"
              >
                {busy ? "Working..." : "Add image"}
              </button>
              <button
                type="button"
                disabled={busy || !dirty}
                onClick={() => persist(page.key, draft, draft.length ? "Banner published to the website." : "Restored the website's default banner.")}
                className="sv-btn-primary px-5 py-2 disabled:opacity-40 disabled:pointer-events-none"
              >
                Save
              </button>
              {current.length > 0 && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => persist(page.key, [], "Restored the website's default banner.")}
                  className="px-4 py-2 rounded-xl text-ink-muted hover:text-red-700 disabled:opacity-50"
                >
                  Restore default
                </button>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default BannerManager;
