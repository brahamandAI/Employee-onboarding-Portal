"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Undo2, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
  onStatusChange?: (status: EmployeeStatus) => void;
}

export function L1ActionPanel({
  employeeId,
  status,
  employeeIdCode,
  onStatusChange,
}: L1ActionPanelProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [showReverse, setShowReverse] = useState(false);
  const [comment, setComment] = useState("");
  const [approvedByName, setApprovedByName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [completedAction, setCompletedAction] = useState<"approve" | "reverse" | null>(
    null
  );

  const canReview =
    completedAction === null &&
    [EmployeeStatus.SUBMITTED, EmployeeStatus.L1_REVIEW].includes(status);

  const isReversed =
    completedAction === "reverse" || status === EmployeeStatus.L1_RETURNED;

  async function submitApprove() {
    if (busy || completedAction) return;
    const name = approvedByName.trim();
    if (name.length < 2) {
      setError("Enter the L1 name in Approved by");
      return;
    }
    setError(null);
    setBusy(true);

    setCompletedAction("approve");
    setSuccess(`Approved by ${name} — forwarded to L2.`);
    setShowReverse(false);
    onStatusChange?.(EmployeeStatus.L2_REVIEW);

    const fd = new FormData();
    fd.set("employeeId", employeeId);
    fd.set("approvedByName", name);

    try {
      const result = await l1ApproveAction(fd);
      if (!result.success) {
        setCompletedAction(null);
        setSuccess(null);
        setError(result.error ?? "Action failed");
        onStatusChange?.(status);
        setBusy(false);
        return;
      }
      router.refresh();
    } catch {
      setCompletedAction(null);
      setSuccess(null);
      setError("Approval failed. Please try again.");
      onStatusChange?.(status);
    } finally {
      setBusy(false);
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
      onStatusChange?.(EmployeeStatus.L1_RETURNED);
      router.refresh();
    } catch {
      setError("Reverse failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (!canReview && !employeeIdCode && !isReversed && !success) {
    return null;
  }

  const canSubmitApprove =
    confirmChecked && approvedByName.trim().length >= 2 && !busy;

  return (
    <Card className="overflow-hidden border-[#BFDBFE] shadow-[0_12px_32px_-24px_rgba(29,78,216,0.45)]">
      <CardHeader className="bg-gradient-to-r from-[#EFF6FF] to-white">
        <CardTitle className="flex items-center gap-2 text-base">
          <UserCheck className="h-4 w-4 text-[#1D4ED8]" />
          L1 Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {success && (
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm font-medium text-emerald-800">
            {success}
          </p>
        )}
        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-800">
            {error}
          </p>
        )}

        {isReversed && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-sm font-semibold text-amber-900">Reversed to Submitter</p>
            <p className="mt-0.5 text-xs text-amber-800">
              Listed under Reversed until the submitter resubmits.
            </p>
          </div>
        )}

        {employeeIdCode && (
          <div className="rounded-xl bg-[#0B1F3A] px-4 py-3 text-white">
            <p className="text-[11px] uppercase tracking-wide text-white/70">Employee ID</p>
            <p className="font-mono text-lg font-semibold">{employeeIdCode}</p>
          </div>
        )}

        {canReview && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="l1-approved-by" required>
                Approved by
              </Label>
              <Input
                id="l1-approved-by"
                value={approvedByName}
                onChange={(e) => setApprovedByName(e.target.value)}
                placeholder="Type your name to approve"
                autoComplete="name"
                maxLength={80}
              />
              <p className="text-xs text-[#64748B]">
                This name is stored on the application as the L1 approver.
              </p>
            </div>
            <Checkbox
              id="l1-approval-confirmation"
              checked={confirmChecked}
              onChange={(e) => setConfirmChecked(e.target.checked)}
              label="I have verified all employee details and documents uploaded by the Registration Submitter."
            />
            <div className="flex flex-wrap gap-2">
              <Button
                variant="success"
                size="sm"
                isLoading={busy && completedAction === "approve"}
                disabled={!canSubmitApprove}
                onClick={() => void submitApprove()}
              >
                <CheckCircle className="h-4 w-4" />
                Approve &amp; Send to L2
              </Button>
              <Button
                variant="warning"
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
          <div className="space-y-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
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
