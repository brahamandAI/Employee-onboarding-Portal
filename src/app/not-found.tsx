import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] px-4 text-center">
      <h1 className="font-heading text-2xl font-bold text-[#1E3A8A]">Page not found</h1>
      <p className="mt-2 text-sm text-[#64748B]">The page you requested does not exist.</p>
      <Link href="/" className="mt-6">
        <Button>Go to Home</Button>
      </Link>
    </div>
  );
}
