import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole } from "@/types/enums";
import { getAppSettings } from "@/lib/services/admin.service";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { SettingsForm } from "@/features/admin/components/SettingsForm";

export const metadata = { title: "Settings | Admin" };

export default async function AdminSettingsPage() {
  await requireStaffAuth(UserRole.ADMIN);
  const settings = await getAppSettings();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Settings"
        description="Configure application behavior, security, and portal access."
      />
      <SettingsForm initial={settings} />
    </div>
  );
}
