import "server-only";

import {
  equalTo,
  get,
  orderByChild,
  query,
  ref,
  type QueryConstraint,
} from "firebase/database";
import {
  collection,
  getDocs,
  limit,
  query as firestoreQuery,
  where,
} from "firebase/firestore";

import { getClientDatabase, getClientFirestore } from "@/lib/firebase";

export type PublicProfile = {
  id: string;
  nickname: string;
  [key: string]: unknown;
};

type SearchPublicProfileOptions = {
  /** Firestore nickname 필드와 RTDB nickname 필드 모두에 적용됩니다. */
  nickname: string;
  maxResults?: number;
};

function normalizeProfile(
  id: string,
  data: Record<string, unknown>,
): PublicProfile | null {
  const nickname = data.nickname;
  if (typeof nickname !== "string" || nickname.length === 0) {
    return null;
  }

  return {
    id,
    nickname,
    ...data,
  };
}

async function searchPublicProfilesInFirestore(
  nickname: string,
  maxResults: number,
): Promise<PublicProfile[]> {
  const db = getClientFirestore();
  const snapshot = await getDocs(
    firestoreQuery(
      collection(db, "public_profiles"),
      where("nickname", "==", nickname),
      limit(maxResults),
    ),
  );

  return snapshot.docs
    .map((doc) => normalizeProfile(doc.id, doc.data() as Record<string, unknown>))
    .filter((profile): profile is PublicProfile => profile !== null);
}

async function searchPublicProfilesInRtdb(
  nickname: string,
  maxResults: number,
): Promise<PublicProfile[]> {
  const db = getClientDatabase();
  const profilesRef = ref(db, "public_profiles");

  const constraints: QueryConstraint[] = [
    orderByChild("nickname"),
    equalTo(nickname),
  ];

  const snapshot = await get(query(profilesRef, ...constraints));
  if (!snapshot.exists()) {
    return [];
  }

  const profiles: PublicProfile[] = [];

  snapshot.forEach((child) => {
    if (profiles.length >= maxResults) {
      return true;
    }

    const profile = normalizeProfile(
      child.key ?? "",
      child.val() as Record<string, unknown>,
    );

    if (profile) {
      profiles.push(profile);
    }

    return false;
  });

  return profiles;
}

/**
 * 닉네임으로 public_profiles 전적 프로필을 조회합니다.
 * Firestore와 RTDB를 순서대로 조회해 먼저 찾은 결과를 반환합니다.
 */
export async function searchPublicProfileByNickname(
  options: SearchPublicProfileOptions | string,
): Promise<PublicProfile | null> {
  const { nickname, maxResults = 1 } =
    typeof options === "string" ? { nickname: options, maxResults: 1 } : options;

  const trimmedNickname = nickname.trim();
  if (!trimmedNickname) {
    return null;
  }

  const firestoreProfiles = await searchPublicProfilesInFirestore(
    trimmedNickname,
    maxResults,
  );
  if (firestoreProfiles.length > 0) {
    return firestoreProfiles[0];
  }

  const rtdbProfiles = await searchPublicProfilesInRtdb(
    trimmedNickname,
    maxResults,
  );
  return rtdbProfiles[0] ?? null;
}

/**
 * 닉네임으로 public_profiles 전적 프로필 목록을 조회합니다.
 */
export async function searchPublicProfilesByNickname(
  options: SearchPublicProfileOptions,
): Promise<PublicProfile[]> {
  const { nickname, maxResults = 10 } = options;
  const trimmedNickname = nickname.trim();

  if (!trimmedNickname) {
    return [];
  }

  const firestoreProfiles = await searchPublicProfilesInFirestore(
    trimmedNickname,
    maxResults,
  );
  if (firestoreProfiles.length > 0) {
    return firestoreProfiles;
  }

  return searchPublicProfilesInRtdb(trimmedNickname, maxResults);
}
