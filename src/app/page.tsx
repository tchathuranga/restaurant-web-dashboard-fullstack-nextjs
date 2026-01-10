"use client"

import { useState } from "react";
import SectionHeader from "@/component/common/SectionHeader";
import Categories from "@/component/Menu/Categories";
import SearchBar from "@/component/common/SearchBar";
import ContainerBox from "@/component/common/ContainerBox";
import ItemContainer from "@/component/Menu/ItemContainer";
import { ITEM_DATA } from "@/component/const/ItemData";
import Dialog from '@mui/material/Dialog';
import FormContainer from "@/component/common/FormContainer";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
 
export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

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


  const categoryFiltered = selectedCategory === "All" 
    ? ITEM_DATA 
    : ITEM_DATA.filter(category => category.Category === selectedCategory);

  const filteredCategories = categoryFiltered.map(category => ({
    ...category,
    data: category.data.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.data.length > 0);

  return (
    <div className="margin p-10">
      <SectionHeader
        title="Menu Management"
        buttonLabel="Add New"
        onButtonClick={handleClickOpen}
      />

      <Categories 
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
      
      <SearchBar 
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <ContainerBox>
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <p className="text-2xl text-gray-700 font-medium pb-4 px-4">{category.Category}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 px-4 pb-8">
                {category.data.map((item, itemIndex) => (
                  <ItemContainer
                    key={itemIndex}
                    image={item.image}
                    title={item.title}
                    imageAlt={item.imageAlt}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No items found matching your search.</p>
          </div>
        )}
      </ContainerBox>

      <Dialog open={open} onClose={handleClose}>
        <FormContainer title={"Add a new item"} onSave={handleSave} onDiscard={handleDiscard}>
          <div className="mb-6">
				    <label className="block text-base font-medium mb-2" htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              placeholder="Enter the name of the food here"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
            />
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
