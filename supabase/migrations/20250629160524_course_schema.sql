-- Create ENUM types
CREATE TYPE course_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE course_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE lecture_status AS ENUM ('draft', 'published', 'archived');

-- Create course table
CREATE TABLE course (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    thumbnail_url TEXT,
    price DECIMAL(10, 2) DEFAULT 0,
    is_free BOOLEAN DEFAULT false,
    status course_status DEFAULT 'draft',
    level course_level DEFAULT 'beginner',
    duration_hours INTEGER,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMPTZ,
    archived_at TIMESTAMPTZ
);

-- Create course_application table
CREATE TABLE course_application (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES course(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status application_status DEFAULT 'pending',
    message TEXT,
    admin_note TEXT,
    processed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, user_id)
);

-- Create course_instructor table
CREATE TABLE course_instructor (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES course(id) ON DELETE CASCADE,
    instructor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, instructor_id)
);

-- Create course_learning_goal table
CREATE TABLE course_learning_goal (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES course(id) ON DELETE CASCADE,
    goal TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create background_knowledge table
CREATE TABLE background_knowledge (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES course(id) ON DELETE CASCADE,
    knowledge TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create module table
CREATE TABLE module (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES course(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create lecture table
CREATE TABLE lecture (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES module(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url TEXT,
    duration_minutes INTEGER,
    display_order INTEGER DEFAULT 0,
    status lecture_status DEFAULT 'draft',
    is_preview BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMPTZ
);

-- Create enrollment table
CREATE TABLE enrollment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES course(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ,
    progress_percentage DECIMAL(5, 2) DEFAULT 0,
    last_accessed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, user_id)
);

-- Create lecture_progress table
CREATE TABLE lecture_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID REFERENCES enrollment(id) ON DELETE CASCADE,
    lecture_id UUID REFERENCES lecture(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT false,
    progress_percentage DECIMAL(5, 2) DEFAULT 0,
    last_position_seconds INTEGER DEFAULT 0,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(enrollment_id, lecture_id)
);

-- Create lecture_keypoint table
CREATE TABLE lecture_keypoint (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lecture_id UUID REFERENCES lecture(id) ON DELETE CASCADE,
    keypoint TEXT NOT NULL,
    timestamp_seconds INTEGER,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create lecture_material table
CREATE TABLE lecture_material (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lecture_id UUID REFERENCES lecture(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50),
    file_size_bytes BIGINT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create related_course table
CREATE TABLE related_course (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES course(id) ON DELETE CASCADE,
    related_course_id UUID REFERENCES course(id) ON DELETE CASCADE,
    relation_type VARCHAR(50), -- 'prerequisite', 'recommended', 'next_level'
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, related_course_id),
    CHECK (course_id != related_course_id)
);

-- Create indexes
CREATE INDEX idx_course_status ON course(status);
CREATE INDEX idx_course_created_by ON course(created_by);
CREATE INDEX idx_course_slug ON course(slug);
CREATE INDEX idx_course_published_at ON course(published_at);

CREATE INDEX idx_course_application_course_id ON course_application(course_id);
CREATE INDEX idx_course_application_user_id ON course_application(user_id);
CREATE INDEX idx_course_application_status ON course_application(status);

CREATE INDEX idx_course_instructor_course_id ON course_instructor(course_id);
CREATE INDEX idx_course_instructor_instructor_id ON course_instructor(instructor_id);

CREATE INDEX idx_course_learning_goal_course_id ON course_learning_goal(course_id);
CREATE INDEX idx_background_knowledge_course_id ON background_knowledge(course_id);

CREATE INDEX idx_module_course_id ON module(course_id);
CREATE INDEX idx_module_display_order ON module(course_id, display_order);

CREATE INDEX idx_lecture_module_id ON lecture(module_id);
CREATE INDEX idx_lecture_display_order ON lecture(module_id, display_order);
CREATE INDEX idx_lecture_status ON lecture(status);

CREATE INDEX idx_enrollment_course_id ON enrollment(course_id);
CREATE INDEX idx_enrollment_user_id ON enrollment(user_id);
CREATE INDEX idx_enrollment_enrolled_at ON enrollment(enrolled_at);

CREATE INDEX idx_lecture_progress_enrollment_id ON lecture_progress(enrollment_id);
CREATE INDEX idx_lecture_progress_lecture_id ON lecture_progress(lecture_id);

CREATE INDEX idx_lecture_keypoint_lecture_id ON lecture_keypoint(lecture_id);
CREATE INDEX idx_lecture_material_lecture_id ON lecture_material(lecture_id);

CREATE INDEX idx_related_course_course_id ON related_course(course_id);
CREATE INDEX idx_related_course_related_course_id ON related_course(related_course_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_course_updated_at
    BEFORE UPDATE ON course
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_course_application_updated_at
    BEFORE UPDATE ON course_application
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_module_updated_at
    BEFORE UPDATE ON module
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_lecture_updated_at
    BEFORE UPDATE ON lecture
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_enrollment_updated_at
    BEFORE UPDATE ON enrollment
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_lecture_progress_updated_at
    BEFORE UPDATE ON lecture_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Enable RLS
ALTER TABLE course ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_application ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_instructor ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_learning_goal ENABLE ROW LEVEL SECURITY;
ALTER TABLE background_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE module ENABLE ROW LEVEL SECURITY;
ALTER TABLE lecture ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollment ENABLE ROW LEVEL SECURITY;
ALTER TABLE lecture_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE lecture_keypoint ENABLE ROW LEVEL SECURITY;
ALTER TABLE lecture_material ENABLE ROW LEVEL SECURITY;
ALTER TABLE related_course ENABLE ROW LEVEL SECURITY;

-- RLS Policies for course table
CREATE POLICY "Anyone can view published courses"
    ON course FOR SELECT
    USING (status = 'published');

CREATE POLICY "Instructors can view their own courses"
    ON course FOR SELECT
    USING (
        auth.uid() = created_by OR
        EXISTS (
            SELECT 1 FROM course_instructor
            WHERE course_instructor.course_id = course.id
            AND course_instructor.instructor_id = auth.uid()
        )
    );

CREATE POLICY "Instructors can create courses"
    ON course FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_role
            WHERE user_role.user_id = auth.uid()
            AND user_role.role = 'instructor'
        )
    );

CREATE POLICY "Instructors can update their own courses"
    ON course FOR UPDATE
    USING (
        auth.uid() = created_by OR
        EXISTS (
            SELECT 1 FROM course_instructor
            WHERE course_instructor.course_id = course.id
            AND course_instructor.instructor_id = auth.uid()
        )
    );

CREATE POLICY "Instructors can delete their own courses"
    ON course FOR DELETE
    USING (auth.uid() = created_by);

-- RLS Policies for course_application
CREATE POLICY "Users can view their own applications"
    ON course_application FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Instructors can view applications for their courses"
    ON course_application FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM course
            WHERE course.id = course_application.course_id
            AND (
                course.created_by = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM course_instructor
                    WHERE course_instructor.course_id = course.id
                    AND course_instructor.instructor_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "Users can create applications"
    ON course_application FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Instructors can update applications for their courses"
    ON course_application FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM course
            WHERE course.id = course_application.course_id
            AND (
                course.created_by = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM course_instructor
                    WHERE course_instructor.course_id = course.id
                    AND course_instructor.instructor_id = auth.uid()
                )
            )
        )
    );

-- RLS Policies for course_instructor
CREATE POLICY "Anyone can view course instructors"
    ON course_instructor FOR SELECT
    USING (true);

CREATE POLICY "Course creators can manage instructors"
    ON course_instructor FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM course
            WHERE course.id = course_instructor.course_id
            AND course.created_by = auth.uid()
        )
    );

