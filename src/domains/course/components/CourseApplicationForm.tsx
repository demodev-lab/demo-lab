"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { applyCourse } from "../actions/courseAction";

const formSchema = z.object({
  title: z.string().min(2, "제목은 최소 2글자 이상이어야 합니다"),
  subtitle: z.string().optional(),
  description: z.string().min(10, "설명은 최소 10글자 이상이어야 합니다"),
  difficulty: z.enum(["입문", "초급", "중급", "고급"]),
  applicant_phone: z.string().min(10, "연락처를 입력해주세요"),
  thumbnail_url: z.string().url().optional().or(z.literal("")),
});

interface CourseApplicationFormProps {
  userId: string;
  userEmail?: string;
}

export function CourseApplicationForm({
  userId,
  userEmail,
}: CourseApplicationFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      difficulty: "입문",
      applicant_phone: "",
      thumbnail_url:
        "https://velog.velcdn.com/images/tjdtna01/post/579043a8-d9c3-467f-9ced-6e4a89a77fc1/image.png",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await applyCourse({
        ...values,
        applicant_id: userId,
        applicant_email: userEmail || null,
        status: "pending",
      });

      toast.success(
        "코스 등록 신청이 완료되었습니다! 관리자 승인 후 코스가 공개됩니다.",
      );
      router.push("/");
    } catch (error) {
      toast.error("코스 등록 신청에 실패했습니다.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>코스 제목</FormLabel>
              <FormControl>
                <Input placeholder="예: React 기초부터 실전까지" {...field} />
              </FormControl>
              <FormDescription>
                수강생들이 쉽게 이해할 수 있는 명확한 제목을 입력해주세요
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>코스 부제목 (선택)</FormLabel>
              <FormControl>
                <Input
                  placeholder="예: 실습으로 배우는 모던 웹 개발"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>코스 설명</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="코스의 목표, 대상, 커리큘럼 등을 자세히 설명해주세요"
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                이 코스를 통해 무엇을 배울 수 있는지 상세히 작성해주세요
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>난이도</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="난이도를 선택하세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="입문">입문</SelectItem>
                  <SelectItem value="초급">초급</SelectItem>
                  <SelectItem value="중급">중급</SelectItem>
                  <SelectItem value="고급">고급</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="applicant_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>연락처</FormLabel>
              <FormControl>
                <Input placeholder="010-1234-5678" {...field} />
              </FormControl>
              <FormDescription>
                코스 승인 관련 연락을 받을 수 있는 연락처를 입력해주세요
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="thumbnail_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>썸네일 이미지 URL (선택)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormDescription>
                코스를 대표하는 이미지 URL을 입력해주세요 (비워두면 기본
                이미지가 사용됩니다)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "신청 중..." : "코스 등록 신청"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/")}
          >
            취소
          </Button>
        </div>
      </form>
    </Form>
  );
}
