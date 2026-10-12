import { ICategory } from "@/interfaces/Category";

interface CategoriesProps {
  categories: ICategory[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  /** Number of items per category name ("All" for the total) */
  counts?: Record<string, number>;
}

const Categories = ({ categories, selectedCategory, onCategorySelect, counts }: CategoriesProps) => {
  return (
    <div className="px-1 py-2 mb-4">
      <div className="flex flex-wrap gap-2.5" role="tablist" aria-label="Menu categories">
        {[{ _id: "all", name: "All" }, ...categories].map((i) => {
          const active = selectedCategory === i.name;
          return (
            <button
              key={i._id}
              role="tab"
              aria-selected={active}
              onClick={() => onCategorySelect(i.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm sm:text-base transition border ${
                active
                  ? "bg-gradient-to-br from-saffron to-saffron-deep text-ivory border-saffron-deep shadow-md"
                  : "bg-white text-ink border-gold/50 hover:bg-cream hover:border-gold"
              }`}
              type="button"
            >
              {i.name}
              {counts && (
                <span className={`text-xs rounded-full px-2 py-0.5 ${active ? "bg-white/25" : "bg-cream text-ink-muted"}`}>
                  {counts[i.name] ?? 0}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