-- RLS Policies for course_learning_goal
CREATE POLICY "Anyone can view learning goals for published courses"
    ON course_learning_goal FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM course
            WHERE course.id = course_learning_goal.course_id
            AND course.status = 'published'
        )
    );

CREATE POLICY "Instructors can manage learning goals"
    ON course_learning_goal FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM course
            WHERE course.id = course_learning_goal.course_id
            AND (
                course.created_by = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM course_instructor
                    WHERE course_instructor.course_id = course.id
                    AND course_instructor.instructor_id = auth.uid()
                )
            )
        )
    );

-- RLS Policies for background_knowledge
CREATE POLICY "Anyone can view background knowledge for published courses"
    ON background_knowledge FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM course
            WHERE course.id = background_knowledge.course_id
            AND course.status = 'published'
        )
    );

CREATE POLICY "Instructors can manage background knowledge"
    ON background_knowledge FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM course
            WHERE course.id = background_knowledge.course_id
            AND (
                course.created_by = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM course_instructor
                    WHERE course_instructor.course_id = course.id
                    AND course_instructor.instructor_id = auth.uid()
                )
            )
        )
    );

-- RLS Policies for module
CREATE POLICY "Anyone can view modules for published courses"
    ON module FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM course
            WHERE course.id = module.course_id
            AND course.status = 'published'
        )
    );

