import React from "react";
import { ChartContainer } from "@/components/ui/chart";
import * as RechartsPrimitive from "recharts";

// 더미 회원 데이터 (members-tab.tsx 참고)
const members = [
  { id: 1, name: "Sunghyun Ko" },
  { id: 2, name: "Tim Nelms" },
  { id: 3, name: "Sean Yoo" },
  { id: 4, name: "호영 정" },
  { id: 5, name: "Kim Jeong ryul" },
  { id: 6, name: "Ibra Ryz" },
  { id: 7, name: "Andrew Choi" },
  { id: 8, name: "현택 이" },
];
const totalMembers = members.length;

// 어제 회원수 (더미)
const yesterdayCount = 6;
const todayCount = totalMembers;
const diff = todayCount - yesterdayCount;

// 최근 7일 회원수 변화 (더미)
const memberTrend = [
  { date: "05-01", count: 5 },
  { date: "05-02", count: 6 },
  { date: "05-03", count: 7 },
  { date: "05-04", count: 7 },
  { date: "05-05", count: 8 },
  { date: "05-06", count: 8 },
  { date: "05-07", count: 8 },
];

// 더미 게시글 데이터 (CommunityTab 참고)
const posts = [
  {
    id: 1,
    date: "2025-05-17",
    commentsList: [
      { id: 1, date: "2025-05-17" },
      { id: 2, date: "2025-05-17" },
    ],
  },
  {
    id: 2,
    date: "2025-05-18",
    commentsList: [
      { id: 3, date: "2025-05-18" },
      { id: 4, date: "2025-05-18" },
      { id: 5, date: "2025-05-18" },
    ],
  },
  {
    id: 3,
    date: "2025-05-19",
    commentsList: [{ id: 6, date: "2025-05-19" }],
  },
];
const totalPosts = posts.length;

// 게시글 데이터 기준 최근 7일 날짜 구하기
function getRecent7Days(posts: { date: string }[]): string[] {
  // 게시글 중 가장 최근 날짜를 today로 삼음
  const sorted = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const today = sorted[0] ? new Date(sorted[0].date) : new Date();
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - 6 + i);
    return d.toISOString().slice(5, 10); // "MM-DD"
  });
}
const days: string[] = getRecent7Days(posts);

// 누적 게시글 수로 그래프 데이터 생성
let cumulative = 0;
const postTrend: { date: string; count: number }[] = days.map((date) => {
  cumulative += posts.filter((p) => p.date.slice(5) === date).length;
  return { date, count: cumulative };
});
const postYesterday: number = postTrend[postTrend.length - 2]?.count ?? 0;
const postToday: number = postTrend[postTrend.length - 1]?.count ?? 0;
const postDiff: number = postToday - postYesterday;

// 더미 회원별 수강률 데이터 (0~100)
const memberProgress = [80, 60, 90, 70, 50, 100, 85, 75];
const avgProgress =
  memberProgress.length > 0
    ? Math.round(
        memberProgress.reduce((a, b) => a + b, 0) / memberProgress.length,
      )
    : 0;

// 더미 강의별 수강률 데이터
const lectures = [
  { name: "AI 입문", progress: 80 },
  { name: "프론트엔드", progress: 65 },
  { name: "백엔드", progress: 72 },
  { name: "데이터분석", progress: 90 },
  { name: "머신러닝", progress: 55 },
];

// 최근 7일간 추가된 게시글 수
const recent7Posts = posts.filter((p) => days.includes(p.date.slice(5)));
const recent7PostCount = recent7Posts.length;
// 최근 7일간 일별 추가 게시글 수 (이미 postTrend에서 count가 누적합이 아닌 경우 아래처럼, 누적합이면 별도 계산)
const postDailyTrend = days.map((date) => ({
  date,
  count: posts.filter((p) => p.date.slice(5) === date).length,
}));

// 댓글 데이터 펼치기
const allComments = posts.flatMap((p) => p.commentsList || []);
// 최근 7일간 추가된 댓글
const recent7Comments = allComments.filter((c) =>
  days.includes(c.date.slice(5)),
);
const recent7CommentCount = recent7Comments.length;
// 최근 7일간 일별 추가 댓글 수
const commentDailyTrend = days.map((date) => ({
  date,
  count: allComments.filter((c) => c.date.slice(5) === date).length,
}));

