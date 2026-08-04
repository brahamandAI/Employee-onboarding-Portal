import { requireStaffAuth } from "@/lib/auth/guards";
import { UserRole } from "@/types/enums";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { ProfilePageView } from "@/features/auth/components/ProfilePageView";

export const metadata = { title: "Profile | Submitter" };

export default async function SubmitterProfilePage() {
  const { user } = await requireStaffAuth(UserRole.SUBMITTER);

  await connectDB();
  const dbUser = await User.findById(user.id).lean();

  if (!dbUser) {
    return <p>User not found.</p>;
  }

  return (
    <ProfilePageView
      backHref="/dashboard/submitter"
      name={dbUser.name}
      email={dbUser.email}
      role={dbUser.role}
      department={dbUser.department}
      phone={dbUser.phone}
      lastLoginAt={dbUser.lastLoginAt}
    />
  );
}
