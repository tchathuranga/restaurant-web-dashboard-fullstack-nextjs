"use client";

import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import SectionHeader from "@/component/common/SectionHeader";
import PageShell from "@/component/common/PageShell";
import BannerManager from "@/component/siteSettings/BannerManager";
import BranchManager from "@/component/siteSettings/BranchManager";

export default function SiteSettingsPage() {
  const [tab, setTab] = useState(0);

  return (
    <PageShell>
      <SectionHeader title="Website Settings" />

      <Tabs
        value={tab}
        onChange={(_, value) => setTab(value)}
        sx={{
          mb: 4,
          px: 1,
          "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: "1rem", color: "#5c4033" },
          "& .Mui-selected": { color: "#c2410c !important" },
          "& .MuiTabs-indicator": { backgroundColor: "#e85d04", height: 3 },
        }}
      >
        <Tab label="Banner images" />
        <Tab label="Branches & delivery links" />
      </Tabs>

      <div className="px-1">{tab === 0 ? <BannerManager /> : <BranchManager />}</div>
    </PageShell>
  );
}
