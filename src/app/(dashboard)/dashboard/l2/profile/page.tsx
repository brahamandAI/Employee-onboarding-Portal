import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole } from "@/types/enums";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { ProfilePageView } from "@/features/auth/components/ProfilePageView";

export const metadata = { title: "Profile | L2" };

export default async function L2ProfilePage() {
  const { user } = await requireStaffAuth(UserRole.L2);

  await connectDB();
  const dbUser = await User.findById(user.id).lean();

  if (!dbUser) {
    return <p>User not found.</p>;
  }

  return (
    <ProfilePageView
      backHref="/dashboard/l2"
      name={dbUser.name}
      email={dbUser.email}
      role={dbUser.role}
      department={dbUser.department}
      phone={dbUser.phone}
      lastLoginAt={dbUser.lastLoginAt}
    />
  );
}
