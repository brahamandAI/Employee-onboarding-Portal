import { redirect } from "next/navigation";
export default function LegacySupportAdminRedirect() {
  redirect("/dashboard/support");
}
