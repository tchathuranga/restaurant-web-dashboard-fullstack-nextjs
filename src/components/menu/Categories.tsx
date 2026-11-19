import { ICategory } from "@/types/category";

interface CategoriesProps {
  categories: ICategory[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  /** Number of items per category name ("All" for the total) */
  counts?: Record<string, number>;
}

// Category filter. Wraps on wide screens and scrolls sideways on phones so it never takes over the page.
const Categories = ({ categories, selectedCategory, onCategorySelect, counts }: CategoriesProps) => {
  return (
    <div
      className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible"
      role="tablist"
      aria-label="Menu categories"
    >
      {[{ _id: "all", name: "All" }, ...categories].map((i) => {
        const active = selectedCategory === i.name;
        return (
          <button
            key={i._id}
            role="tab"
            aria-selected={active}
            onClick={() => onCategorySelect(i.name)}
            className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
              active
                ? "border-saffron-deep bg-gradient-to-br from-saffron to-saffron-deep text-ivory shadow-md"
                : "border-gold/45 bg-white text-ink hover:-translate-y-0.5 hover:border-gold hover:bg-cream"
            }`}
            type="button"
          >
            {i.name}
            {counts && (
              <span
                className={`min-w-6 rounded-full px-1.5 py-0.5 text-center text-xs font-semibold ${
                  active ? "bg-white/25" : "bg-cream text-ink-muted"
                }`}
              >
                {counts[i.name] ?? 0}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Categories;
