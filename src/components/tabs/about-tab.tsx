import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

export function AboutTab() {
  return (
    <div className="container py-6 max-w-4xl">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">About ClassHive</h1>
          <p className="text-muted-foreground">
            배우고, 만들고, 출시하세요. 최고의 학습 커뮤니티와 함께!
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>커뮤니티 소개</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3 text-center">
              <div className="bg-muted rounded-lg p-4">
                <div className="text-3xl font-bold">674</div>
                <div className="text-sm text-muted-foreground">멤버 수</div>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="text-3xl font-bold">2023</div>
                <div className="text-sm text-muted-foreground">설립 연도</div>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="text-3xl font-bold">24</div>
                <div className="text-sm text-muted-foreground">강의 수</div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">비전 및 미션</h3>
              <p className="text-muted-foreground">
                ClassHive는 모든 사람이 쉽고 효과적으로 학습할 수 있는 환경을
                만들기 위해 설립되었습니다. 우리는 양질의 교육 콘텐츠와 활발한
                커뮤니티 활동을 통해 학습자들이 서로 도움을 주고받으며 함께
                성장할 수 있는 플랫폼을 제공합니다.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">커리큘럼 철학</h3>
              <p className="text-muted-foreground">
                우리의 커리큘럼은 이론과 실습의 균형을 중요시합니다. 단순히
                지식을 전달하는 것이 아니라, 실제 프로젝트를 통해 배운 내용을
                적용하고 피드백을 받을 수 있는 환경을 제공합니다. 이를 통해
                학습자들은 실무에 필요한 역량을 효과적으로 키울 수 있습니다.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>운영진 소개</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src="/placeholder.svg?text=H" />
                  <AvatarFallback>
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-medium">Hyungwoo Park</h3>
                <p className="text-sm text-muted-foreground">
                  Founder & Lead Instructor
                </p>
                <p className="text-sm mt-2">
                  10년 이상의 교육 경험을 가진 전문가로, 학습자 중심의 교육
                  방법론을 연구하고 적용합니다.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src="/placeholder.svg?text=S" />
                  <AvatarFallback>
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-medium">Sunghyun Ko</h3>
                <p className="text-sm text-muted-foreground">
                  Community Manager
                </p>
                <p className="text-sm mt-2">
                  커뮤니티 활성화와 회원 관리를 담당하며, 모든 회원이 편안하게
                  참여할 수 있는 환경을 조성합니다.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src="/placeholder.svg?text=T" />
                  <AvatarFallback>
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-medium">Tim Nelms</h3>
                <p className="text-sm text-muted-foreground">
                  Content Director
                </p>
                <p className="text-sm mt-2">
                  교육 콘텐츠 개발과 품질 관리를 담당하며, 최��� 트렌드를 반영한
                  커리큘럼을 설계합니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>커뮤니티 가이드라인</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">참여 규칙</h3>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                <li>모든 회원을 존중하고 예의를 갖춰 대화해주세요.</li>
                <li>질문과 답변은 구체적이고 명확하게 작성해주세요.</li>
                <li>다른 회원의 학습을 방해하는 행동은 삼가주세요.</li>
                <li>저작권을 존중하고, 출처를 명시해주세요.</li>
                <li>개인정보 보호에 주의해주세요.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">혜택 및 보상</h3>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                <li>활발한 참여자에게는 특별 강의 및 자료 제공</li>
                <li>우수 기여자 월간 선정 및 혜택 제공</li>
                <li>커뮤니티 이벤트 및 오프라인 모임 우선 참여 기회</li>
                <li>멘토링 및 취업 연계 프로그램 참여 기회</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
