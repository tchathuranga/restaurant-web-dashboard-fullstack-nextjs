"use client"

import SectionHeader from "@/component/common/SectionHeader";
import SearchBar from "@/component/common/SearchBar";
import ContainerBox from "@/component/common/ContainerBox";
import JobCard from "@/component/vacancies/JobCard";
import { JOB_DATA } from "@/component/const/JobData";
import { useState } from "react";
import Dialog from '@mui/material/Dialog';
import FormContainer from "@/component/common/FormContainer";
import Editor from 'react-simple-wysiwyg';

export default function Vacancies() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [html, setHtml] = useState<string>('<p>Enter the description</p>');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDiscard = () => {
    // Add discard logic here
    setOpen(false);
  };

  const handleSave = () => {
    // Add save logic here
    setOpen(false);
  };

  function onChange(e: any) {
    setHtml(e.target.value);
  }

  const filteredJobs = JOB_DATA.filter((job) =>
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
          {filteredJobs.map((job, index) => (
            <JobCard
              key={index}
              title={job.title}
              location={job.location}
              employmentType={job.employmentType}
              experienceLevel={job.experienceLevel}
              availability={job.availability}
              skills={job.skills}
              additionalRequirements={job.additionalRequirements}
            />
          ))}
        </div>
      </ContainerBox>

      <Dialog open={open} onClose={handleClose}>
        <FormContainer title={"Add a new vacancy"} onSave={handleSave} onDiscard={handleDiscard}>
          <div className="mb-6">
            <label className="block text-base font-medium mb-2" htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                placeholder="Enter the name of the vacancy here"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
              />
          </div>

          <div className="mb-6">
            <label className="block text-base font-medium mb-2" htmlFor="location">Location</label>
              <input
                id="location"
                type="text"
                placeholder="Enter the location here"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
              />
          </div>

          <div className="mb-6">
            <label className="block text-base font-medium mb-2" htmlFor="location">Type</label>
              <select
                id="type"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
              >
                <option>Full-time</option>
                <option>Part-time</option>
              </select>
          </div>

          <div className="mb-6">
            <label className="block text-base font-medium mb-2" htmlFor="location">Description</label>
            <Editor value={html} onChange={onChange} />
          </div>
        </FormContainer>
      </Dialog>
    </div>
  );
}