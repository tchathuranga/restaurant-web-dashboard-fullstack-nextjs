"use client"

import { SectionHeader } from "@/component/common/SectionHeader";
import SearchBar from "@/component/common/SearchBar";
import ContainerBox from "@/component/common/ContainerBox";
import JobCard from "@/component/vacancies/JobCard";
import { JOB_DATA } from "@/component/const/JobData";
import { useState } from "react";

export default function Vacancies() {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredJobs = JOB_DATA.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="margin p-10">
      <SectionHeader
        title="Vacancies"
        subtitle="Hi, Samantha. Welcome to Sri Vihar Admin!"
        buttonLabel="Add New"
        onButtonClick={() => alert("Add New clicked!")}
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
    </div>
  );
}