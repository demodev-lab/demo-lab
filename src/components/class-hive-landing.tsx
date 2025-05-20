"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { TabNavigation } from "@/components/tab-navigation";
import { CommunityTab } from "@/components/tabs/community-tab";
import { ClassroomTab } from "@/components/tabs/classroom-tab";
import { CalendarTab } from "@/components/tabs/calendar-tab";
import { MembersTab } from "@/components/tabs/members-tab";
import { AboutTab } from "@/components/tabs/about-tab";
import { Sidebar } from "@/components/sidebar";
import { useRouter, usePathname } from "next/navigation";

export function ClassHiveLanding() {
  const router = useRouter();
  const pathname = usePathname();

  // Determine active tab based on current path
  const getActiveTabFromPath = () => {
    if (pathname === "/") return "community";
    if (pathname === "/classroom") return "classroom";
    if (pathname === "/calendar") return "calendar";
    if (pathname === "/members") return "members";
    if (pathname === "/about") return "about";
    return "community"; // Default to community
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromPath());

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    // Navigate to the corresponding route
    switch (tab) {
      case "community":
        router.push("/");
        break;
      case "classroom":
        router.push("/classroom");
        break;
      case "calendar":
        router.push("/calendar");
        break;
      case "members":
        router.push("/members");
        break;
      case "about":
        router.push("/about");
        break;
      default:
        router.push("/");
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "community":
        return <CommunityTab />;
      case "classroom":
        return <ClassroomTab />;
      case "calendar":
        return <CalendarTab />;
      case "members":
        return <MembersTab />;
      case "about":
        return <AboutTab />;
      default:
        return <CommunityTab />;
    }
  };

  const showSidebar = activeTab !== "classroom" && activeTab !== "calendar";

  return (
    <div className="flex flex-col min-h-screen bg-[#F2F2F2]">
      <Header />
      <TabNavigation activeTab={activeTab} setActiveTab={handleTabChange} />
      <div className="flex flex-1 w-full">
        <main className={`flex-1 w-full ${showSidebar ? "" : ""}`}>
          {renderTabContent()}
        </main>
        {showSidebar && <Sidebar />}
      </div>
    </div>
  );
}
