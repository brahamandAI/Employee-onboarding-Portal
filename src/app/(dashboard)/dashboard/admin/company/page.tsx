import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole } from "@/types/enums";
import { getCompanyDetails } from "@/lib/services/admin.service";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { CompanyDetailsForm } from "@/features/admin/components/CompanyDetailsForm";

export const metadata = { title: "Company Details | Admin" };

export default async function AdminCompanyPage() {
  await requireStaffAuth(UserRole.ADMIN);
  const company = await getCompanyDetails();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Company Details"
        description="Manage organization information displayed across the portal and website."
      />
      <CompanyDetailsForm initial={company} />
    </div>
  );
}
