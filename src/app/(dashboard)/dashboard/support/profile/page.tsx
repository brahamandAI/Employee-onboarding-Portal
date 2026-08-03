import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole } from "@/types/enums";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { ProfileEditForm } from "@/features/admin/components/ProfileEditForm";

export const metadata = { title: "Profile | Support" };

export default async function SupportProfilePage() {
  const { user } = await requireStaffAuth(UserRole.SUPPORT);

  await connectDB();
  const dbUser = await User.findById(user.id).lean();

  if (!dbUser) {
    return <p>User not found.</p>;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Profile"
        description="View and update your account information."
      />
      <ProfileEditForm
        user={{
          name: dbUser.name,
          email: dbUser.email,
          role: dbUser.role,
          department: dbUser.department,
          phone: dbUser.phone,
          lastLoginAt: dbUser.lastLoginAt?.toISOString(),
        }}
      />
    </div>
  );
}
