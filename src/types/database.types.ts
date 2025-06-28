export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          color: string;
          created_at: string;
          description: string | null;
          id: number;
          name: string;
        };
        Insert: {
          color?: string;
          created_at?: string;
          description?: string | null;
          id?: never;
          name: string;
        };
        Update: {
          color?: string;
          created_at?: string;
          description?: string | null;
          id?: never;
          name?: string;
        };
        Relationships: [];
      };
      comments: {
        Row: {
          author_id: string;
          content: string;
          created_at: string;
          id: number;
          is_spam: boolean;
          like_count: number;
          parent_comment_id: number | null;
          post_id: number;
          status: string;
          updated_at: string | null;
        };
        Insert: {
          author_id: string;
          content: string;
          created_at?: string;
          id?: never;
          is_spam?: boolean;
          like_count?: number;
          parent_comment_id?: number | null;
          post_id: number;
          status?: string;
          updated_at?: string | null;
        };
        Update: {
          author_id?: string;
          content?: string;
          created_at?: string;
          id?: never;
          is_spam?: boolean;
          like_count?: number;
          parent_comment_id?: number | null;
          post_id?: number;
          status?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "comments_parent_comment_id_fkey";
            columns: ["parent_comment_id"];
            isOneToOne: false;
            referencedRelation: "comments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
        ];
      };
      likes: {
        Row: {
          created_at: string;
          post_id: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          post_id: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          post_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
        ];
      };
      post_tags: {
        Row: {
          post_id: number;
          tag_id: number;
        };
        Insert: {
          post_id: number;
          tag_id: number;
        };
        Update: {
          post_id?: number;
          tag_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "post_tags_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "post_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          },
        ];
      };
      posts: {
        Row: {
          author_id: string;
          category_id: number | null;
          comment_count: number;
          content: string | null;
          created_at: string;
          id: number;
          is_pinned: boolean;
          is_spam: boolean;
          like_count: number;
          status: string;
          title: string;
          updated_at: string | null;
          view_count: number;
        };
        Insert: {
          author_id: string;
          category_id?: number | null;
          comment_count?: number;
          content?: string | null;
          created_at?: string;
          id?: never;
          is_pinned?: boolean;
          is_spam?: boolean;
          like_count?: number;
          status?: string;
          title: string;
          updated_at?: string | null;
          view_count?: number;
        };
        Update: {
          author_id?: string;
          category_id?: number | null;
          comment_count?: number;
          content?: string | null;
          created_at?: string;
          id?: never;
          is_pinned?: boolean;
          is_spam?: boolean;
          like_count?: number;
          status?: string;
          title?: string;
          updated_at?: string | null;
          view_count?: number;
        };
        Relationships: [
          {
            foreignKeyName: "posts_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          full_name: string | null;
          id: string;
          role: Database["public"]["Enums"]["user_role"];
          updated_at: string;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          full_name?: string | null;
          id: string;
          role?: Database["public"]["Enums"]["user_role"];
          updated_at?: string;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          full_name?: string | null;
          id?: string;
          role?: Database["public"]["Enums"]["user_role"];
          updated_at?: string;
          username?: string | null;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          created_at: string;
          current_period_end: string | null;
          id: string;
          lemon_squeezy_customer_id: number | null;
          lemon_squeezy_order_id: number | null;
          lemonsqueezy_subscription_id: number;
          price_id: number | null;
          product_id: number | null;
          status: string;
          test_mode: boolean | null;
          updated_at: string;
          user_id: string | null;
          variant_id: number | null;
        };
        Insert: {
          created_at?: string;
          current_period_end?: string | null;
          id?: string;
          lemon_squeezy_customer_id?: number | null;
          lemon_squeezy_order_id?: number | null;
          lemonsqueezy_subscription_id: number;
          price_id?: number | null;
          product_id?: number | null;
          status: string;
          test_mode?: boolean | null;
          updated_at?: string;
          user_id?: string | null;
          variant_id?: number | null;
        };
        Update: {
          created_at?: string;
          current_period_end?: string | null;
          id?: string;
          lemon_squeezy_customer_id?: number | null;
          lemon_squeezy_order_id?: number | null;
          lemonsqueezy_subscription_id?: number;
          price_id?: number | null;
          product_id?: number | null;
          status?: string;
          test_mode?: boolean | null;
          updated_at?: string;
          user_id?: string | null;
          variant_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      tags: {
        Row: {
          color: string;
          created_at: string;
          description: string | null;
          id: number;
          name: string;
        };
        Insert: {
          color?: string;
          created_at?: string;
          description?: string | null;
          id?: never;
          name: string;
        };
        Update: {
          color?: string;
          created_at?: string;
          description?: string | null;
          id?: never;
          name?: string;
        };
        Relationships: [];
      };
      Course: {
        Row: {
          id: number;
          title: string;
          subtitle: string | null;
          description: string | null;
          thumbnail_url: string | null;
          difficulty: Database["public"]["Enums"]["difficulty_level"];
          total_lecture_count: number;
          total_duration_secs: number;
          status: Database["public"]["Enums"]["course_status"];
          applicant_id: string | null;
          applicant_email: string | null;
          applicant_phone: string | null;
          applied_at: string | null;
          approved_at: string | null;
          approved_by: string | null;
          rejection_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: never;
          title: string;
          subtitle?: string | null;
          description?: string | null;
          thumbnail_url?: string | null;
          difficulty: Database["public"]["Enums"]["difficulty_level"];
          total_lecture_count?: number;
          total_duration_secs?: number;
          status?: Database["public"]["Enums"]["course_status"];
          applicant_id?: string | null;
          applicant_email?: string | null;
          applicant_phone?: string | null;
          applied_at?: string | null;
          approved_at?: string | null;
          approved_by?: string | null;
          rejection_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: never;
          title?: string;
          subtitle?: string | null;
          description?: string | null;
          thumbnail_url?: string | null;
          difficulty?: Database["public"]["Enums"]["difficulty_level"];
          total_lecture_count?: number;
          total_duration_secs?: number;
          status?: Database["public"]["Enums"]["course_status"];
          applicant_id?: string | null;
          applicant_email?: string | null;
          applicant_phone?: string | null;
          applied_at?: string | null;
          approved_at?: string | null;
          approved_by?: string | null;
          rejection_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Course_applicant_id_fkey";
            columns: ["applicant_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Course_approved_by_fkey";
            columns: ["approved_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      Module: {
        Row: {
          id: number;
          course_id: number;
          title: string;
          sequence: number;
        };
        Insert: {
          id?: never;
          course_id: number;
          title: string;
          sequence: number;
        };
        Update: {
          id?: never;
          course_id?: number;
          title?: string;
          sequence?: number;
        };
        Relationships: [
          {
            foreignKeyName: "Module_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "Course";
            referencedColumns: ["id"];
          },
        ];
      };
      Lecture: {
        Row: {
          id: number;
          course_id: number;
          module_id: number;
          title: string;
          description: string | null;
          sequence: number;
          video_url: string | null;
          duration_secs: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: never;
          course_id: number;
          module_id: number;
          title: string;
          description?: string | null;
          sequence: number;
          video_url?: string | null;
          duration_secs?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: never;
          course_id?: number;
          module_id?: number;
          title?: string;
          description?: string | null;
          sequence?: number;
          video_url?: string | null;
          duration_secs?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Lecture_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "Course";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Lecture_module_id_fkey";
            columns: ["module_id"];
            isOneToOne: false;
            referencedRelation: "Module";
            referencedColumns: ["id"];
          },
        ];
      };
      Enrollment: {
        Row: {
          id: number;
          user_id: string;
          course_id: number;
          status: Database["public"]["Enums"]["enrollment_status"];
          completed_lecture_count: number;
          last_viewed_lecture_id: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: never;
          user_id: string;
          course_id: number;
          status?: Database["public"]["Enums"]["enrollment_status"];
          completed_lecture_count?: number;
          last_viewed_lecture_id?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: never;
          user_id?: string;
          course_id?: number;
          status?: Database["public"]["Enums"]["enrollment_status"];
          completed_lecture_count?: number;
          last_viewed_lecture_id?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Enrollment_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Enrollment_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "Course";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Enrollment_last_viewed_lecture_id_fkey";
            columns: ["last_viewed_lecture_id"];
            isOneToOne: false;
            referencedRelation: "Lecture";
            referencedColumns: ["id"];
          },
        ];
      };
      LectureProgress: {
        Row: {
          id: number;
          user_id: string;
          lecture_id: number;
          progress_secs: number;
          is_completed: boolean;
          updated_at: string;
        };
        Insert: {
          id?: never;
          user_id: string;
          lecture_id: number;
          progress_secs?: number;
          is_completed?: boolean;
          updated_at?: string;
        };
        Update: {
          id?: never;
          user_id?: string;
          lecture_id?: number;
          progress_secs?: number;
          is_completed?: boolean;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "LectureProgress_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "LectureProgress_lecture_id_fkey";
            columns: ["lecture_id"];
            isOneToOne: false;
            referencedRelation: "Lecture";
            referencedColumns: ["id"];
          },
        ];
      };
      CourseInstructor: {
        Row: {
          id: number;
          course_id: number;
          instructor_id: string;
          role_title: string | null;
          intro_message: string | null;
        };
        Insert: {
          id?: never;
          course_id: number;
          instructor_id: string;
          role_title?: string | null;
          intro_message?: string | null;
        };
        Update: {
          id?: never;
          course_id?: number;
          instructor_id?: string;
          role_title?: string | null;
          intro_message?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "CourseInstructor_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "Course";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "CourseInstructor_instructor_id_fkey";
            columns: ["instructor_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      CourseLearningGoal: {
        Row: {
          id: number;
          course_id: number;
          content: string;
        };
        Insert: {
          id?: never;
          course_id: number;
          content: string;
        };
        Update: {
          id?: never;
          course_id?: number;
          content?: string;
        };
        Relationships: [
          {
            foreignKeyName: "CourseLearningGoal_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "Course";
            referencedColumns: ["id"];
          },
        ];
      };
      BackgroundKnowledge: {
        Row: {
          id: number;
          course_id: number;
          content: string;
        };
        Insert: {
          id?: never;
          course_id: number;
          content: string;
        };
        Update: {
          id?: never;
          course_id?: number;
          content?: string;
        };
        Relationships: [
          {
            foreignKeyName: "BackgroundKnowledge_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "Course";
            referencedColumns: ["id"];
          },
        ];
      };
      LectureKeypoint: {
        Row: {
          id: number;
          lecture_id: number;
          content: string;
        };
        Insert: {
          id?: never;
          lecture_id: number;
          content: string;
        };
        Update: {
          id?: never;
          lecture_id?: number;
          content?: string;
        };
        Relationships: [
          {
            foreignKeyName: "LectureKeypoint_lecture_id_fkey";
            columns: ["lecture_id"];
            isOneToOne: false;
            referencedRelation: "Lecture";
            referencedColumns: ["id"];
          },
        ];
      };
      LectureMaterial: {
        Row: {
          id: number;
          lecture_id: number;
          title: string;
          file_url: string;
        };
        Insert: {
          id?: never;
          lecture_id: number;
          title: string;
          file_url: string;
        };
        Update: {
          id?: never;
          lecture_id?: number;
          title?: string;
          file_url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "LectureMaterial_lecture_id_fkey";
            columns: ["lecture_id"];
            isOneToOne: false;
            referencedRelation: "Lecture";
            referencedColumns: ["id"];
          },
        ];
      };
      RelatedCourse: {
        Row: {
          id: number;
          course_a_id: number;
          course_b_id: number;
        };
        Insert: {
          id?: never;
          course_a_id: number;
          course_b_id: number;
        };
        Update: {
          id?: never;
          course_a_id?: number;
          course_b_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "RelatedCourse_course_a_id_fkey";
            columns: ["course_a_id"];
            isOneToOne: false;
            referencedRelation: "Course";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "RelatedCourse_course_b_id_fkey";
            columns: ["course_b_id"];
            isOneToOne: false;
            referencedRelation: "Course";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_posts_with_details: {
        Args: {
          request_user_id: string;
          page_limit: number;
          page_offset: number;
        };
        Returns: {
          id: number;
          created_at: string;
          title: string;
          content: string;
          view_count: number;
          like_count: number;
          comment_count: number;
          is_pinned: boolean;
          author_id: string;
          author_name: string;
          category_id: number;
          category_name: string;
          category_color: string;
          tags: Json;
          is_liked: boolean;
        }[];
      };
    };
    Enums: {
      user_role: "user" | "manager" | "admin";
      difficulty_level: "입문" | "초급" | "중급" | "고급";
      enrollment_status: "수강전" | "수강중" | "완강";
      course_status: "pending" | "active" | "closed";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      user_role: ["user", "manager", "admin"],
      difficulty_level: ["입문", "초급", "중급", "고급"],
      enrollment_status: ["수강전", "수강중", "완강"],
      course_status: ["pending", "active", "closed"],
    },
  },
} as const;
