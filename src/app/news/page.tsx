"use client"

import SearchBar from "@/component/common/SearchBar";
import { SectionHeader } from "@/component/common/SectionHeader";
import ContainerBox from "@/component/common/ContainerBox";
import NewsContainer from "@/component/news/NewsContainer";
import { NEWS_DATA } from "@/component/const/newsData";
import { useState } from "react";

export default function News() {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredNews = NEWS_DATA.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="margin p-10">
      <SectionHeader
        title="News"
        subtitle="Hi, Samantha. Welcome to Sri Vihar Admin!"
        buttonLabel="Add New"
        onButtonClick={() => alert("Add New clicked!")}
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
    </div>
  );
}