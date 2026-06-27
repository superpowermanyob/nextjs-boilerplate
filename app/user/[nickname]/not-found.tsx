import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function UserNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#1c1c1f] px-4 text-center text-[#cdd2dc]">
      <h1 className="text-2xl font-bold text-white">플레이어를 찾을 수 없습니다</h1>
      <p className="mt-2 text-[#9aa0ae]">존재하지 않는 닉네임이거나 비공개 프로필입니다.</p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#5383e8] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4171d6]"
      >
        <ChevronLeft className="h-4 w-4" />
        메인으로 돌아가기
      </Link>
    </div>
  );
}
