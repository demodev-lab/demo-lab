export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)";
  };
  public: {
    Tables: {
      background_knowledge: {
        Row: {
          content: string;
          course_id: number | null;
          created_at: string | null;
          id: number;
          sequence: number | null;
        };
        Insert: {
          content: string;
          course_id?: number | null;
          created_at?: string | null;
          id?: number;
          sequence?: number | null;
        };
        Update: {
          content?: string;
          course_id?: number | null;
          created_at?: string | null;
          id?: number;
          sequence?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "background_knowledge_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "course";
            referencedColumns: ["id"];
          },
        ];
      };
      categories: {
        Row: {
          color: string | null;
          created_at: string | null;
          description: string | null;
          id: number;
          min_role_required: Database["public"]["Enums"]["user_role"] | null;
          name: string;
        };
        Insert: {
          color?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: number;
          min_role_required?: Database["public"]["Enums"]["user_role"] | null;
          name: string;
        };
        Update: {
          color?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: number;
          min_role_required?: Database["public"]["Enums"]["user_role"] | null;
          name?: string;
        };
        Relationships: [];
      };
      comment_likes: {
        Row: {
          comment_id: number | null;
          created_at: string | null;
          id: number;
          user_id: string;
        };
        Insert: {
          comment_id?: number | null;
          created_at?: string | null;
          id?: number;
          user_id: string;
        };
        Update: {
          comment_id?: number | null;
          created_at?: string | null;
          id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "comment_likes_comment_id_fkey";
            columns: ["comment_id"];
            isOneToOne: false;
            referencedRelation: "comments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comment_likes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      comments: {
        Row: {
          author_id: string;
          children_count: number | null;
          content: string;
          created_at: string | null;
          deleted_at: string | null;
          deleted_content: string | null;
          id: number;
          like_count: number | null;
          parent_id: number | null;
          post_id: number | null;
        };
        Insert: {
          author_id: string;
          children_count?: number | null;
          content: string;
          created_at?: string | null;
          deleted_at?: string | null;
          deleted_content?: string | null;
          id?: number;
          like_count?: number | null;
          parent_id?: number | null;
          post_id?: number | null;
        };
        Update: {
          author_id?: string;
          children_count?: number | null;
          content?: string;
          created_at?: string | null;
          deleted_at?: string | null;
          deleted_content?: string | null;
          id?: number;
          like_count?: number | null;
          parent_id?: number | null;
          post_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "comments_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_parent_id_fkey";
            columns: ["parent_id"];
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
      course: {
        Row: {
          average_rating: number | null;
          category_id: number | null;
          course_start_date: string | null;
          created_at: string | null;
          currency: string | null;
          description: string | null;
          difficulty: Database["public"]["Enums"]["difficulty_level"];
          expected_duration_weeks: number | null;
          id: number;
          is_free: boolean | null;
          original_price: number | null;
          sale_price: number | null;
          status: Database["public"]["Enums"]["course_status"] | null;
          subtitle: string | null;
          target_audience: string | null;
          thumbnail_url: string | null;
          title: string;
          total_duration_secs: number | null;
          total_lecture_count: number | null;
          total_reviews: number | null;
          total_students: number | null;
          updated_at: string | null;
        };
        Insert: {
          average_rating?: number | null;
          category_id?: number | null;
          course_start_date?: string | null;
          created_at?: string | null;
          currency?: string | null;
          description?: string | null;
          difficulty?: Database["public"]["Enums"]["difficulty_level"];
          expected_duration_weeks?: number | null;
          id?: number;
          is_free?: boolean | null;
          original_price?: number | null;
          sale_price?: number | null;
          status?: Database["public"]["Enums"]["course_status"] | null;
          subtitle?: string | null;
          target_audience?: string | null;
          thumbnail_url?: string | null;
          title: string;
          total_duration_secs?: number | null;
          total_lecture_count?: number | null;
          total_reviews?: number | null;
          total_students?: number | null;
          updated_at?: string | null;
        };
        Update: {
          average_rating?: number | null;
          category_id?: number | null;
          course_start_date?: string | null;
          created_at?: string | null;
          currency?: string | null;
          description?: string | null;
          difficulty?: Database["public"]["Enums"]["difficulty_level"];
          expected_duration_weeks?: number | null;
          id?: number;
          is_free?: boolean | null;
          original_price?: number | null;
          sale_price?: number | null;
          status?: Database["public"]["Enums"]["course_status"] | null;
          subtitle?: string | null;
          target_audience?: string | null;
          thumbnail_url?: string | null;
          title?: string;
          total_duration_secs?: number | null;
          total_lecture_count?: number | null;
          total_reviews?: number | null;
          total_students?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "course_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "course_category";
            referencedColumns: ["id"];
          },
        ];
      };
      course_application: {
        Row: {
          additional_materials: string | null;
          additional_message: string | null;
          applicant_email: string | null;
          applicant_id: string;
          applicant_phone: string | null;
          applied_at: string;
          approved_at: string | null;
          approved_by: string | null;
          approved_course_id: number | null;
          background_knowledge: Json | null;
          category_id: number | null;
          course_start_date: string | null;
          created_at: string;
          description: string | null;
          difficulty: Database["public"]["Enums"]["difficulty_level"];
          expected_duration_weeks: number | null;
          id: number;
          instructor_info: Json | null;
          learning_goals: Json | null;
          modules_plan: Json | null;
          price_info: Json | null;
          rejected_at: string | null;
          rejected_by: string | null;
          rejection_reason: string | null;
          status: string;
          subtitle: string | null;
          target_audience: string | null;
          thumbnail_url: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          additional_materials?: string | null;
          additional_message?: string | null;
          applicant_email?: string | null;
          applicant_id: string;
          applicant_phone?: string | null;
          applied_at?: string;
          approved_at?: string | null;
          approved_by?: string | null;
          approved_course_id?: number | null;
          background_knowledge?: Json | null;
          category_id?: number | null;
          course_start_date?: string | null;
          created_at?: string;
          description?: string | null;
          difficulty?: Database["public"]["Enums"]["difficulty_level"];
          expected_duration_weeks?: number | null;
          id?: number;
          instructor_info?: Json | null;
          learning_goals?: Json | null;
          modules_plan?: Json | null;
          price_info?: Json | null;
          rejected_at?: string | null;
          rejected_by?: string | null;
          rejection_reason?: string | null;
          status?: string;
          subtitle?: string | null;
          target_audience?: string | null;
          thumbnail_url?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          additional_materials?: string | null;
          additional_message?: string | null;
          applicant_email?: string | null;
          applicant_id?: string;
          applicant_phone?: string | null;
          applied_at?: string;
          approved_at?: string | null;
          approved_by?: string | null;
          approved_course_id?: number | null;
          background_knowledge?: Json | null;
          category_id?: number | null;
          course_start_date?: string | null;
          created_at?: string;
          description?: string | null;
          difficulty?: Database["public"]["Enums"]["difficulty_level"];
          expected_duration_weeks?: number | null;
          id?: number;
          instructor_info?: Json | null;
          learning_goals?: Json | null;
          modules_plan?: Json | null;
          price_info?: Json | null;
          rejected_at?: string | null;
          rejected_by?: string | null;
          rejection_reason?: string | null;
          status?: string;
          subtitle?: string | null;
          target_audience?: string | null;
          thumbnail_url?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "course_application_applicant_id_fkey";
            columns: ["applicant_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "course_application_approved_course_id_fkey";
            columns: ["approved_course_id"];
            isOneToOne: false;
            referencedRelation: "course";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "course_application_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "course_category";
            referencedColumns: ["id"];
          },
        ];
      };
      course_category: {
        Row: {
          color: string | null;
          created_at: string | null;
          description: string | null;
          icon: string | null;
          id: number;
          is_active: boolean | null;
          name: string;
          parent_id: number | null;
          sequence: number | null;
          updated_at: string | null;
        };
        Insert: {
          color?: string | null;
          created_at?: string | null;
          description?: string | null;
          icon?: string | null;
          id?: number;
          is_active?: boolean | null;
          name: string;
          parent_id?: number | null;
          sequence?: number | null;
          updated_at?: string | null;
        };
        Update: {
          color?: string | null;
          created_at?: string | null;
          description?: string | null;
          icon?: string | null;
          id?: number;
          is_active?: boolean | null;
          name?: string;
          parent_id?: number | null;
          sequence?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "course_category_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "course_category";
            referencedColumns: ["id"];
          },
        ];
      };
      course_instructor: {
        Row: {
          course_id: number | null;
          created_at: string | null;
          id: number;
          instructor_id: string | null;
          intro_message: string | null;
          role_title: string | null;
        };
        Insert: {
          course_id?: number | null;
          created_at?: string | null;
          id?: number;
          instructor_id?: string | null;
          intro_message?: string | null;
          role_title?: string | null;
        };
        Update: {
          course_id?: number | null;
          created_at?: string | null;
          id?: number;
          instructor_id?: string | null;
          intro_message?: string | null;
          role_title?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "course_instructor_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "course";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "course_instructor_instructor_id_fkey";
            columns: ["instructor_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      course_learning_goal: {
        Row: {
          content: string;
          course_id: number | null;
          created_at: string | null;
          id: number;
          sequence: number | null;
        };
        Insert: {
          content: string;
          course_id?: number | null;
          created_at?: string | null;
          id?: number;
          sequence?: number | null;
        };
        Update: {
          content?: string;
          course_id?: number | null;
          created_at?: string | null;
          id?: number;
          sequence?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "course_learning_goal_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "course";
            referencedColumns: ["id"];
          },
        ];
      };
      course_review: {
        Row: {
          content: string;
          course_id: number;
          created_at: string | null;
          enrollment_id: number | null;
          id: number;
          is_published: boolean | null;
          is_verified: boolean | null;
          rating: number;
          reviewed_at: string | null;
          reviewed_by: string | null;
          title: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          content: string;
          course_id: number;
          created_at?: string | null;
          enrollment_id?: number | null;
          id?: number;
          is_published?: boolean | null;
          is_verified?: boolean | null;
          rating: number;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          title?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          content?: string;
          course_id?: number;
          created_at?: string | null;
          enrollment_id?: number | null;
          id?: number;
          is_published?: boolean | null;
          is_verified?: boolean | null;
          rating?: number;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          title?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "course_review_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "course";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "course_review_enrollment_id_fkey";
            columns: ["enrollment_id"];
            isOneToOne: false;
            referencedRelation: "enrollment";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "course_review_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      enrollment: {
        Row: {
          completed_lecture_count: number | null;
          course_id: number | null;
          created_at: string | null;
          id: number;
          last_viewed_lecture_id: number | null;
          status: Database["public"]["Enums"]["enrollment_status"] | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          completed_lecture_count?: number | null;
          course_id?: number | null;
          created_at?: string | null;
          id?: number;
          last_viewed_lecture_id?: number | null;
          status?: Database["public"]["Enums"]["enrollment_status"] | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          completed_lecture_count?: number | null;
          course_id?: number | null;
          created_at?: string | null;
          id?: number;
          last_viewed_lecture_id?: number | null;
          status?: Database["public"]["Enums"]["enrollment_status"] | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "enrollment_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "course";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "enrollment_last_viewed_lecture_id_fkey";
            columns: ["last_viewed_lecture_id"];
            isOneToOne: false;
            referencedRelation: "lecture";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "enrollment_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      lecture: {
        Row: {
          access_type:
            | Database["public"]["Enums"]["lecture_access_type"]
            | null;
          course_id: number | null;
          created_at: string | null;
          description: string | null;
          duration_secs: number | null;
          id: number;
          module_id: number | null;
          sequence: number;
          title: string;
          updated_at: string | null;
          video_url: string | null;
        };
        Insert: {
          access_type?:
            | Database["public"]["Enums"]["lecture_access_type"]
            | null;
          course_id?: number | null;
          created_at?: string | null;
          description?: string | null;
          duration_secs?: number | null;
          id?: number;
          module_id?: number | null;
          sequence: number;
          title: string;
          updated_at?: string | null;
          video_url?: string | null;
        };
        Update: {
          access_type?:
            | Database["public"]["Enums"]["lecture_access_type"]
            | null;
          course_id?: number | null;
          created_at?: string | null;
          description?: string | null;
          duration_secs?: number | null;
          id?: number;
          module_id?: number | null;
          sequence?: number;
          title?: string;
          updated_at?: string | null;
          video_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "lecture_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "course";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lecture_module_id_fkey";
            columns: ["module_id"];
            isOneToOne: false;
            referencedRelation: "module";
            referencedColumns: ["id"];
          },
        ];
      };
      lecture_keypoint: {
        Row: {
          content: string;
          created_at: string | null;
          id: number;
          lecture_id: number | null;
          sequence: number | null;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          id?: number;
          lecture_id?: number | null;
          sequence?: number | null;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          id?: number;
          lecture_id?: number | null;
          sequence?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "lecture_keypoint_lecture_id_fkey";
            columns: ["lecture_id"];
            isOneToOne: false;
            referencedRelation: "lecture";
            referencedColumns: ["id"];
          },
        ];
      };
      lecture_material: {
        Row: {
          created_at: string | null;
          file_url: string;
          id: number;
          lecture_id: number | null;
          title: string;
        };
        Insert: {
          created_at?: string | null;
          file_url: string;
          id?: number;
          lecture_id?: number | null;
          title: string;
        };
        Update: {
          created_at?: string | null;
          file_url?: string;
          id?: number;
          lecture_id?: number | null;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lecture_material_lecture_id_fkey";
            columns: ["lecture_id"];
            isOneToOne: false;
            referencedRelation: "lecture";
            referencedColumns: ["id"];
          },
        ];
      };
      lecture_progress: {
        Row: {
          id: number;
          is_completed: boolean | null;
          lecture_id: number | null;
          progress_secs: number | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          id?: number;
          is_completed?: boolean | null;
          lecture_id?: number | null;
          progress_secs?: number | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          id?: number;
          is_completed?: boolean | null;
          lecture_id?: number | null;
          progress_secs?: number | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "lecture_progress_lecture_id_fkey";
            columns: ["lecture_id"];
            isOneToOne: false;
            referencedRelation: "lecture";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lecture_progress_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      module: {
        Row: {
          course_id: number | null;
          id: number;
          sequence: number;
          title: string;
        };
        Insert: {
          course_id?: number | null;
          id?: number;
          sequence: number;
          title: string;
        };
        Update: {
          course_id?: number | null;
          id?: number;
          sequence?: number;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "module_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "course";
            referencedColumns: ["id"];
          },
        ];
      };
      payment: {
        Row: {
          amount: number;
          course_id: number;
          created_at: string | null;
          currency: string | null;
          external_payment_id: string | null;
          id: number;
          paid_at: string | null;
          payment_data: Json | null;
          payment_method: string | null;
          payment_provider: string | null;
          status: Database["public"]["Enums"]["payment_status"] | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          amount: number;
          course_id: number;
          created_at?: string | null;
          currency?: string | null;
          external_payment_id?: string | null;
          id?: number;
          paid_at?: string | null;
          payment_data?: Json | null;
          payment_method?: string | null;
          payment_provider?: string | null;
          status?: Database["public"]["Enums"]["payment_status"] | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          amount?: number;
          course_id?: number;
          created_at?: string | null;
          currency?: string | null;
          external_payment_id?: string | null;
          id?: number;
          paid_at?: string | null;
          payment_data?: Json | null;
          payment_method?: string | null;
          payment_provider?: string | null;
          status?: Database["public"]["Enums"]["payment_status"] | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payment_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "course";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payment_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      post_attachments: {
        Row: {
          created_at: string | null;
          file_size: number;
          file_type: string;
          id: number;
          original_file_name: string;
          post_id: number;
          stored_file_path: string;
        };
        Insert: {
          created_at?: string | null;
          file_size: number;
          file_type: string;
          id?: number;
          original_file_name: string;
          post_id: number;
          stored_file_path: string;
        };
        Update: {
          created_at?: string | null;
          file_size?: number;
          file_type?: string;
          id?: number;
          original_file_name?: string;
          post_id?: number;
          stored_file_path?: string;
        };
        Relationships: [
          {
            foreignKeyName: "post_attachments_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
        ];
      };
      post_likes: {
        Row: {
          created_at: string | null;
          id: number;
          post_id: number | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          post_id?: number | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          post_id?: number | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "post_likes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
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
          category_id: number;
          comment_count: number | null;
          content: string | null;
          created_at: string | null;
          id: number;
          is_pinned: boolean | null;
          like_count: number | null;
          title: string;
          updated_at: string | null;
          view_count: number | null;
        };
        Insert: {
          author_id: string;
          category_id: number;
          comment_count?: number | null;
          content?: string | null;
          created_at?: string | null;
          id?: number;
          is_pinned?: boolean | null;
          like_count?: number | null;
          title: string;
          updated_at?: string | null;
          view_count?: number | null;
        };
        Update: {
          author_id?: string;
          category_id?: number;
          comment_count?: number | null;
          content?: string | null;
          created_at?: string | null;
          id?: number;
          is_pinned?: boolean | null;
          like_count?: number | null;
          title?: string;
          updated_at?: string | null;
          view_count?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
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
          created_at: string | null;
          full_name: string | null;
          id: string;
          role: Database["public"]["Enums"]["user_role"];
          updated_at: string | null;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          full_name?: string | null;
          id: string;
          role?: Database["public"]["Enums"]["user_role"];
          updated_at?: string | null;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          full_name?: string | null;
          id?: string;
          role?: Database["public"]["Enums"]["user_role"];
          updated_at?: string | null;
          username?: string | null;
        };
        Relationships: [];
      };
      related_course: {
        Row: {
          course_a_id: number | null;
          course_b_id: number | null;
          created_at: string | null;
          id: number;
        };
        Insert: {
          course_a_id?: number | null;
          course_b_id?: number | null;
          created_at?: string | null;
          id?: number;
        };
        Update: {
          course_a_id?: number | null;
          course_b_id?: number | null;
          created_at?: string | null;
          id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "related_course_course_a_id_fkey";
            columns: ["course_a_id"];
            isOneToOne: false;
            referencedRelation: "course";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "related_course_course_b_id_fkey";
            columns: ["course_b_id"];
            isOneToOne: false;
            referencedRelation: "course";
            referencedColumns: ["id"];
          },
        ];
      };
      tags: {
        Row: {
          color: string | null;
          created_at: string | null;
          description: string | null;
          id: number;
          name: string;
        };
        Insert: {
          color?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: number;
          name: string;
        };
        Update: {
          color?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_post_in_category: {
        Args: { category_id_param: number };
        Returns: boolean;
      };
      delete_comment_rpc: {
        Args: { comment_id: number };
        Returns: boolean;
      };
      delete_post_with_cleanup: {
        Args: { p_post_id: number; p_user_id: string };
        Returns: Json;
      };
      get_post_attachment_count: {
        Args: { post_id_param: number };
        Returns: number;
      };
      get_post_total_attachment_size: {
        Args: { post_id_param: number };
        Returns: number;
      };
      get_posts_with_details: {
        Args: {
          request_user_id: string;
          page_limit?: number;
          page_offset?: number;
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
      get_user_role: {
        Args: { user_id?: string };
        Returns: Database["public"]["Enums"]["user_role"];
      };
      get_user_total_attachment_size: {
        Args: { user_id_param: string };
        Returns: number;
      };
      has_minimum_role: {
        Args: {
          required_role: Database["public"]["Enums"]["user_role"];
          user_id?: string;
        };
        Returns: boolean;
      };
      is_admin: {
        Args: { user_id?: string };
        Returns: boolean;
      };
      is_own_resource: {
        Args: { resource_user_id: string; user_id?: string };
        Returns: boolean;
      };
      toggle_comment_like_rpc: {
        Args: { comment_id_param: number };
        Returns: boolean;
      };
      toggle_post_like_rpc: {
        Args: { post_id_param: number };
        Returns: boolean;
      };
      update_post_with_attachments: {
        Args: {
          p_post_id: number;
          p_user_id: string;
          p_title?: string;
          p_content?: string;
          p_category_id?: number;
          p_tag_ids?: number[];
          p_delete_attachment_ids?: number[];
          p_add_attachments?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      course_status: "draft" | "published" | "archived";
      difficulty_level: "입문" | "초급" | "중급" | "고급";
      enrollment_status: "수강전" | "수강중" | "완강";
      lecture_access_type: "free" | "preview" | "paid";
      payment_status: "pending" | "completed" | "failed" | "refunded";
      user_role: "user" | "instructor" | "manager" | "admin";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      course_status: ["draft", "published", "archived"],
      difficulty_level: ["입문", "초급", "중급", "고급"],
      enrollment_status: ["수강전", "수강중", "완강"],
      lecture_access_type: ["free", "preview", "paid"],
      payment_status: ["pending", "completed", "failed", "refunded"],
      user_role: ["user", "instructor", "manager", "admin"],
    },
  },
} as const;
