import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole } from "@/types/enums";
import { getPendingIdCards } from "@/lib/services/support.service";
import { IdCardQueueTable } from "@/features/support/components/IdCardQueueTable";

export const metadata = { title: "Pending ID Cards | Support" };

export default async function SupportPendingIdCardsPage() {
  await requireStaffAuth(UserRole.SUPPORT);
  const items = await getPendingIdCards();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-primary">
          Pending ID Cards
        </h2>
        <p className="text-[#64748B]">
          Employees forwarded from L2 awaiting ID card generation.
        </p>
      </div>
      <IdCardQueueTable
        items={items}
        emptyMessage="No pending ID cards in the queue."
      />
    </div>
  );
}
