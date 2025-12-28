"use client"

import { SectionHeader } from "@/component/common/SectionHeader";
import SearchBar from "@/component/common/SearchBar";
import ContainerBox from "@/component/common/ContainerBox";
import JobCard from "@/component/vacancies/JobCard";

export default function Vacancies() {
  const jobData = [
    {
      title: "South Indian Cook",
      location: "Colombo 5, Sri Lanka",
      employmentType: "Full-Time",
      experienceLevel: "2-5 Years",
      availability: "Immediate",
      skills: "Cooking, South Indian, Vegetarian",
      additionalRequirements: ["Team Player", "Menu Development"]
    },
    {
      title: "South Indian Cook",
      location: "Colombo 5, Sri Lanka",
      employmentType: "Full-Time",
      experienceLevel: "2-5 Years",
      availability: "Immediate",
      skills: "Cooking, South Indian, Vegetarian",
      additionalRequirements: ["Team Player", "Menu Development"]
    },
    {
      title: "South Indian Cook",
      location: "Colombo 5, Sri Lanka",
      employmentType: "Full-Time",
      experienceLevel: "2-5 Years",
      availability: "Immediate",
      skills: "Cooking, South Indian, Vegetarian",
      additionalRequirements: ["Team Player", "Menu Development"]
    },
    {
      title: "South Indian Cook",
      location: "Colombo 5, Sri Lanka",
      employmentType: "Full-Time",
      experienceLevel: "2-5 Years",
      availability: "Immediate",
      skills: "Cooking, South Indian, Vegetarian",
      additionalRequirements: ["Team Player", "Menu Development"]
    }

  ];

  return (
    <div className="margin p-10">
      <SectionHeader
        title="Vacancies"
        subtitle="Hi, Samantha. Welcome to Sri Vihar Admin!"
        buttonLabel="Add New"
        onButtonClick={() => alert("Add New clicked!")}
      />

      <SearchBar onSearchChange={() => { }} />

      <ContainerBox>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobData.map((job, index) => (
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