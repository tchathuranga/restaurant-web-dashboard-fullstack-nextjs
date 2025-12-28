"use client"

import { useState } from "react";
import { SectionHeader } from "@/component/common/SectionHeader";
import Categories from "@/component/Menu/Categories";
import SearchBar from "@/component/common/SearchBar";
import ContainerBox from "@/component/common/ContainerBox";
import ItemContainer from "@/component/Menu/ItemContainer";
import { ITEM_DATA } from "@/component/const/ItemData";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");

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
        subtitle="Hi, Samantha. Welcome to Sri Vihar Admin!"
        buttonLabel="Add New"
        onButtonClick={() => alert("Add New clicked!")}
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
      
    </div>
  );
}
