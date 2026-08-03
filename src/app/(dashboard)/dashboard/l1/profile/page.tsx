import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole } from "@/types/enums";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRoleLabel } from "@/lib/auth/permissions";

export const metadata = { title: "Profile | L1" };

export default async function L1ProfilePage() {
  const { user } = await requireStaffAuth(UserRole.L1);

  await connectDB();
  const dbUser = await User.findById(user.id).lean();

  if (!dbUser) {
    return <p>User not found.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-primary">Profile</h2>
        <p className="text-[#64748B]">Your account information.</p>
      </div>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="text-base">Account Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
                Name
              </dt>
              <dd className="mt-0.5 text-primary">{dbUser.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
                Email
              </dt>
              <dd className="mt-0.5 text-primary">{dbUser.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
                Role
              </dt>
              <dd className="mt-0.5 text-primary">{getRoleLabel(dbUser.role)}</dd>
            </div>
            {dbUser.department && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
                  Department
                </dt>
                <dd className="mt-0.5 text-primary">{dbUser.department}</dd>
              </div>
            )}
            {dbUser.phone && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
                  Phone
                </dt>
                <dd className="mt-0.5 text-primary">{dbUser.phone}</dd>
              </div>
            )}
            {dbUser.lastLoginAt && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
                  Last Login
                </dt>
                <dd className="mt-0.5 text-primary">
                  {new Date(dbUser.lastLoginAt).toLocaleString("en-IN")}
                </dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
