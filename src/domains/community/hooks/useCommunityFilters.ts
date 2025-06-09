import { useState } from "react";
import type { SortOption } from "../types/index";
import { SORT_OPTIONS, DEFAULT_CATEGORY } from "../types/index";
import type { Category } from "@/domains/category/types";

export const useCommunityFilters = (categories: Category[]) => {
  const [sortOption, setSortOption] = useState<SortOption>(
    SORT_OPTIONS.DEFAULT,
  );
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const getUniqueCategories = () => {
    const allCategories = [
      { id: "all", label: DEFAULT_CATEGORY },
      ...categories.map((cat) => ({
        id: cat.name.toLowerCase(),
        label: cat.name,
      })),
    ];
    return allCategories;
  };

  const visibleCategories = showAllCategories
    ? getUniqueCategories()
    : getUniqueCategories().slice(0, 5);

  const toggleCategories = () => {
    setShowAllCategories(!showAllCategories);
  };

  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return {
    sortOption,
    selectedCategory,
    showAllCategories,
    visibleCategories,
    setSortOption: handleSortChange,
    setSelectedCategory: handleCategoryChange,
    toggleCategories,
  };
};
