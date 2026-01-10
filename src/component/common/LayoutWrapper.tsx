"use client"

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import NavBar from "./NavBar";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (isClient && pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex">
      <NavBar />
      {children}
    </div>
  );
}

