import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole } from "@/types/enums";

export const metadata = { title: "Support — Applications" };

export default async function SupportApplicationsPage() {
  await requireStaffAuth(UserRole.SUPPORT);

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-primary">
        All Applications
      </h2>
      <p className="mt-2 text-[#64748B]">Search and manage all applications.</p>
    </div>
  );
}
