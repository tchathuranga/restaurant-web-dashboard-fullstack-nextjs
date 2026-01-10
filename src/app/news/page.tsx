"use client"

import SearchBar from "@/component/common/SearchBar";
import SectionHeader from "@/component/common/SectionHeader";
import ContainerBox from "@/component/common/ContainerBox";
import NewsContainer from "@/component/news/NewsContainer";
import { NEWS_DATA } from "@/component/const/newsData";
import { useState } from "react";
import Dialog from '@mui/material/Dialog';
import FormContainer from "@/component/common/FormContainer";
import Editor from 'react-simple-wysiwyg';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function News() {
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

  const filteredNews = NEWS_DATA.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="margin p-10">
      <SectionHeader
        title="News"
        buttonLabel="Add New"
        onButtonClick={handleClickOpen}
      />

      <SearchBar searchValue={searchTerm} onSearchChange={setSearchTerm} />

      <ContainerBox>
        <div className="flex flex-col gap-6">
          {filteredNews.map((item) => (
            <NewsContainer
              key={item.id}
              title={item.title}
              description={item.description}
              imageUrl={item.imageUrl}
            />
          ))}
        </div>
      </ContainerBox>

      <Dialog open={open} onClose={handleClose}>
          <FormContainer title={"Add a new News Field"} onSave={handleSave} onDiscard={handleDiscard}>
            <div className="mb-6">
              <label className="block text-base font-medium mb-2" htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                placeholder="Enter the title of the news here"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
              />
            </div>
      
            <div className="mb-6">
              <label className="block text-base font-medium mb-2" htmlFor="Description">Description</label>
              <Editor value={html} onChange={onChange} />
            </div>

            <div className="mb-8">
				    <label className="block text-base font-medium mb-2">Image</label>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg py-8 bg-gray-50">
              <div className="mb-6">
                <CloudUploadIcon 
                  sx={{ 
                    fontSize: 64, 
                    color: '#2563eb' 
                  }} 
                />
              </div>
              <span className="font-medium text-gray-700">Browse Files to upload</span>
              <span className="text-sm text-gray-400 mt-1">Upload  the food image here</span>
            </div>
			    </div>
          </FormContainer>
      </Dialog>
    </div>
  );
}