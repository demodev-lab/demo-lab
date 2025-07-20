import type { CourseCategory, CategoryTreeNode, CategoryPath } from "../types";

/**
 * 플랫 카테고리 목록을 트리 구조로 변환
 */
export function buildCategoryTree(
  categories: CourseCategory[],
  parentId: number | null = null,
  level = 0,
  parentPath: number[] = [],
): CategoryTreeNode[] {
  return categories
    .filter((category) => category.parent_id === parentId)
    .map((category) => {
      const currentPath = [...parentPath, category.id];
      const children = buildCategoryTree(
        categories,
        category.id,
        level + 1,
        currentPath,
      );

      return {
        ...category,
        children,
        level,
        parentPath: parentPath,
      };
    })
    .sort((a, b) => a.display_order - b.display_order);
}

/**
 * 트리 구조를 플랫 목록으로 변환 (DFS 순회)
 */
export function flattenCategoryTree(
  tree: CategoryTreeNode[],
): CategoryTreeNode[] {
  const result: CategoryTreeNode[] = [];

  function traverse(nodes: CategoryTreeNode[]) {
    for (const node of nodes) {
      result.push(node);
      if (node.children.length > 0) {
        traverse(node.children);
      }
    }
  }

  traverse(tree);
  return result;
}

/**
 * 특정 카테고리의 전체 경로를 반환
 */
export function getCategoryPath(
  categories: CourseCategory[],
  categoryId: number,
): CategoryPath[] {
  const categoryMap = new Map<number, CourseCategory>();
  categories.forEach((cat) => categoryMap.set(cat.id, cat));

  const path: CategoryPath[] = [];
  let currentId: number | null = categoryId;

  while (currentId !== null) {
    const category = categoryMap.get(currentId);
    if (!category) break;

    path.unshift({
      id: category.id,
      name: category.name,
      slug: category.slug,
    });

    currentId = category.parent_id;
  }

  return path;
}

/**
 * 특정 카테고리의 모든 하위 카테고리 ID 반환
 */
export function getDescendantCategoryIds(
  categories: CourseCategory[],
  parentId: number,
): number[] {
  const result: number[] = [];
  const children = categories.filter((cat) => cat.parent_id === parentId);

  for (const child of children) {
    result.push(child.id);
    result.push(...getDescendantCategoryIds(categories, child.id));
  }

  return result;
}

/**
 * 카테고리 트리에서 특정 노드 찾기
 */
export function findCategoryInTree(
  tree: CategoryTreeNode[],
  categoryId: number,
): CategoryTreeNode | null {
  for (const node of tree) {
    if (node.id === categoryId) {
      return node;
    }
    const found = findCategoryInTree(node.children, categoryId);
    if (found) {
      return found;
    }
  }
  return null;
}

/**
 * 카테고리 이동 시 순환 참조 검사
 */
export function wouldCreateCircularReference(
  categories: CourseCategory[],
  categoryId: number,
  newParentId: number | null,
): boolean {
  if (newParentId === null) return false;
  if (categoryId === newParentId) return true;

  const descendantIds = getDescendantCategoryIds(categories, categoryId);
  return descendantIds.includes(newParentId);
}

/**
 * 카테고리 깊이 계산
 */
export function getCategoryDepth(
  categories: CourseCategory[],
  categoryId: number,
): number {
  const categoryMap = new Map<number, CourseCategory>();
  categories.forEach((cat) => categoryMap.set(cat.id, cat));

  let depth = 0;
  let currentId: number | null = categoryId;

  while (currentId !== null) {
    const category = categoryMap.get(currentId);
    if (!category) break;
    depth++;
    currentId = category.parent_id;
  }

  return depth;
}

/**
 * 카테고리 표시명 생성 (들여쓰기 포함)
 */
export function getIndentedCategoryName(
  category: CategoryTreeNode,
  indentSymbol = "└─ ",
  levelSymbol = "   ",
): string {
  const indent =
    levelSymbol.repeat(category.level) +
    (category.level > 0 ? indentSymbol : "");
  return indent + category.name;
}
