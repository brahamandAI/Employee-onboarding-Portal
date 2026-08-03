import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole } from "@/types/enums";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { ProfileEditForm } from "@/features/admin/components/ProfileEditForm";

export const metadata = { title: "Profile | Admin" };

export default async function AdminProfilePage() {
  const { user } = await requireStaffAuth(UserRole.ADMIN);

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
