import { DashboardPageHeader } from "@/components/dashboard/DashboardUi";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function AdminPageHeader({ title, description, actions }: AdminPageHeaderProps) {
  return (
    <DashboardPageHeader title={title} description={description} actions={actions} />
  );
}
