import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { UserDetailView } from "@/components/UserDetailView";
import { searchPublicProfileByNickname } from "@/lib/public-profiles";

type UserPageProps = {
  params: Promise<{ nickname: string }>;
};

export async function generateMetadata({
  params,
}: UserPageProps): Promise<Metadata> {
  const { nickname } = await params;
  const decoded = decodeURIComponent(nickname);

  return {
    title: `${decoded} | Focus RPG 전적`,
    description: `${decoded} 플레이어의 상세 전적, 장비, 칭호 정보`,
  };
}

export default async function UserPage({ params }: UserPageProps) {
  const { nickname } = await params;
  const decodedNickname = decodeURIComponent(nickname);
  const profile = await searchPublicProfileByNickname(decodedNickname);

  if (!profile) {
    notFound();
  }

  return <UserDetailView profile={profile} />;
}
