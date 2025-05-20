import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  return (
    <div className="hidden lg:block w-80 border-l p-4 h-[calc(100vh-112px)] sticky top-[112px] overflow-y-auto">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">ClassHive</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">배우고, 만들고, 출시하세요</p>
            <p>최고의 학습 커뮤니티와 함께!</p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="flex flex-col items-center">
              <span className="font-bold text-lg">674</span>
              <span className="text-muted-foreground">Members</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-lg">3</span>
              <span className="text-muted-foreground">Online</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-lg">3</span>
              <span className="text-muted-foreground">Admins</span>
            </div>
          </div>

          <Button className="w-full bg-[#5046E4] hover:bg-[#5046E4]/90">
            INVITE PEOPLE
          </Button>

          <div className="space-y-2 pt-2">
            <h3 className="font-medium">About ClassHive</h3>
            <p className="text-sm text-muted-foreground">
              이 공간은 학습하고, 나누고, 함께 성장하는 커뮤니티입니다.
              혼자였다면 어려웠을 여정도, 함께라서 훨씬 즐겁고 빠르게 나아갈 수
              있어요.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">커뮤니티 혜택</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✔ 커뮤니티 전용 독점 콘텐츠 공유</li>
              <li>✔ 실전 프로젝트 및 튜토리얼</li>
              <li>✔ 최신 학습 자료와 실전 사례 소개</li>
              <li>✔ 다양한 분야의 전문가들과 교류</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
