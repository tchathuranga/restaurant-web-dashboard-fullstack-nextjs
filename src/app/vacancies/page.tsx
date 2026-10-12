"use client"

import { useCallback, useEffect, useMemo, useState } from "react";
import SectionHeader from "@/component/common/SectionHeader";
import SearchBar from "@/component/common/SearchBar";
import ContainerBox from "@/component/common/ContainerBox";
import PageShell from "@/component/common/PageShell";
import ConfirmDialog from "@/component/common/ConfirmDialog";
import { EmptyState, ErrorState, LoadingState } from "@/component/common/StateViews";
import { useToast } from "@/component/common/Toast";
import JobCard from "@/component/vacancies/JobCard";
import VacancyFormDialog from "@/component/vacancies/VacancyFormDialog";
import { deleteVacancy, getAllVacancies } from "@/services/vacancyService";
import { Vacancy } from "@/interfaces/vacancy";

export default function Vacancies() {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<Vacancy | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Vacancy | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  const load = useCallback(async () => {
    const response = await getAllVacancies();
    if (response.success && response.data) {
      setVacancies(response.data);
      setError("");
    } else {
      setError(response.error || "Could not load vacancies");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return vacancies.filter((job) => job.title.toLowerCase().includes(term));
  }, [vacancies, searchTerm]);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget?._id) return;
    setDeleting(true);
    const response = await deleteVacancy(deleteTarget._id);
    setDeleting(false);

    if (response.success) {
      toast.success(`"${deleteTarget.title}" deleted`);
      setVacancies((prev) => prev.filter((v) => v._id !== deleteTarget._id));
      setDeleteTarget(null);
    } else {
      toast.error(response.error || "Could not delete the vacancy. Please try again");
    }
  };

  return (
    <PageShell>
      <SectionHeader title="Vacancies" buttonLabel="Add vacancy" onButtonClick={openAdd} />

      <SearchBar searchValue={searchTerm} onSearchChange={setSearchTerm} placeholder="Search vacancies by title" />

      <ContainerBox>
        {loading ? (
          <LoadingState label="Loading vacancies..." />
        ) : error ? (
          <ErrorState message={error} onRetry={() => { setLoading(true); load(); }} />
        ) : filtered.length === 0 ? (
          searchTerm ? (
            <EmptyState title="No vacancies match your search" actionLabel="Clear search" onAction={() => setSearchTerm("")} />
          ) : (
            <EmptyState title="No vacancies yet" hint="Published vacancies appear on the website's Join the Team page." actionLabel="Add vacancy" onAction={openAdd} />
          )
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {filtered.map((job) => (
              <JobCard
                key={job._id}
                title={job.title}
                location={job.location}
                employmentType={job.type}
                description={job.description}
                onDelete={() => setDeleteTarget(job)}
                onEdit={() => {
                  setEditing(job);
                  setFormOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </ContainerBox>

      <VacancyFormDialog open={formOpen} vacancy={editing} onClose={() => setFormOpen(false)} onSaved={load} />

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete this vacancy?"
        message={`"${deleteTarget?.title ?? ""}" will be removed from the website. This can't be undone.`}
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </PageShell>
  );
}
