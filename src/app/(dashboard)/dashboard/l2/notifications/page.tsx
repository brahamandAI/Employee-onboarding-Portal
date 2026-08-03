import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole } from "@/types/enums";
import { getStaffNotificationHistory } from "@/lib/services/notification.service";
import { StaffNotificationsPanel } from "@/features/notifications/components/StaffNotificationsPanel";

export const metadata = { title: "Notifications | L2" };

export default async function L2NotificationsPage() {
  const { user } = await requireStaffAuth(UserRole.L2);
  const notifications = await getStaffNotificationHistory(user.id, 100);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-primary">
          Notifications
        </h2>
        <p className="text-[#64748B]">
          Updates on applications forwarded from L1.
        </p>
      </div>
      <StaffNotificationsPanel notifications={notifications} />
    </div>
  );
}
