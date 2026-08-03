import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole } from "@/types/enums";
import { getSubmitterReversedRegistrations } from "@/lib/services/submitter.service";
import { RegistrationsTable } from "@/features/submitter/components/RegistrationsTable";

export const metadata = { title: "Reversed Registrations | Submitter" };

export default async function SubmitterReversedPage() {
  const { user } = await requireStaffAuth(UserRole.SUBMITTER);
  const registrations = await getSubmitterReversedRegistrations(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-primary">
          Reversed Registrations
        </h2>
        <p className="text-[#64748B]">
          Forms sent back by L1 or L2 with reverse notes. Edit and resubmit after corrections.
        </p>
      </div>
      <RegistrationsTable
        registrations={registrations}
        showViewLink
        allowSubmitterEdit
        emptyMessage="No reversed registrations."
      />
    </div>
  );
}
