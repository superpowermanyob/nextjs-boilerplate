import { notFound } from "next/navigation";

import { UserDetailPageClient } from "@/components/UserDetailPageClient";
import { searchPublicProfileByNickname } from "@/lib/public-profiles";

export const dynamic = "force-dynamic";

type UserPageProps = {
  params: Promise<{ nickname: string }>;
};

export default async function UserPage({ params }: UserPageProps) {
  const { nickname } = await params;
  const decodedNickname = decodeURIComponent(nickname);
  const profile = await searchPublicProfileByNickname(decodedNickname);

  if (!profile) {
    notFound();
  }

  return <UserDetailPageClient profile={profile} />;
}
