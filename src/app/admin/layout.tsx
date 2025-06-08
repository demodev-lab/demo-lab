// 이 레이아웃과 하위 페이지들을 항상 동적으로 렌더링하도록 설정하여,
// 빌드 시점이 아닌 요청 시점에 사용자 정보를 확인하도록 합니다.
// 유저 role은 로그인 시점에 확인하므로 빌드 시점에는 유저 role을 확인하지 않습니다.
// Admin 권한 체크는 middleware에서 처리됩니다.
export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
