import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole } from "@/types/enums";
import { getStaffNotificationHistory } from "@/lib/services/notification.service";
import { StaffNotificationsPanel } from "@/features/notifications/components/StaffNotificationsPanel";

export const metadata = { title: "Notifications | L1" };

export default async function L1NotificationsPage() {
  const { user } = await requireStaffAuth(UserRole.L1);
  const notifications = await getStaffNotificationHistory(user.id, 100);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-primary">
          Notifications
        </h2>
        <p className="text-[#64748B]">
          Application updates and review activity.
        </p>
      </div>
      <StaffNotificationsPanel notifications={notifications} />
    </div>
  );
}
