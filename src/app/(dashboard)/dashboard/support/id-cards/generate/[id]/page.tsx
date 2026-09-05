import { notFound } from "next/navigation";
import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole } from "@/types/enums";
import { getIdCardPreviewData } from "@/lib/services/id-card.service";
import { SupportActionPanel } from "@/features/support/components/SupportActionPanel";
import { DashboardBackLink } from "@/components/dashboard/DashboardBackLink";
import { StatusBadge } from "@/features/l1/components/StatusBadge";

export const metadata = { title: "Generate ID Card | Support" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SupportGenerateIdCardDetailPage({ params }: PageProps) {
  await requireStaffAuth(UserRole.SUPPORT);
  const { id } = await params;
  const data = await getIdCardPreviewData(id);

  if (!data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <DashboardBackLink href="/dashboard/support/id-cards/generate" />

      <div>
        <h2 className="font-heading text-2xl font-bold text-primary">
          {data.fullName}
        </h2>
        <p className="text-[#64748B]">
          {data.employeeIdCode} · {data.applicationRef}
        </p>
        <div className="mt-2">
          <StatusBadge status={data.status} />
        </div>
      </div>

      <SupportActionPanel initialData={data} />
    </div>
  );
}
