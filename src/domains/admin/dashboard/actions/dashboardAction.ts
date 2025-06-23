"use server";

import { checkTabPermission } from "@/domains/admin/actions/adminAction";
import type { DashboardData } from "@/domains/admin/dashboard/types";

// 더미 회원 데이터
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

// 더미 게시글 데이터
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

// 더미 회원별 수강률 데이터 (0~100)
const memberProgress = [80, 60, 90, 70, 50, 100, 85, 75];

// 더미 강의별 수강률 데이터
const lectures = [
  { name: "AI 입문", progress: 80 },
  { name: "프론트엔드", progress: 65 },
  { name: "백엔드", progress: 72 },
  { name: "데이터분석", progress: 90 },
  { name: "머신러닝", progress: 55 },
];

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

// 대시보드 데이터 조회
export async function getDashboardData(): Promise<DashboardData> {
  const hasPermission = await checkTabPermission("dashboard");
  if (!hasPermission) {
    throw new Error("권한이 없습니다");
  }

  // TODO: 실제 데이터 조회 로직으로 교체
  // - 회원 통계: profiles 테이블
  // - 게시글 통계: posts 테이블
  // - 댓글 통계: comments 테이블
  // - 강좌 진도율: course_progress 테이블

  const days = getRecent7Days(posts);
  const totalMembers = members.length;
  const yesterdayCount = 6;
  const todayCount = totalMembers;
  const memberDiff = todayCount - yesterdayCount;

  // 누적 게시글 수로 그래프 데이터 생성
  let cumulative = 0;
  const postTrend = days.map((date) => {
    cumulative += posts.filter((p) => p.date.slice(5) === date).length;
    return { date, count: cumulative };
  });
  const postYesterday = postTrend[postTrend.length - 2]?.count ?? 0;
  const postToday = postTrend[postTrend.length - 1]?.count ?? 0;
  const postDiff = postToday - postYesterday;

  // 평균 진도율 계산
  const avgProgress =
    memberProgress.length > 0
      ? Math.round(
          memberProgress.reduce((a, b) => a + b, 0) / memberProgress.length,
        )
      : 0;

  // 최근 7일간 추가된 게시글 수
  const recent7Posts = posts.filter((p) => days.includes(p.date.slice(5)));
  const recent7PostCount = recent7Posts.length;

  // 최근 7일간 일별 추가 게시글 수
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

  // 회원 증가 추이
  const memberTrend = [
    { date: "05-01", count: 5 },
    { date: "05-02", count: 6 },
    { date: "05-03", count: 7 },
    { date: "05-04", count: 7 },
    { date: "05-05", count: 8 },
    { date: "05-06", count: 8 },
    { date: "05-07", count: 8 },
  ];

  return {
    stats: {
      totalMembers,
      memberDiff,
      totalPosts: posts.length,
      postDiff,
      avgProgress,
      recent7PostCount,
      recent7CommentCount,
    },
    trends: {
      memberTrend,
      postTrend,
      postDailyTrend,
      commentDailyTrend,
    },
    lectures,
  };
}
