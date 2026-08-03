import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole } from "@/types/enums";
import { getCompletedIdCards } from "@/lib/services/support.service";
import { IdCardQueueTable } from "@/features/support/components/IdCardQueueTable";

export const metadata = { title: "Completed ID Cards | Support" };

export default async function SupportCompletedIdCardsPage() {
  await requireStaffAuth(UserRole.SUPPORT);
  const items = await getCompletedIdCards();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-primary">
          Completed ID Cards
        </h2>
        <p className="text-[#64748B]">
          ID cards generated and marked as completed.
        </p>
      </div>
      <IdCardQueueTable
        items={items}
        showCompleted
        emptyMessage="No completed ID cards yet."
      />
    </div>
  );
}
