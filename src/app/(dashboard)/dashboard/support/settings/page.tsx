import { redirect } from "next/navigation";

/** Legacy support admin URLs redirect to the support dashboard. */
export default function LegacySupportAdminRedirect() {
  redirect("/dashboard/support");
}
