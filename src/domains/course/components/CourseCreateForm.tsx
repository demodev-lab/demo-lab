import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { useCourseAdmin } from "../hooks/useCourseAdmin";
import type { CreateCourseInput } from "../types";

const formSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  difficulty: z.enum(["입문", "초급", "중급", "고급"]),
  thumbnail_url: z.string().optional(),
});

export function CourseCreateForm() {
  const { createCourse, isCreating } = useCourseAdmin();
  const form = useForm<CreateCourseInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      difficulty: "입문",
      thumbnail_url:
        "https://velog.velcdn.com/images/tjdtna01/post/579043a8-d9c3-467f-9ced-6e4a89a77fc1/image.png",
    },
  });

  const onSubmit = (data: CreateCourseInput) => {
    console.log("Submitting course data:", data);
    createCourse(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>코스명</FormLabel>
              <FormControl>
                <Input placeholder="코스의 제목을 입력하세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>부제목</FormLabel>
              <FormControl>
                <Input placeholder="코스의 부제목을 입력하세요" {...field} />
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
              <FormLabel>설명</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="코스에 대한 상세 설명을 입력하세요"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
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
          name="thumbnail_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>썸네일 URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="썸네일 이미지 URL을 입력하세요 (선택사항)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isCreating}>
          {isCreating ? "생성 중..." : "코스 생성"}
        </Button>
      </form>
    </Form>
  );
}
