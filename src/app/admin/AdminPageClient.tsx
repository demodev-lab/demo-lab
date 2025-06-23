// "use client";

// import CommunityManager from "@/app/admin/CommunityManager";
// import { CourseManager } from "./CourseManager";
// import { DashboardCards } from "@/app/admin/dashboard/components/DashboardCards";
// import { UserManagement } from "@/domains/admin/user/components/userManagement";
// import React, { useState } from "react";
// import { AdminSidebar } from "@/domains/admin/components/AdminSidebar";
// import { NoPermission } from "@/domains/admin/components/NoPermission";
// import type { AdminTab } from "@/domains/admin/types";
// import { useProfile } from "@/hooks/use-profile";

// export default function AdminPageClient() {
//   const [tab, setTab] = useState<AdminTab>("dashboard");
//   const { data: userProfile } = useProfile();

//   // 각 탭 컴포넌트를 React.Suspense로 감싸서 로딩 상태 처리
//   const TabContent = () => {
//     switch (tab) {
//       case "dashboard":
//         return (
//           <React.Suspense fallback={<div>로딩 중...</div>}>
//             <h1 className="text-2xl font-bold mb-6">
//               demo-lab 관리자 대시보드
//             </h1>
//             <DashboardCards />
//           </React.Suspense>
//         );
//       case "user":
//         return (
//           <React.Suspense fallback={<div>로딩 중...</div>}>
//             <UserManagement />
//           </React.Suspense>
//         );
//       case "lecture":
//         return (
//           <React.Suspense fallback={<div>로딩 중...</div>}>
//             <h2 className="text-xl font-semibold mb-4">코스 관리</h2>
//             <CourseManager />
//           </React.Suspense>
//         );
//       case "community":
//         return (
//           <React.Suspense fallback={<div>로딩 중...</div>}>
//             <h2 className="text-xl font-semibold mb-4">커뮤니티 관리</h2>
//             <CommunityManager />
//           </React.Suspense>
//         );
//       case "settings":
//         return (
//           <React.Suspense fallback={<div>로딩 중...</div>}>
//             <h2 className="text-xl font-semibold mb-4">시스템 설정</h2>
//             <div className="bg-white p-6 rounded-lg shadow">
//               <h3 className="text-lg font-medium mb-4">Admin 전용 설정</h3>
//               <p className="text-gray-600 mb-4">
//                 이 영역은 admin만 접근할 수 있습니다.
//               </p>

//               <div className="space-y-4">
//                 <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
//                   <h4 className="font-semibold text-yellow-800">시스템 관리</h4>
//                   <p className="text-yellow-700 text-sm mt-1">
//                     전체 시스템 설정을 관리합니다.
//                   </p>
//                 </div>

//                 <div className="p-4 bg-red-50 border border-red-200 rounded">
//                   <h4 className="font-semibold text-red-800">위험 구역</h4>
//                   <p className="text-red-700 text-sm mt-1">
//                     데이터 삭제 및 초기화 기능
//                   </p>
//                   <button className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
//                     모든 데이터 초기화
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </React.Suspense>
//         );
//       default:
//         return <NoPermission />;
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <AdminSidebar
//         currentTab={tab}
//         onTabChange={setTab}
//         userRole={userProfile?.role}
//       />

//       {/* 컨텐츠 영역 */}
//       <main className="flex-1 p-8">
//         <React.Suspense fallback={<div>로딩 중...</div>}>
//           <TabContent />
//         </React.Suspense>
//       </main>
//     </div>
//   );
// }
