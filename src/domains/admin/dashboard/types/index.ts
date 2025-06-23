export interface DashboardStats {
  totalMembers: number;
  memberDiff: number;
  totalPosts: number;
  postDiff: number;
  avgProgress: number;
  recent7PostCount: number;
  recent7CommentCount: number;
}

export interface LectureProgress {
  name: string;
  progress: number;
}

export interface TrendData {
  date: string;
  count: number;
}

export interface DashboardData {
  stats: DashboardStats;
  lectures: LectureProgress[];
  trends: {
    memberTrend: TrendData[];
    postTrend: TrendData[];
    postDailyTrend: TrendData[];
    commentDailyTrend: TrendData[];
  };
}
