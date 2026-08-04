import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole } from "@/types/enums";
import { getStaffNotificationHistory } from "@/lib/services/notification.service";
import { StaffNotificationsPanel } from "@/features/notifications/components/StaffNotificationsPanel";

export const metadata = { title: "Notifications | Submitter" };

export default async function SubmitterNotificationsPage() {
  const { user } = await requireStaffAuth(UserRole.SUBMITTER);
  const notifications = await getStaffNotificationHistory(user.id, 100);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-primary">
          Notifications
        </h2>
        <p className="text-[#64748B]">
          Updates on registrations you have submitted.
        </p>
      </div>
      <StaffNotificationsPanel notifications={notifications} />
    </div>
  );
}
