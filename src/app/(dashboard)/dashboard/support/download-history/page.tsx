import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole } from "@/types/enums";
import { getDownloadHistory } from "@/lib/services/support.service";
import { DownloadHistoryTable } from "@/features/support/components/DownloadHistoryTable";

export const metadata = { title: "Download History | Support" };

export default async function SupportDownloadHistoryPage() {
  await requireStaffAuth(UserRole.SUPPORT);
  const history = await getDownloadHistory(100);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-primary">
          Download History
        </h2>
        <p className="text-[#64748B]">
          Audit log of previews, generations, downloads, and completions.
        </p>
      </div>
      <DownloadHistoryTable items={history} />
    </div>
  );
}
