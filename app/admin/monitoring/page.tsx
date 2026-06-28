import { AdminMonitoringPanel } from "@/components/AdminMonitoringPanel";
import {
  getBannerDocument,
  getFirebaseAdminStatus,
  serializeBannerForAdmin,
} from "@/lib/banner-server";
import { BANNER_LOCALE_CODES } from "@/lib/banner-text";

export const dynamic = "force-dynamic";

const EMPTY_MESSAGES = Object.fromEntries(
  BANNER_LOCALE_CODES.map((code) => [code, ""]),
) as Record<(typeof BANNER_LOCALE_CODES)[number], string>;

export default async function AdminMonitoringPage() {
  let initialMessages = EMPTY_MESSAGES;
  let initialError: string | undefined;
  const adminStatus = getFirebaseAdminStatus();

  try {
    const banner = await getBannerDocument();
    initialMessages = serializeBannerForAdmin(banner).messages;
  } catch (error) {
    initialError =
      error instanceof Error ? error.message : "공지를 불러오지 못했습니다.";
  }

  return (
    <div className="min-h-screen bg-[#1c1c1f] font-sans text-[#cdd2dc]">
      <AdminMonitoringPanel
        initialMessages={initialMessages}
        initialError={initialError}
        adminStatus={adminStatus}
      />
    </div>
  );
}
