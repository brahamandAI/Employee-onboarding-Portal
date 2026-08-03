import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole } from "@/types/enums";
import { getEligibleForGeneration } from "@/lib/services/support.service";
import { IdCardQueueTable } from "@/features/support/components/IdCardQueueTable";

export const metadata = { title: "Employee ID Card Generation | Support" };

export default async function SupportGenerateIdCardPage() {
  await requireStaffAuth(UserRole.SUPPORT);
  const items = await getEligibleForGeneration();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-primary">
          Employee ID Card Generation
        </h2>
        <p className="text-[#64748B]">
          L2-approved employees ready for official ID card generation, preview, download, and print.
        </p>
      </div>
      <IdCardQueueTable
        items={items}
        emptyMessage="No employees eligible for ID card generation."
      />
    </div>
  );
}
