import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole } from "@/types/enums";
import { getSubmitterRegistrations } from "@/lib/services/submitter.service";
import { RegistrationsTable } from "@/features/submitter/components/RegistrationsTable";

export const metadata = { title: "All Registrations | Submitter" };

export default async function SubmitterRegistrationsPage() {
  const { user } = await requireStaffAuth(UserRole.SUBMITTER);
  const registrations = await getSubmitterRegistrations(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-primary">
          All Registrations
        </h2>
        <p className="text-[#64748B]">
          Track registrations you submitted. Temporary Employee IDs appear here
          immediately after L2 approval.
        </p>
      </div>
      <RegistrationsTable
        registrations={registrations}
        emptyMessage="You have not submitted any registrations yet."
        allowSubmitterEdit
        showViewLink
        viewPathPrefix="/dashboard/submitter/registrations"
      />
    </div>
  );
}
