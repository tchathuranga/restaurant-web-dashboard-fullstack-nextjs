import { FILTERS } from "@/component/const/Filters";

interface CategoriesProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const Categories = ({ selectedCategory, onCategorySelect }: CategoriesProps) => {
  return (
    <div className="px-4 py-2 rounded-md mb-10">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {FILTERS.map((i) => (
        <button
          key={i.id}
          onClick={() => onCategorySelect(i.name)}
          className={`px-2 py-1 rounded-full shadow-sm font-medium text-base transition border focus:outline-none ${
            selectedCategory === i.name
              ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
              : "bg-white text-gray-700 border-transparent hover:bg-blue-50"
          }`}
          type="button"
        >
          {i.name}
        </button>
      ))}
    </div>
      </div>
  );
};

export default Categories;