export default function DashboardCards() {
  return (
    <div className="flex flex-col gap-8">
      {/* 카드 묶음 (위) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 전체 회원수 카드 */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-lg font-semibold mb-2">전체 가입자 수</span>
          <span className="text-3xl font-bold">{totalMembers}</span>
          <span
            className={`text-xs mt-1 ${diff >= 0 ? "text-green-500" : "text-red-500"}`}
          >
            {diff >= 0 ? `+${diff}명 증가` : `${diff}명 감소`} (어제 대비)
          </span>
        </div>
        {/* 전체 게시글 수 카드 */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-lg font-semibold mb-2">전체 게시글 수</span>
          <span className="text-3xl font-bold">{totalPosts}</span>
          <span
            className={`text-xs mt-1 ${postDiff >= 0 ? "text-green-500" : "text-red-500"}`}
          >
            {postDiff >= 0 ? `+${postDiff}개 증가` : `${postDiff}개 감소`} (어제
            대비)
          </span>
        </div>
        {/* 회원 평균 수강률 카드 */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-lg font-semibold mb-2">회원 평균 수강률</span>
          <span className="text-3xl font-bold">{avgProgress}%</span>
        </div>
        {/* 최근 7일간 추가된 게시글 수 카드 */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-lg font-semibold mb-2">
            최근 7일간 추가된 게시글 수
          </span>
          <span className="text-3xl font-bold">{recent7PostCount}</span>
        </div>
        {/* 최근 7일간 추가된 댓글 수 카드 */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-lg font-semibold mb-2">
            최근 7일간 추가된 댓글 수
          </span>
          <span className="text-3xl font-bold">{recent7CommentCount}</span>
        </div>
      </div>
      {/* 그래프 묶음 (아래) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 회원수 변화 추세 선 그래프 */}
        <div className="bg-white rounded-lg shadow p-6">
          <span className="text-lg font-semibold mb-4 block">
            회원수 변화 추세
          </span>
          <ChartContainer
            config={{
              count: { label: "회원수", color: "#6366f1" },
            }}
          >
            <RechartsPrimitive.ResponsiveContainer width="100%" height={200}>
              <RechartsPrimitive.LineChart data={memberTrend}>
                <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
                <RechartsPrimitive.XAxis dataKey="date" />
                <RechartsPrimitive.YAxis allowDecimals={false} />
                <RechartsPrimitive.Tooltip />
                <RechartsPrimitive.Line
                  type="monotone"
                  dataKey="count"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot
                />
              </RechartsPrimitive.LineChart>
            </RechartsPrimitive.ResponsiveContainer>
          </ChartContainer>
        </div>
        {/* 게시글 변화 추세 선 그래프 */}
        <div className="bg-white rounded-lg shadow p-6">
          <span className="text-lg font-semibold mb-4 block">
            게시글 변화 추세
          </span>
          <ChartContainer
            config={{
              count: { label: "게시글 수", color: "#f59e42" },
            }}
          >
            <RechartsPrimitive.ResponsiveContainer width="100%" height={200}>
              <RechartsPrimitive.LineChart data={postTrend}>
                <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
                <RechartsPrimitive.XAxis dataKey="date" />
                <RechartsPrimitive.YAxis allowDecimals={false} />
                <RechartsPrimitive.Tooltip />
                <RechartsPrimitive.Line
                  type="monotone"
                  dataKey="count"
                  stroke="#f59e42"
                  strokeWidth={2}
                  dot
                />
              </RechartsPrimitive.LineChart>
            </RechartsPrimitive.ResponsiveContainer>
          </ChartContainer>
        </div>
        {/* 최근 7일간 추가 게시글 수 그래프 */}
        <div className="bg-white rounded-lg shadow p-6">
          <span className="text-lg font-semibold mb-4 block">
            최근 7일간 추가 게시글 수
          </span>
          <ChartContainer
            config={{
              count: { label: "추가 게시글 수", color: "#f43f5e" },
            }}
          >
            <RechartsPrimitive.ResponsiveContainer width="100%" height={200}>
              <RechartsPrimitive.LineChart data={postDailyTrend}>
                <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
                <RechartsPrimitive.XAxis dataKey="date" />
                <RechartsPrimitive.YAxis allowDecimals={false} />
                <RechartsPrimitive.Tooltip />
                <RechartsPrimitive.Line
                  type="monotone"
                  dataKey="count"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  dot
                />
              </RechartsPrimitive.LineChart>
            </RechartsPrimitive.ResponsiveContainer>
          </ChartContainer>
        </div>
        {/* 최근 7일간 추가 댓글 수 그래프 */}
        <div className="bg-white rounded-lg shadow p-6">
          <span className="text-lg font-semibold mb-4 block">
            최근 7일간 추가 댓글 수
          </span>
          <ChartContainer
            config={{
              count: { label: "추가 댓글 수", color: "#6366f1" },
            }}
          >
            <RechartsPrimitive.ResponsiveContainer width="100%" height={200}>
              <RechartsPrimitive.LineChart data={commentDailyTrend}>
                <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
                <RechartsPrimitive.XAxis dataKey="date" />
                <RechartsPrimitive.YAxis allowDecimals={false} />
                <RechartsPrimitive.Tooltip />
                <RechartsPrimitive.Line
                  type="monotone"
                  dataKey="count"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot
                />
              </RechartsPrimitive.LineChart>
            </RechartsPrimitive.ResponsiveContainer>
          </ChartContainer>
        </div>
        {/* 강의별 수강률 막대 그래프 */}
        <div className="bg-white rounded-lg shadow p-6">
          <span className="text-lg font-semibold mb-4 block">
            강의별 평균 수강률
          </span>
          <ChartContainer
            config={{
              progress: { label: "수강률", color: "#10b981" },
            }}
          >
            <RechartsPrimitive.ResponsiveContainer width="100%" height={240}>
              <RechartsPrimitive.BarChart data={lectures}>
                <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
                <RechartsPrimitive.XAxis dataKey="name" />
                <RechartsPrimitive.YAxis domain={[0, 100]} />
                <RechartsPrimitive.Tooltip />
                <RechartsPrimitive.Bar dataKey="progress" fill="#10b981" />
              </RechartsPrimitive.BarChart>
            </RechartsPrimitive.ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
