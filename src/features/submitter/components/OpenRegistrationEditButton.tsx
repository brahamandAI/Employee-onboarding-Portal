"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { openSubmitterRegistrationAction } from "@/features/submitter/actions/submitter.actions";
import { useToast } from "@/components/ui/toast";

export function OpenRegistrationEditButton({ employeeId }: { employeeId: string }) {
  const { toast } = useToast();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    if (busy) return;
    setBusy(true);
    try {
      const result = await openSubmitterRegistrationAction(employeeId);
      if (!result.success) {
        toast({
          title: "Unable to edit",
          description: result.error,
          variant: "destructive",
        });
        setBusy(false);
        return;
      }
      router.push(result.redirectTo);
    } catch {
      toast({
        title: "Unable to edit",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setBusy(false);
    }
  }

  return (
    <Button type="button" size="sm" isLoading={busy} onClick={() => void handleClick()}>
      <Pencil className="h-4 w-4" />
      Edit Registration
    </Button>
  );
}
