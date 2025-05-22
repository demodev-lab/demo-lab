import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Pencil, Trash, Plus } from "lucide-react";
import { Category, Tag, useCommunityStore } from "@/utils/lib/communityService";

interface CategoryTagManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CategoryTagManager({
  open,
  onOpenChange,
}: CategoryTagManagerProps) {
  const {
    categories,
    tags,
    addCategory,
    updateCategory,
    deleteCategory,
    addTag,
    updateTag,
    deleteTag,
  } = useCommunityStore();
  const [activeTab, setActiveTab] = useState("categories");

  // 카테고리 관리 상태
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    color: "#000000",
  });
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null,
  );

  // 태그 관리 상태
  const [tagForm, setTagForm] = useState({ name: "" });
  const [editingTagId, setEditingTagId] = useState<number | null>(null);

  // 카테고리 관련 핸들러
  const handleCategorySubmit = () => {
    if (!categoryForm.name.trim()) return;

    if (editingCategoryId) {
      updateCategory(editingCategoryId, {
        name: categoryForm.name,
        description: categoryForm.description,
        color: categoryForm.color,
      });
    } else {
      const newCategory: Category = {
        id: Math.max(0, ...categories.map((c) => c.id)) + 1,
        name: categoryForm.name,
        description: categoryForm.description,
        color: categoryForm.color,
        postCount: 0,
      };
      addCategory(newCategory);
    }

    // 폼 초기화
    setCategoryForm({ name: "", description: "", color: "#000000" });
    setEditingCategoryId(null);
  };

  const handleEditCategory = (category: Category) => {
    setCategoryForm({
      name: category.name,
      description: category.description,
      color: category.color,
    });
    setEditingCategoryId(category.id);
  };

  const handleCancelCategoryEdit = () => {
    setCategoryForm({ name: "", description: "", color: "#000000" });
    setEditingCategoryId(null);
  };

  const handleDeleteCategory = (categoryId: number) => {
    if (
      window.confirm(
        "정말 삭제하시겠습니까? 연결된 게시글의 카테고리는 '미분류'로 변경됩니다.",
      )
    ) {
      deleteCategory(categoryId);
    }
  };

  // 태그 관련 핸들러
  const handleTagSubmit = () => {
    if (!tagForm.name.trim()) return;

    if (editingTagId) {
      updateTag(editingTagId, { name: tagForm.name });
    } else {
      const newTag: Tag = {
        id: Math.max(0, ...tags.map((t) => t.id)) + 1,
        name: tagForm.name,
        postCount: 0,
      };
      addTag(newTag);
    }

    // 폼 초기화
    setTagForm({ name: "" });
    setEditingTagId(null);
  };

  const handleEditTag = (tag: Tag) => {
    setTagForm({ name: tag.name });
    setEditingTagId(tag.id);
  };

  const handleCancelTagEdit = () => {
    setTagForm({ name: "" });
    setEditingTagId(null);
  };

  const handleDeleteTag = (tagId: number) => {
    if (
      window.confirm(
        "정말 삭제하시겠습니까? 연결된 게시글에서 해당 태그가 제거됩니다.",
      )
    ) {
      deleteTag(tagId);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>카테고리 및 태그 관리</DialogTitle>
          <DialogDescription>
            커뮤니티에서 사용하는 카테고리와 태그를 관리할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="categories">카테고리</TabsTrigger>
            <TabsTrigger value="tags">태그</TabsTrigger>
          </TabsList>

          {/* 카테고리 관리 탭 */}
          <TabsContent value="categories" className="space-y-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="category-name">카테고리 이름</Label>
                <Input
                  id="category-name"
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, name: e.target.value })
                  }
                  placeholder="카테고리 이름"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category-description">설명</Label>
                <Input
                  id="category-description"
                  value={categoryForm.description}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="카테고리 설명"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category-color">색상</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="category-color"
                    type="color"
                    value={categoryForm.color}
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        color: e.target.value,
                      })
                    }
                    className="w-16 h-10"
                  />
                  <Badge
                    style={{ backgroundColor: categoryForm.color }}
                    className="text-white"
                  >
                    {categoryForm.name || "미리보기"}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                {editingCategoryId && (
                  <Button variant="outline" onClick={handleCancelCategoryEdit}>
                    취소
                  </Button>
                )}
                <Button
                  onClick={handleCategorySubmit}
                  disabled={!categoryForm.name.trim()}
                >
                  {editingCategoryId ? "수정" : "추가"}
                </Button>
              </div>
            </div>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>설명</TableHead>
                    <TableHead>색상</TableHead>
                    <TableHead>사용</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center h-24 text-muted-foreground"
                      >
                        등록된 카테고리가 없습니다
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">
                          <Badge
                            style={{ backgroundColor: category.color }}
                            className="text-white"
                          >
                            {category.name}
                          </Badge>
                        </TableCell>
                        <TableCell>{category.description}</TableCell>
                        <TableCell>
                          <div
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: category.color }}
                          ></div>
                        </TableCell>
                        <TableCell>{category.postCount}개</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditCategory(category)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* 태그 관리 탭 */}
          <TabsContent value="tags" className="space-y-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="tag-name">태그 이름</Label>
                <div className="flex gap-2">
                  <Input
                    id="tag-name"
                    value={tagForm.name}
                    onChange={(e) =>
                      setTagForm({ ...tagForm, name: e.target.value })
                    }
                    placeholder="태그 이름"
                  />
                  <Button
                    onClick={handleTagSubmit}
                    disabled={!tagForm.name.trim()}
                  >
                    {editingTagId ? (
                      <Pencil className="h-4 w-4 mr-2" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    {editingTagId ? "수정" : "추가"}
                  </Button>
                  {editingTagId && (
                    <Button variant="outline" onClick={handleCancelTagEdit}>
                      취소
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>사용</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tags.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center h-24 text-muted-foreground"
                      >
                        등록된 태그가 없습니다
                      </TableCell>
                    </TableRow>
                  ) : (
                    tags.map((tag) => (
                      <TableRow key={tag.id}>
                        <TableCell className="font-medium">
                          <Badge variant="outline">{tag.name}</Badge>
                        </TableCell>
                        <TableCell>{tag.postCount}개</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditTag(tag)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500"
                              onClick={() => handleDeleteTag(tag.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
