"use client";

import { cn } from "@/utils/lib/utils";

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  const tabs = [
    { id: "community", label: "Community" },
    { id: "classroom", label: "Classroom" },
    { id: "calendar", label: "Calendar" },
  ];

  return (
    <div className="sticky top-14 z-40 w-full border-b bg-white">
      <nav className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
              activeTab === tab.id
                ? "border-b-2 border-[#2F80ED] text-[#2F80ED]"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
