// Tree utilities
export {
  buildCategoryTree,
  flattenCategoryTree,
  getCategoryPath,
  getDescendantCategoryIds,
  findCategoryInTree,
  wouldCreateCircularReference,
  getCategoryDepth,
  getIndentedCategoryName,
} from "./categoryTreeUtils";

// Validation utilities
export {
  hasChildren,
  canDeleteCategory,
  validateCategoryName,
  validateCategorySlug,
  validateCategoryMove,
} from "./categoryValidation";
