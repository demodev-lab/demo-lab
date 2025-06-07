"use client";

import React, { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createCategory, createTag } from "@/app/actions/admin";
import { Category, Tag } from "@/utils/lib/communityService";

// Form의 제출 버튼 컴포넌트
function SubmitButton({ label }: { label: string }) {
  // useFormStatus는 form의 자식 컴포넌트에서만 사용 가능
  const { pending } = require("react-dom");
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "저장 중..." : label}
    </Button>
  );
}

export default function CommunityManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  // 카테고리/태그 생성 Form 상태
  const [createCategoryState, createCategoryAction] = useFormState(
    createCategory,
    { message: "", error: false },
  );
  const [createTagState, createTagAction] = useFormState(createTag, {
    message: "",
    error: false,
  });

  // 데이터 로딩
  useEffect(() => {
    async function fetchData() {
      const [catRes, tagRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/tags"),
      ]);
      if (catRes.ok) setCategories(await catRes.json());
      if (tagRes.ok) setTags(await tagRes.json());
    }
    fetchData();
  }, []);

  // TODO: 나머지 탭(게시글, 댓글, 통계 등)은 추후 구현 필요

  return (
    <Tabs defaultValue="categories" className="w-full">
      <TabsList>
        <TabsTrigger value="posts">게시글 관리</TabsTrigger>
        <TabsTrigger value="categories">카테고리 관리</TabsTrigger>
        <TabsTrigger value="tags">태그 관리</TabsTrigger>
        <TabsTrigger value="spam">스팸 관리</TabsTrigger>
        <TabsTrigger value="stats">통계</TabsTrigger>
      </TabsList>

      {/* 게시글 관리 탭 */}
      <TabsContent value="posts">
        <Card>
          <CardHeader>
            <CardTitle>게시글 관리</CardTitle>
            <CardDescription>
              게시글을 검색하고 상태를 변경합니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              이 기능은 현재 개발 중입니다.
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      {/* 카테고리 관리 탭 */}
      <TabsContent value="categories" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>새 카테고리 생성</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createCategoryAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category-name">이름</Label>
                <Input
                  id="category-name"
                  name="name"
                  placeholder="예: 공지사항"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category-description">설명</Label>
                <Input
                  id="category-description"
                  name="description"
                  placeholder="카테고리에 대한 간단한 설명"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category-color">색상</Label>
                <Input
                  id="category-color"
                  name="color"
                  type="color"
                  defaultValue="#888888"
                />
              </div>
              <SubmitButton label="카테고리 생성" />
              {createCategoryState.message && (
                <p
                  className={
                    createCategoryState.error
                      ? "text-red-500"
                      : "text-green-500"
                  }
                >
                  {createCategoryState.message}
                </p>
              )}
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>카테고리 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>이름</TableHead>
                  <TableHead>설명</TableHead>
                  <TableHead>색상</TableHead>
                  <TableHead>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell>{cat.name}</TableCell>
                    <TableCell>{cat.description}</TableCell>
                    <TableCell>
                      <Badge
                        style={{ backgroundColor: cat.color }}
                        className="text-white"
                      >
                        {cat.color}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {/* TODO: 수정/삭제 기능 */}
                      <Button variant="outline" size="sm">
                        수정
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* 태그 관리 탭 */}
      <TabsContent value="tags" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>새 태그 생성</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createTagAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tag-name">이름</Label>
                <Input
                  id="tag-name"
                  name="name"
                  placeholder="예: 프로그래밍"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tag-description">설명</Label>
                <Input
                  id="tag-description"
                  name="description"
                  placeholder="태그에 대한 간단한 설명"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tag-color">색상</Label>
                <Input
                  id="tag-color"
                  name="color"
                  type="color"
                  defaultValue="#888888"
                />
              </div>
              <SubmitButton label="태그 생성" />
              {createTagState.message && (
                <p
                  className={
                    createTagState.error ? "text-red-500" : "text-green-500"
                  }
                >
                  {createTagState.message}
                </p>
              )}
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>태그 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>이름</TableHead>
                  <TableHead>설명</TableHead>
                  <TableHead>색상</TableHead>
                  <TableHead>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell>
                      <Badge
                        style={{
                          backgroundColor: tag.color,
                          color: "white",
                        }}
                      >
                        {tag.name}
                      </Badge>
                    </TableCell>
                    <TableCell>{tag.description || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        style={{ backgroundColor: tag.color }}
                        className="text-white"
                      >
                        {tag.color}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {/* TODO: 수정/삭제 기능 */}
                      <Button variant="outline" size="sm">
                        수정
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      {/* TODO: 나머지 탭들 */}
    </Tabs>
  );
}