CREATE POLICY "Enrolled users can view modules"
    ON module FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM enrollment
            WHERE enrollment.course_id = module.course_id
            AND enrollment.user_id = auth.uid()
        )
    );

CREATE POLICY "Instructors can manage modules"
    ON module FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM course
            WHERE course.id = module.course_id
            AND (
                course.created_by = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM course_instructor
                    WHERE course_instructor.course_id = course.id
                    AND course_instructor.instructor_id = auth.uid()
                )
            )
        )
    );

-- RLS Policies for lecture
CREATE POLICY "Anyone can view preview lectures"
    ON lecture FOR SELECT
    USING (is_preview = true AND status = 'published');

CREATE POLICY "Enrolled users can view lectures"
    ON lecture FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM module
            JOIN enrollment ON enrollment.course_id = module.course_id
            WHERE module.id = lecture.module_id
            AND enrollment.user_id = auth.uid()
        )
    );

CREATE POLICY "Instructors can manage lectures"
    ON lecture FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM module
            JOIN course ON course.id = module.course_id
            WHERE module.id = lecture.module_id
            AND (
                course.created_by = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM course_instructor
                    WHERE course_instructor.course_id = course.id
                    AND course_instructor.instructor_id = auth.uid()
                )
            )
        )
    );

-- RLS Policies for enrollment
CREATE POLICY "Users can view their own enrollments"
    ON enrollment FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Instructors can view enrollments for their courses"
    ON enrollment FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM course
            WHERE course.id = enrollment.course_id
            AND (
                course.created_by = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM course_instructor
                    WHERE course_instructor.course_id = course.id
                    AND course_instructor.instructor_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "Users can create their own enrollments"
    ON enrollment FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enrollments"
    ON enrollment FOR UPDATE
    USING (auth.uid() = user_id);

-- RLS Policies for lecture_progress
CREATE POLICY "Users can manage their own progress"
    ON lecture_progress FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM enrollment
            WHERE enrollment.id = lecture_progress.enrollment_id
            AND enrollment.user_id = auth.uid()
        )
    );

-- RLS Policies for lecture_keypoint
CREATE POLICY "Anyone can view keypoints for accessible lectures"
    ON lecture_keypoint FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM lecture
            WHERE lecture.id = lecture_keypoint.lecture_id
            AND (
                lecture.is_preview = true OR
                EXISTS (
                    SELECT 1 FROM module
                    JOIN enrollment ON enrollment.course_id = module.course_id
                    WHERE module.id = lecture.module_id
                    AND enrollment.user_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "Instructors can manage keypoints"
    ON lecture_keypoint FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM lecture
            JOIN module ON module.id = lecture.module_id
            JOIN course ON course.id = module.course_id
            WHERE lecture.id = lecture_keypoint.lecture_id
            AND (
                course.created_by = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM course_instructor
                    WHERE course_instructor.course_id = course.id
                    AND course_instructor.instructor_id = auth.uid()
                )
            )
        )
    );

-- RLS Policies for lecture_material
CREATE POLICY "Enrolled users can view materials"
    ON lecture_material FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM lecture
            JOIN module ON module.id = lecture.module_id
            JOIN enrollment ON enrollment.course_id = module.course_id
            WHERE lecture.id = lecture_material.lecture_id
            AND enrollment.user_id = auth.uid()
        )
    );

CREATE POLICY "Instructors can manage materials"
    ON lecture_material FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM lecture
            JOIN module ON module.id = lecture.module_id
            JOIN course ON course.id = module.course_id
            WHERE lecture.id = lecture_material.lecture_id
            AND (
                course.created_by = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM course_instructor
                    WHERE course_instructor.course_id = course.id
                    AND course_instructor.instructor_id = auth.uid()
                )
            )
        )
    );

-- RLS Policies for related_course
CREATE POLICY "Anyone can view related courses for published courses"
    ON related_course FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM course
            WHERE course.id = related_course.course_id
            AND course.status = 'published'
        )
    );

CREATE POLICY "Instructors can manage related courses"
    ON related_course FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM course
            WHERE course.id = related_course.course_id
            AND (
                course.created_by = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM course_instructor
                    WHERE course_instructor.course_id = course.id
                    AND course_instructor.instructor_id = auth.uid()
                )
            )
        )
    );