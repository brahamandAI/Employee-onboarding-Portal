import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRoleLabel } from "@/lib/auth/permissions";
import { ChangePasswordForm } from "@/features/auth/components/ChangePasswordForm";
import { DashboardBackLink } from "@/components/dashboard/DashboardBackLink";
import { StaffRole } from "@/types/enums";

interface ProfilePageViewProps {
  backHref: string;
  name: string;
  email: string;
  role: StaffRole;
  department?: string | null;
  phone?: string | null;
  lastLoginAt?: Date | string | null;
}

export function ProfilePageView({
  backHref,
  name,
  email,
  role,
  department,
  phone,
  lastLoginAt,
}: ProfilePageViewProps) {
  return (
    <div className="space-y-6">
      <DashboardBackLink href={backHref} label="Back to dashboard" />
      <div>
        <h2 className="font-heading text-2xl font-bold text-primary">Profile</h2>
        <p className="text-[#64748B]">Account details, security, and sign-in options.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="border-[#E2E8F0] shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Account details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
                  Name
                </dt>
                <dd className="mt-0.5 text-primary">{name}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
                  Email
                </dt>
                <dd className="mt-0.5 text-primary">{email}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
                  Role
                </dt>
                <dd className="mt-0.5 text-primary">{getRoleLabel(role)}</dd>
              </div>
              {department && (
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
                    Department
                  </dt>
                  <dd className="mt-0.5 text-primary">{department}</dd>
                </div>
              )}
              {phone && (
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
                    Phone
                  </dt>
                  <dd className="mt-0.5 text-primary">{phone}</dd>
                </div>
              )}
              {lastLoginAt && (
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
                    Last login
                  </dt>
                  <dd className="mt-0.5 text-primary">
                    {new Date(lastLoginAt).toLocaleString("en-IN")}
                  </dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>

        <Card className="border-[#E2E8F0] shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Security</CardTitle>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
