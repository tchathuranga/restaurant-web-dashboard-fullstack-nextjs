import RestaurantMenuRoundedIcon from "@mui/icons-material/RestaurantMenuRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import { ICategory } from "@/types/category";

interface MenuStatsProps {
  dishCount: number;
  categories: ICategory[];
}

// At-a-glance numbers above the menu
export default function MenuStats({ dishCount, categories }: MenuStatsProps) {
  const subcategoryCount = categories.reduce((sum, c) => sum + c.subcategories.length, 0);

  const stats = [
    {
      label: "Dishes",
      value: dishCount,
      icon: <RestaurantMenuRoundedIcon />,
      tone: "bg-saffron/12 text-saffron-deep",
    },
    {
      label: "Categories",
      value: categories.length,
      icon: <CategoryRoundedIcon />,
      tone: "bg-maroon/10 text-maroon",
    },
    {
      label: "Subcategories",
      value: subcategoryCount,
      icon: <AccountTreeRoundedIcon />,
      tone: "bg-peacock/10 text-peacock",
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-3 gap-2 sm:gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="sv-stat flex-col px-2! text-center sm:flex-row sm:px-4! sm:text-left">
          <div className={`sv-stat-icon ${stat.tone}`}>{stat.icon}</div>
          <div>
            <p className="font-display text-2xl font-bold leading-none text-ink sm:text-3xl">{stat.value}</p>
            <p className="mt-1 text-xs font-medium text-ink-muted">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
