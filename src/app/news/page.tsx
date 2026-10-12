"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import SearchBar from "@/component/common/SearchBar";
import SectionHeader from "@/component/common/SectionHeader";
import ContainerBox from "@/component/common/ContainerBox";
import PageShell from "@/component/common/PageShell";
import ConfirmDialog from "@/component/common/ConfirmDialog";
import { EmptyState, ErrorState, LoadingState } from "@/component/common/StateViews";
import { useToast } from "@/component/common/Toast";
import NewsContainer from "@/component/news/NewsContainer";
import NewsFormDialog from "@/component/news/NewsFormDialog";
import { deleteNews, getAllNews } from "@/services/newsService";
import { News } from "@/interfaces/News";

export default function NewsFields() {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [newsData, setNewsData] = useState<News[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<News | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<News | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  const load = useCallback(async () => {
    const result = await getAllNews();
    if (result.success) {
      setNewsData(result.data || []);
      setError("");
    } else {
      setError(result.error || "Could not load the news");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return newsData.filter((item) => item.title.toLowerCase().includes(term));
  }, [newsData, searchTerm]);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget?._id) return;
    setDeleting(true);
    const result = await deleteNews(deleteTarget._id);
    setDeleting(false);

    if (result.success) {
      toast.success(`"${deleteTarget.title}" deleted`);
      setNewsData((prev) => prev.filter((n) => n._id !== deleteTarget._id));
      setDeleteTarget(null);
    } else {
      toast.error(result.error || "Could not delete the news. Please try again");
    }
  };

  return (
    <PageShell>
      <SectionHeader title="News" buttonLabel="Add news" onButtonClick={openAdd} />

      <SearchBar searchValue={searchTerm} onSearchChange={setSearchTerm} placeholder="Search news by headline" />

      <ContainerBox>
        {loading ? (
          <LoadingState label="Loading news..." />
        ) : error ? (
          <ErrorState message={error} onRetry={() => { setLoading(true); load(); }} />
        ) : filtered.length === 0 ? (
          searchTerm ? (
            <EmptyState title="No news matches your search" actionLabel="Clear search" onAction={() => setSearchTerm("")} />
          ) : (
            <EmptyState title="No news yet" hint="News appears on the website's News Feed page." actionLabel="Add news" onAction={openAdd} />
          )
        ) : (
          <div className="flex flex-col gap-5">
            {filtered.map((news) => (
              <NewsContainer
                key={news._id}
                title={news.title}
                description={news.description}
                imageUrl={news.image}
                onDelete={() => setDeleteTarget(news)}
                onUpdate={() => {
                  setEditing(news);
                  setFormOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </ContainerBox>

      <NewsFormDialog open={formOpen} news={editing} onClose={() => setFormOpen(false)} onSaved={load} />

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete this news?"
        message={`"${deleteTarget?.title ?? ""}" will be removed from the website. This can't be undone.`}
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </PageShell>
  );
}
