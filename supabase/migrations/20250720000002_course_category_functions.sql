-- 코스 카테고리 통계 조회를 위한 RPC 함수 (CTE 사용으로 성능 최적화)
CREATE OR REPLACE FUNCTION get_course_category_stats()
RETURNS TABLE (
  category_id INT,
  course_count BIGINT,
  published_course_count BIGINT,
  total_enrollments BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH course_stats AS (
    -- course 테이블 기준으로 정확한 통계
    SELECT 
      c.category_id,
      COUNT(*) AS course_count,
      COUNT(*) FILTER (WHERE c.status = 'published') AS published_course_count
    FROM course c
    GROUP BY c.category_id
  ),
  enrollment_stats AS (
    -- 각 카테고리별 총 수강생 수
    SELECT 
      c.category_id,
      COUNT(DISTINCT e.user_id) AS total_enrollments
    FROM course c
    INNER JOIN enrollment e ON c.id = e.course_id
    WHERE c.status = 'published'
    GROUP BY c.category_id
  )
  SELECT 
    cc.id AS category_id,
    COALESCE(cs.course_count, 0) AS course_count,
    COALESCE(cs.published_course_count, 0) AS published_course_count,
    COALESCE(es.total_enrollments, 0) AS total_enrollments
  FROM course_category cc
  LEFT JOIN course_stats cs ON cc.id = cs.category_id
  LEFT JOIN enrollment_stats es ON cc.id = es.category_id
  ORDER BY cc.id;
END;
$$;

-- 카테고리 순서 변경을 위한 RPC 함수 (Set-based 연산으로 최적화)
CREATE OR REPLACE FUNCTION reorder_course_categories(
  category_updates JSONB
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  -- 단일 UPDATE 문으로 모든 순서 변경을 한 번에 처리
  UPDATE course_category cc
  SET display_order = (updates.item->>'display_order')::INT
  FROM (
    SELECT jsonb_array_elements(category_updates) AS item
  ) updates
  WHERE cc.id = (updates.item->>'id')::INT;
END;
$$;

-- 카테고리 삭제 유효성 검사 함수 (이름 명확화)
CREATE OR REPLACE FUNCTION validate_course_category_deletion(
  category_id_to_delete INT
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  child_count INT;
  course_count INT;
  result JSONB;
BEGIN
  -- 하위 카테고리 개수 확인
  SELECT COUNT(*) INTO child_count
  FROM course_category
  WHERE parent_id = category_id_to_delete;
  
  -- 할당된 코스 개수 확인 (course 테이블 기준)
  SELECT COUNT(*) INTO course_count
  FROM course
  WHERE category_id = category_id_to_delete;
  
  -- 삭제 가능 여부 판단
  IF child_count > 0 THEN
    result := jsonb_build_object(
      'can_delete', false,
      'reason', 'has_children',
      'child_count', child_count,
      'course_count', course_count
    );
  ELSIF course_count > 0 THEN
    result := jsonb_build_object(
      'can_delete', false,
      'reason', 'has_courses',
      'child_count', child_count,
      'course_count', course_count
    );
  ELSE
    result := jsonb_build_object(
      'can_delete', true,
      'child_count', 0,
      'course_count', 0
    );
  END IF;
  
  RETURN result;
END;
$$;

-- 카테고리 이동 유효성 검사 함수 (Recursive CTE로 최적화)
CREATE OR REPLACE FUNCTION check_category_move_validity(
  category_id_to_move INT,
  new_parent_id INT
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  is_descendant BOOLEAN;
  depth_to_root INT;
  max_depth CONSTANT INT := 5;
  result JSONB;
BEGIN
  -- 자기 자신으로 이동하는 경우
  IF category_id_to_move = new_parent_id THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'self_reference'
    );
  END IF;
  
  -- NULL로 이동하는 경우 (최상위로 이동)
  IF new_parent_id IS NULL THEN
    RETURN jsonb_build_object('valid', true);
  END IF;
  
  -- Recursive CTE로 순환 참조 체크
  WITH RECURSIVE ancestors AS (
    -- Base case: 시작 노드
    SELECT id, parent_id, 1 AS depth
    FROM course_category
    WHERE id = new_parent_id
    
    UNION ALL
    
    -- Recursive case: 부모를 따라 올라감
    SELECT c.id, c.parent_id, a.depth + 1
    FROM course_category c
    INNER JOIN ancestors a ON c.id = a.parent_id
    WHERE a.depth < max_depth
  )
  SELECT 
    EXISTS(SELECT 1 FROM ancestors WHERE id = category_id_to_move),
    MAX(depth)
  INTO is_descendant, depth_to_root
  FROM ancestors;
  
  -- 순환 참조 체크
  IF is_descendant THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'circular_reference'
    );
  END IF;
  
  -- 최대 깊이 체크
  IF depth_to_root >= max_depth THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'max_depth_exceeded',
      'max_depth', max_depth,
      'current_depth', depth_to_root
    );
  END IF;
  
  RETURN jsonb_build_object('valid', true);
END;
$$;

-- 카테고리 트리 구조를 반환하는 유틸리티 함수
CREATE OR REPLACE FUNCTION get_course_category_tree(
  root_id INT DEFAULT NULL
)
RETURNS TABLE (
  id INT,
  name VARCHAR,
  slug VARCHAR,
  parent_id INT,
  display_order INT,
  is_active BOOLEAN,
  level INT,
  path TEXT[],
  has_children BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE category_tree AS (
    -- Base case: 루트 카테고리들
    SELECT 
      cc.id,
      cc.name,
      cc.slug,
      cc.parent_id,
      cc.display_order,
      cc.is_active,
      0 AS level,
      ARRAY[cc.name] AS path
    FROM course_category cc
    WHERE (root_id IS NULL AND cc.parent_id IS NULL) 
       OR (root_id IS NOT NULL AND cc.parent_id = root_id)
    
    UNION ALL
    
    -- Recursive case: 하위 카테고리들
    SELECT 
      cc.id,
      cc.name,
      cc.slug,
      cc.parent_id,
      cc.display_order,
      cc.is_active,
      ct.level + 1,
      ct.path || cc.name
    FROM course_category cc
    INNER JOIN category_tree ct ON cc.parent_id = ct.id
  )
  SELECT 
    ct.id,
    ct.name,
    ct.slug,
    ct.parent_id,
    ct.display_order,
    ct.is_active,
    ct.level,
    ct.path,
    EXISTS(SELECT 1 FROM course_category WHERE parent_id = ct.id) AS has_children
  FROM category_tree ct
  ORDER BY ct.path;
END;
$$;

-- 카테고리별 코스 통계 상세 조회 함수
CREATE OR REPLACE FUNCTION get_course_category_detailed_stats(
  category_id_param INT DEFAULT NULL
)
RETURNS TABLE (
  category_id INT,
  category_name VARCHAR,
  total_courses BIGINT,
  draft_courses BIGINT,
  published_courses BIGINT,
  archived_courses BIGINT,
  total_students BIGINT,
  total_revenue NUMERIC,
  avg_rating NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH course_counts AS (
    SELECT 
      c.category_id,
      COUNT(*) AS total_courses,
      COUNT(*) FILTER (WHERE c.status = 'draft') AS draft_courses,
      COUNT(*) FILTER (WHERE c.status = 'published') AS published_courses,
      COUNT(*) FILTER (WHERE c.status = 'archived') AS archived_courses
    FROM course c
    WHERE category_id_param IS NULL OR c.category_id = category_id_param
    GROUP BY c.category_id
  ),
  enrollment_counts AS (
    SELECT 
      c.category_id,
      COUNT(DISTINCT e.user_id) AS total_students
    FROM course c
    INNER JOIN enrollment e ON c.id = e.course_id
    WHERE category_id_param IS NULL OR c.category_id = category_id_param
    GROUP BY c.category_id
  ),
  revenue_stats AS (
    SELECT 
      c.category_id,
      SUM(p.amount) AS total_revenue
    FROM course c
    INNER JOIN payment p ON c.id = p.course_id
    WHERE p.status = 'completed'
      AND (category_id_param IS NULL OR c.category_id = category_id_param)
    GROUP BY c.category_id
  ),
  rating_stats AS (
    SELECT 
      c.category_id,
      AVG(cr.rating) AS avg_rating
    FROM course c
    INNER JOIN course_review cr ON c.id = cr.course_id
    WHERE category_id_param IS NULL OR c.category_id = category_id_param
    GROUP BY c.category_id
  )
  SELECT 
    cc.id AS category_id,
    cc.name AS category_name,
    COALESCE(counts.total_courses, 0) AS total_courses,
    COALESCE(counts.draft_courses, 0) AS draft_courses,
    COALESCE(counts.published_courses, 0) AS published_courses,
    COALESCE(counts.archived_courses, 0) AS archived_courses,
    COALESCE(enrollments.total_students, 0) AS total_students,
    COALESCE(revenue.total_revenue, 0) AS total_revenue,
    ROUND(COALESCE(ratings.avg_rating, 0), 2) AS avg_rating
  FROM course_category cc
  LEFT JOIN course_counts counts ON cc.id = counts.category_id
  LEFT JOIN enrollment_counts enrollments ON cc.id = enrollments.category_id
  LEFT JOIN revenue_stats revenue ON cc.id = revenue.category_id
  LEFT JOIN rating_stats ratings ON cc.id = ratings.category_id
  WHERE category_id_param IS NULL OR cc.id = category_id_param
  ORDER BY cc.display_order;
END;
$$;