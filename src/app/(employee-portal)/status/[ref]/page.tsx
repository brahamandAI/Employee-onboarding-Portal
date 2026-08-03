import { redirect } from "next/navigation";

export default async function StatusRedirectPage() {
  redirect("/apply");
}
