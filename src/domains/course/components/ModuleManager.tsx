"use client";

import React, { useState } from "react";
import { ModuleWithLectures } from "../types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Edit,
  Trash,
  Save,
  X,
  ChevronDown,
  ChevronRight,
  GripVertical,
} from "lucide-react";
import {
  createModule,
  updateModule,
  deleteModule,
} from "../actions/moduleAction";
import { LectureManager } from "./LectureManager";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ModuleManagerProps {
  courseId: number;
  modules: ModuleWithLectures[];
}

export function ModuleManager({ courseId, modules }: ModuleManagerProps) {
  const router = useRouter();
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [moduleToDelete, setModuleToDelete] = useState<number | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(
    new Set(),
  );

  const handleAddModule = async () => {
    if (!newModuleTitle.trim()) {
      toast.error("모듈 제목을 입력해주세요.");
      return;
    }

    try {
      await createModule({
        course_id: courseId,
        title: newModuleTitle,
        sequence: modules.length + 1,
      });
      toast.success("모듈이 추가되었습니다.");
      setNewModuleTitle("");
      setIsAddingModule(false);
      router.refresh();
    } catch (error) {
      toast.error("모듈 추가에 실패했습니다.");
      console.error(error);
    }
  };

  const handleUpdateModule = async (moduleId: number) => {
    if (!editingTitle.trim()) {
      toast.error("모듈 제목을 입력해주세요.");
      return;
    }

    try {
      await updateModule(moduleId, {
        title: editingTitle,
        course_id: courseId,
      });
      toast.success("모듈이 수정되었습니다.");
      setEditingModuleId(null);
      router.refresh();
    } catch (error) {
      toast.error("모듈 수정에 실패했습니다.");
      console.error(error);
    }
  };

  const handleDeleteModule = async (moduleId: number) => {
    try {
      await deleteModule(moduleId, courseId);
      toast.success("모듈이 삭제되었습니다.");
      setModuleToDelete(null);
      router.refresh();
    } catch (error) {
      toast.error("모듈 삭제에 실패했습니다.");
      console.error(error);
    }
  };

  const toggleModule = (moduleId: number) => {
    setExpandedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>모듈 및 강의 관리</CardTitle>
            <CardDescription>
              모듈을 추가하고 각 모듈에 강의를 추가할 수 있습니다.
            </CardDescription>
          </div>
          {!isAddingModule && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddingModule(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              모듈 추가
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 새 모듈 추가 폼 */}
        {isAddingModule && (
          <div className="flex gap-2 p-4 border rounded-lg">
            <Input
              placeholder="새 모듈 제목"
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddModule();
                if (e.key === "Escape") {
                  setIsAddingModule(false);
                  setNewModuleTitle("");
                }
              }}
              autoFocus
            />
            <Button size="sm" onClick={handleAddModule}>
              <Save className="h-4 w-4 mr-2" />
              저장
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsAddingModule(false);
                setNewModuleTitle("");
              }}
            >
              <X className="h-4 w-4 mr-2" />
              취소
            </Button>
          </div>
        )}

        {/* 모듈 목록 */}
        {modules.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            아직 모듈이 없습니다. 첫 번째 모듈을 추가해보세요.
          </p>
        ) : (
          <div className="space-y-2">
            {modules.map((module) => (
              <Collapsible
                key={module.id}
                open={expandedModules.has(module.id)}
                onOpenChange={() => toggleModule(module.id)}
              >
                <div className="border rounded-lg">
                  <div className="flex items-center p-4">
                    <CollapsibleTrigger className="flex items-center gap-2 flex-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        {expandedModules.has(module.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      {editingModuleId === module.id ? (
                        <Input
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            e.stopPropagation();
                            if (e.key === "Enter")
                              handleUpdateModule(module.id);
                            if (e.key === "Escape") setEditingModuleId(null);
                          }}
                          className="flex-1"
                          autoFocus
                        />
                      ) : (
                        <div className="flex-1 text-left">
                          <h4 className="font-medium">
                            {module.sequence}. {module.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {module.lectures?.length || 0}개 강의
                          </p>
                        </div>
                      )}
                    </CollapsibleTrigger>
                    <div className="flex items-center gap-2">
                      {editingModuleId === module.id ? (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleUpdateModule(module.id)}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => setEditingModuleId(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => {
                              setEditingModuleId(module.id);
                              setEditingTitle(module.title);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => setModuleToDelete(module.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  <CollapsibleContent>
                    <div className="border-t px-4 py-4">
                      <LectureManager
                        courseId={courseId}
                        moduleId={module.id}
                        lectures={module.lectures || []}
                      />
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        )}
      </CardContent>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog
        open={moduleToDelete !== null}
        onOpenChange={() => setModuleToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>모듈을 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 모듈과 함께 모든 강의가 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                moduleToDelete && handleDeleteModule(moduleToDelete)
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
