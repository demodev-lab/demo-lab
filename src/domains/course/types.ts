export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  thumbnail_url: string | null;
  difficulty: "입문" | "초급" | "중급" | "고급";
  total_lecture_count: number;
  total_duration_secs: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCourseInput {
  title: string;
  subtitle: string;
  description: string;
  thumbnail_url?: string;
  difficulty: Course["difficulty"];
}

// 나중에 필요한 타입들
export interface UpdateCourseInput extends Partial<CreateCourseInput> {
  id: string;
}

export interface CourseWithProgress extends Course {
  progress: number;
}
