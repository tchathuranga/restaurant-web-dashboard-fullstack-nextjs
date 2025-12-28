"use client"

import { SectionHeader } from "@/component/common/SectionHeader";

export default function News(){
    return (
        <div className="margin p-10">
          <SectionHeader
            title="News"
            subtitle="Hi, Samantha. Welcome to Sri Vihar Admin!"
            buttonLabel="Add New"
            onButtonClick={() => alert("Add New clicked!")}
          />
        </div>
      );
}