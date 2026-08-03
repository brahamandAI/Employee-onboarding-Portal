"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmployeeStatus } from "@/types/enums";
import {
  l1ApproveAction,
  l1ReturnAction,
} from "@/features/l1/actions/l1.actions";

interface L1ActionPanelProps {
  employeeId: string;
  status: EmployeeStatus;
  employeeIdCode?: string;
}

export function L1ActionPanel({
  employeeId,
  status,
  employeeIdCode,
}: L1ActionPanelProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [showReverse, setShowReverse] = useState(false);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [completedAction, setCompletedAction] = useState<"approve" | "reverse" | null>(
    null
  );

  const canReview =
    completedAction === null &&
    [EmployeeStatus.SUBMITTED, EmployeeStatus.L1_REVIEW].includes(status);

  async function submitApprove() {
    if (busy || completedAction) return;
    setError(null);

    // Instant UI feedback — do not wait on the server or router.refresh
    setCompletedAction("approve");
    setSuccess("Approved — application forwarded to L2 for review.");
    setShowReverse(false);

    const fd = new FormData();
    fd.set("employeeId", employeeId);

    try {
      const result = await l1ApproveAction(fd);
      if (!result.success) {
        setCompletedAction(null);
        setSuccess(null);
        setError(result.error ?? "Action failed");
        return;
      }
      router.refresh();
    } catch {
      setCompletedAction(null);
      setSuccess(null);
      setError("Approval failed. Please try again.");
    }
  }

  async function submitReverse() {
    if (busy || completedAction) return;
    setError(null);
    setBusy(true);

    const fd = new FormData();
    fd.set("employeeId", employeeId);
    fd.set("comment", comment);

    try {
      const result = await l1ReturnAction(fd);
      if (!result.success) {
        setError(result.error ?? "Action failed");
        setBusy(false);
        return;
      }
      setCompletedAction("reverse");
      setShowReverse(false);
      setComment("");
      setSuccess("Reversed — sent back to submitter with your note.");
      setBusy(false);
      router.refresh();
    } catch {
      setError("Reverse failed. Please try again.");
      setBusy(false);
    }
  }

  if (!canReview && !employeeIdCode && !success) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">L1 Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {success && (
          <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-800">
            {success}
          </p>
        )}
        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </p>
        )}

        {employeeIdCode && (
          <div className="rounded-md bg-primary/5 px-4 py-3">
            <p className="text-xs text-[#64748B]">Employee ID</p>
            <p className="font-mono text-lg font-semibold text-primary">
              {employeeIdCode}
            </p>
          </div>
        )}

        {canReview && (
          <div className="space-y-3">
            <Checkbox
              id="l1-approval-confirmation"
              checked={confirmChecked}
              onChange={(e) => setConfirmChecked(e.target.checked)}
              label="I have verified all employee details and documents uploaded by the Registration Submitter."
            />
            <div className="flex flex-wrap gap-2">
              <Button
                variant="default"
                size="sm"
                disabled={!confirmChecked || busy}
                onClick={() => void submitApprove()}
              >
                <CheckCircle className="h-4 w-4" />
                Approve &amp; Send to L2
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={busy}
                onClick={() => {
                  setShowReverse(true);
                  setComment("");
                  setError(null);
                }}
              >
                <Undo2 className="h-4 w-4" />
                Reverse
              </Button>
            </div>
          </div>
        )}

        {showReverse && canReview && (
          <div className="space-y-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <Label htmlFor="reverse-note">Reverse note for submitter</Label>
            <Textarea
              id="reverse-note"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Explain what needs to be corrected (min 10 characters)"
            />
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                isLoading={busy}
                disabled={comment.trim().length < 10 || busy}
                onClick={() => void submitReverse()}
              >
                Confirm Reverse
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={busy}
                onClick={() => setShowReverse(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
