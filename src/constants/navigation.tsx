import MenuBookIcon from "@mui/icons-material/MenuBook";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import CollectionsIcon from "@mui/icons-material/Collections";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import TuneIcon from "@mui/icons-material/Tune";

export interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  // Shown under the page title so staff know what the page changes on the website
  description: string;
  group: "Content" | "Website";
}

// One list drives the sidebar and the page headers, so names and icons always match
export const NAV_ITEMS: NavItem[] = [
  {
    label: "Menu",
    path: "/",
    icon: <MenuBookIcon />,
    description: "Dishes, prices and photos shown on the website's Food Menu.",
    group: "Content",
  },
  {
    label: "News",
    path: "/news",
    icon: <NewspaperIcon />,
    description: "Announcements shown on the News Feed and the home page.",
    group: "Content",
  },
  {
    label: "Promotions",
    path: "/promotions",
    icon: <LocalOfferIcon />,
    description: "Offer banners shown on the home page.",
    group: "Content",
  },
  {
    label: "Gallery",
    path: "/gallery",
    icon: <CollectionsIcon />,
    description: "Photos shown in the Our Story gallery.",
    group: "Content",
  },
  {
    label: "Vacancies",
    path: "/vacancies",
    icon: <WorkOutlineIcon />,
    description: "Open positions listed on the Join the Team page.",
    group: "Content",
  },
  {
    label: "Website Settings",
    path: "/site-settings",
    icon: <TuneIcon />,
    description: "Page banners, branches and delivery links.",
    group: "Website",
  },
];

export const findNavItem = (pathname: string) => NAV_ITEMS.find((item) => item.path === pathname);
