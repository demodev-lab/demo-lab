"use client";

import { Card } from "@/components/ui/card";
import { useDashboardStats } from "@/domains/admin/dashboard/hooks/useDashboardStats";
import type { DashboardData } from "@/domains/admin/dashboard/types";
import {
  UsersIcon,
  BookOpenIcon,
  MessageSquareIcon,
  TrendingUpIcon,
} from "lucide-react";

interface DashboardStatsProps {
  initialData: DashboardData;
}

export function DashboardStats({ initialData }: DashboardStatsProps) {
  const { data } = useDashboardStats(initialData);

  const cards = [
    {
      title: "전체 회원",
      value: data.stats.totalMembers,
      diff: data.stats.memberDiff,
      icon: UsersIcon,
    },
    {
      title: "전체 게시글",
      value: data.stats.totalPosts,
      diff: data.stats.postDiff,
      icon: MessageSquareIcon,
    },
    {
      title: "평균 진도율",
      value: Math.round(data.stats.avgProgress),
      icon: BookOpenIcon,
      isPercentage: true,
    },
    {
      title: "최근 7일 활동",
      value: data.stats.recent7PostCount,
      subValue: data.stats.recent7CommentCount,
      icon: TrendingUpIcon,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Card key={card.title} className="p-6">
            <div className="flex items-center gap-4">
              <card.icon className="h-8 w-8 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {card.title}
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold">
                    {card.isPercentage ? `${card.value}%` : card.value}
                  </h3>
                  {card.diff !== undefined && (
                    <span
                      className={`text-sm ${
                        card.diff >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {card.diff > 0 ? "+" : ""}
                      {card.diff}
                    </span>
                  )}
                </div>
                {card.subValue !== undefined && (
                  <p className="text-sm text-gray-500 mt-1">
                    댓글 {card.subValue}개
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 트렌드 차트 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart title="회원 증가 추이" data={data.trends.memberTrend} />
        <TrendChart title="게시글 증가 추이" data={data.trends.postTrend} />
      </div>

      {/* 강좌별 진도율 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">강좌별 평균 진도율</h3>
        <div className="space-y-4">
          {data.lectures.map((lecture) => (
            <div key={lecture.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{lecture.name}</span>
                <span className="font-medium">{lecture.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${lecture.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function TrendChart({
  title,
  data,
}: {
  title: string;
  data: Array<{ date: string; count: number }>;
}) {
  const maxCount = Math.max(...data.map((d) => d.count));

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="h-48">
        <div className="flex items-end h-full space-x-2">
          {data.map((item) => (
            <div key={item.date} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-blue-600 rounded-t"
                style={{
                  height: `${maxCount ? (item.count / maxCount) * 100 : 0}%`,
                }}
              />
              <div className="text-xs mt-2 text-gray-500">
                {new Date(item.date).toLocaleDateString("ko-KR", {
                  month: "numeric",
                  day: "numeric",
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
