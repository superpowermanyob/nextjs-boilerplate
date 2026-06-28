"use client";

import { useI18n } from "@/components/I18nProvider";
import { DocumentTitle } from "@/components/DocumentTitle";
import { UserDetailView } from "@/components/UserDetailView";
import type { PublicProfile } from "@/lib/profile-utils";

type UserDetailPageClientProps = {
  profile: PublicProfile;
};

export function UserDetailPageClient({ profile }: UserDetailPageClientProps) {
  const { t, format } = useI18n();

  return (
    <>
      <DocumentTitle
        title={format(t.meta.userTitle, { nickname: profile.nickname })}
        description={format(t.meta.userDescription, { nickname: profile.nickname })}
      />
      <UserDetailView profile={profile} />
    </>
  );
}
