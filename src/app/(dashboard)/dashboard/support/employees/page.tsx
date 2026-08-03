import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole } from "@/types/enums";

export default async function SupportEmployeesPage() {
  await requireStaffAuth(UserRole.SUPPORT);
  return <h2 className="font-heading text-2xl font-bold text-primary">Employees</h2>;
}
