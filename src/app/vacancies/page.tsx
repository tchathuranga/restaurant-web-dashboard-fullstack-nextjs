"use client"

import SectionHeader from "@/component/common/SectionHeader";
import SearchBar from "@/component/common/SearchBar";
import ContainerBox from "@/component/common/ContainerBox";
import JobCard from "@/component/vacancies/JobCard";
import { useEffect, useState } from "react";
import Dialog from '@mui/material/Dialog';
import FormContainer from "@/component/common/FormContainer";
import Editor from "@/component/common/Editor";
import { createVacancy, deleteVacancy, getAllVacancies, getVacancyById, updateVacancy, VacancyApiResponse } from "@/services/vacancyService";
import { Vacancy } from "@/interfaces/vacancy";

export default function Vacancies() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [vacancyData, setVacancyData] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);
  const [savingError, setSavingError] = useState<string>("");
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [updateId, setUpdateId] = useState<string>("");
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    type: '',
    description:''
  });

  useEffect(() => {
    const fetchVacancies = async () => {
      setLoading(true);
      setError("");
      const response = await getAllVacancies();
      if (response.success && response.data) {
        setVacancyData(response.data);
      } else {
        setError(response.error || "Failed to load vacancies");
      }
      setLoading(false);
    }

    fetchVacancies();
  }, []);

  const handleCloseUpdate = () => {
    setUpdateId("");
    setOpenUpdate(false);
    setLoadingUpdate(false);

    setFormData({
      title: '',
      location: '', 
      type: '',
      description: ''
    });
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSavingError("");
    setFormData({
      title: '',
      location: '', 
      type: '',
      description:''
    });
  };

  const handleDiscard = () => {
    setOpen(false);
    setSavingError("");
    setFormData({
      title: '',
      location: '', 
      type: '',
      description:''
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSavingError("");
      const vacancy = {
        title: formData.title,
        location: formData.location,
        type: formData.type,
        description: formData.description
      };

      const response = await createVacancy(vacancy);
      if (response.success) {
        setSaving(false);
        setOpen(false);
        window.location.reload();
      } else {
        setSaving(false);
        setSavingError("Failed to create vacancy: " + response.error);
      }
    } catch (error) {
      setSaving(false);
      setSavingError("Failed to save vacancy");
    }
  };

  const handleUpdateSave = async () => {
    try {
      setSaving(true);
      setSavingError("");
      const vacancy = {
        title: formData.title,
        location: formData.location,
        type: formData.type,
        description: formData.description,
      };
      const response = await updateVacancy(updateId, vacancy);
      if (response.success) {
        setSaving(false);
        setOpenUpdate(false);
        window.location.reload();
      } else {
        setSaving(false);
        setSavingError("Failed to update vacancy: " + response.error);
      }
    } catch (error) {
      setSaving(false);
      setSavingError("Failed to update vacancy");
    }
  };

  const handleUpdate = async (id: string) => {

    setFormData({
      title: '',
      location: '', 
      type: '',
      description: ''
    });
    
    setUpdateId(id);
    setLoadingUpdate(true);
    setOpenUpdate(true);
    
    try {
      const response : VacancyApiResponse<Vacancy> = await getVacancyById(id);
      if (response.success && response.data) {
        const vacancy = response.data;
        setFormData({
          title: vacancy.title,
          location: vacancy.location,
          type: vacancy.type,
          description: vacancy.description,
        });
      }
    } catch (error) {
      console.error("Failed to fetch vacancy details:", error);
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleDiscardUpdate = () => {
    setOpenUpdate(false);
    setSavingError("");
    setLoadingUpdate(false);
    setFormData({
      title: '',
      location: '', 
      type: '',
      description: ''
    });
  };

  const handleDelete = async (id?: string) => {
    if (!id) {
      alert("Invalid vacancy ID");
      return;
    }

    if (!confirm("Are you sure you want to delete this vacancy?")) {
      return;
    }

    const response: VacancyApiResponse<Vacancy> = await deleteVacancy(id);
    if (response.success) {
      alert("Vacancy deleted successfully");
      setVacancyData((prevData) =>
        prevData.filter((vacancy) => vacancy._id !== id),
      );
    } else {
      alert("Failed to delete vacancy: " + response.error);
    }
  };

  const filteredVacancies = vacancyData.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="margin p-10">
      <SectionHeader
        title="Vacancies"
        buttonLabel="Add New"
        onButtonClick={handleClickOpen}
      />

      <SearchBar
        searchValue={searchTerm}
        onSearchChange={(value) => setSearchTerm(value)}
      />

      <ContainerBox>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading && <p>Loading vacancies...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {filteredVacancies.length === 0 && !loading && (<p>No vacancies found.</p>)}

          {filteredVacancies.map((job, index) => (
            <JobCard
              key={index}
              title={job.title}
              location={job.location}
              employmentType={job.type}
              description={job.description}
              onDelete={() => handleDelete(job._id)}
              onEdit={() => job._id && handleUpdate(job._id)}
            />
          ))}
        </div>
      </ContainerBox>

      <Dialog open={open} onClose={handleClose}>
        <FormContainer
          actionLabel="Save"
          title={"Add a new vacancy"}
          onSave={handleSave}
          onDiscard={handleDiscard}
        >
          <div className="mb-6">
            <label className="block text-base font-medium mb-2" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter the name of the vacancy here"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-base font-medium mb-2"
              htmlFor="location"
            >
              Location
            </label>
            <input
              id="location"
              type="text"
              placeholder="Enter the location here"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-base font-medium mb-2"
              htmlFor="type"
            >
              Type
            </label>
            <select
              id="type"
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            >
              <option value="">Select type</option>
              <option>Full-time</option>
              <option>Part-time</option>
            </select>
          </div>

          <div className="mb-6">
            <label
              className="block text-base font-medium mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <Editor
              onChange={(html) =>
                setFormData({ ...formData, description: html })
              }
            />
          </div>

          {saving && <p>Saving vacancy...</p>}
          {savingError && <p className="text-red-500 mb-4">{savingError}</p>}
        </FormContainer>
      </Dialog>

      <Dialog open={openUpdate} onClose={handleCloseUpdate}>
        {loadingUpdate ? (
          <div className="p-8 min-w-125">
            <p>Loading vacancy details...</p>
          </div>
        ) : (
          <FormContainer
            actionLabel="Update"
            title={"Update vacancy"}
            onSave={handleUpdateSave}
            onDiscard={handleDiscardUpdate}
          >
            <div className="mb-6">
              <label className="block text-base font-medium mb-2" htmlFor="update-title">
                Title
              </label>
              <input
                id="update-title"
                type="text"
                placeholder="Enter the name of the vacancy here"
                value={formData.title}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="mb-6">
              <label
                className="block text-base font-medium mb-2"
                htmlFor="update-location"
              >
                Location
              </label>
              <input
                id="update-location"
                type="text"
                placeholder="Enter the location here"
                value={formData.location}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>

            <div className="mb-6">
              <label
                className="block text-base font-medium mb-2"
                htmlFor="update-type"
              >
                Type
              </label>
              <select
                id="update-type"
                value={formData.type}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <option value="" disabled>Select type</option>
                <option>Full-time</option>
                <option>Part-time</option>
              </select>
            </div>

            <div className="mb-6">
              <label
                className="block text-base font-medium mb-2"
                htmlFor="update-description"
              >
                Description
              </label>
              <Editor
                key={updateId}
                initialValue={formData.description}
                onChange={(html) =>
                  setFormData({ ...formData, description: html })
                }
              />
            </div>

            {saving && <p>Updating vacancy...</p>}
            {savingError && <p className="text-red-500 mb-4">{savingError}</p>}
          </FormContainer>
        )}
      </Dialog>
    </div>
  );
}