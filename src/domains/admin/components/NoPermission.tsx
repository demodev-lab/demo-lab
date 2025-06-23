interface NoPermissionProps {
  message?: string;
  onBack?: () => void;
}

export function NoPermission({
  message = "이 페이지에 접근할 권한이 없습니다.",
  onBack,
}: NoPermissionProps) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <h2 className="text-xl font-bold text-red-600 mb-2">
          접근 권한이 없습니다
        </h2>
        <p className="text-gray-600 mb-4">{message}</p>
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            돌아가기
          </button>
        )}
      </div>
    </div>
  );
}
