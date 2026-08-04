import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole } from "@/types/enums";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { ProfilePageView } from "@/features/auth/components/ProfilePageView";

export const metadata = { title: "Profile | Admin" };

export default async function AdminProfilePage() {
  const { user } = await requireStaffAuth(UserRole.ADMIN);

  await connectDB();
  const dbUser = await User.findById(user.id).lean();

  if (!dbUser) {
    return <p>User not found.</p>;
  }

  return (
    <ProfilePageView
      backHref="/dashboard/admin"
      name={dbUser.name}
      email={dbUser.email}
      role={dbUser.role}
      department={dbUser.department}
      phone={dbUser.phone}
      lastLoginAt={dbUser.lastLoginAt}
    />
  );
}
