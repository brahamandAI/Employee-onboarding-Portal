"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, ArrowLeftCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmployeeStatus } from "@/types/enums";
import { isPendingL2Review } from "@/lib/services/approval-queue";
import {
  l2ApproveAction,
  l2ReturnToL1Action,
} from "@/features/l2/actions/l2.actions";

interface L2ActionPanelProps {
  employeeId: string;
  status: EmployeeStatus;
  employeeIdCode?: string;
  l1DecisionAction?: string;
  l2DecisionAction?: "APPROVE" | "REJECT" | "RETURN" | "RETURN_TO_L1" | "FORWARD";
  forwardedToSupportAt?: string;
  forwardedToAdminAt?: string;
}

type CompletedAction = "approve" | "returnToL1" | null;

export function L2ActionPanel({
  employeeId,
  status,
  employeeIdCode,
  l1DecisionAction,
  l2DecisionAction,
  forwardedToSupportAt,
  forwardedToAdminAt,
}: L2ActionPanelProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [showReturnToL1, setShowReturnToL1] = useState(false);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [completedAction, setCompletedAction] = useState<CompletedAction>(null);
  const [approvedIdCode, setApprovedIdCode] = useState<string | undefined>(
    employeeIdCode
  );

  const canReview =
    completedAction === null &&
    isPendingL2Review({
      status,
      l1Decision: l1DecisionAction ? { action: l1DecisionAction } : undefined,
      l2Decision: l2DecisionAction ? { action: l2DecisionAction } : undefined,
      forwardedToSupportAt,
      forwardedToAdminAt,
    });

  const isRejected =
    completedAction === null &&
    (l2DecisionAction === "REJECT" || status === EmployeeStatus.REJECTED);
  const isApproved =
    completedAction === "approve" ||
    l2DecisionAction === "APPROVE" ||
    l2DecisionAction === "FORWARD" ||
    !!forwardedToSupportAt ||
    !!forwardedToAdminAt;

  const reversedTarget: "submitter" | "l1" | null =
    completedAction === "returnToL1" || l2DecisionAction === "RETURN_TO_L1"
      ? "l1"
      : l2DecisionAction === "RETURN" || status === EmployeeStatus.L2_RETURNED
        ? "submitter"
        : null;

  async function submitApprove() {
    if (busy || completedAction) return;
    setError(null);

    setCompletedAction("approve");
    setSuccess("Approved — Temporary Employee ID is being generated and sent to Admin.");
    setShowReturnToL1(false);

    const fd = new FormData();
    fd.set("employeeId", employeeId);

    try {
      const result = await l2ApproveAction(fd);
      if (!result.success) {
        setCompletedAction(null);
        setSuccess(null);
        setError(result.error ?? "Action failed");
        return;
      }
      if (result.data?.employeeIdCode) {
        setApprovedIdCode(result.data.employeeIdCode);
        setSuccess(
          `Approved — Temporary Employee ID ${result.data.employeeIdCode} generated and sent to Admin.`
        );
      }
      router.refresh();
    } catch {
      setCompletedAction(null);
      setSuccess(null);
      setError("Approval failed. Please try again.");
    }
  }

  async function submitReturnToL1() {
    if (busy || completedAction) return;
    setError(null);
    setBusy(true);

    const fd = new FormData();
    fd.set("employeeId", employeeId);
    fd.set("comment", comment);

    try {
      const result = await l2ReturnToL1Action(fd);
      if (!result.success) {
        setError(result.error ?? "Action failed");
        setBusy(false);
        return;
      }
      setCompletedAction("returnToL1");
      setShowReturnToL1(false);
      setComment("");
      setSuccess("Sent back to L1 with your note.");
      setBusy(false);
      router.refresh();
    } catch {
      setError("Action failed. Please try again.");
      setBusy(false);
    }
  }

  if (
    !canReview &&
    !approvedIdCode &&
    !forwardedToSupportAt &&
    !forwardedToAdminAt &&
    !isRejected &&
    !isApproved &&
    !reversedTarget &&
    !success
  ) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">L2 Actions</CardTitle>
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

        {approvedIdCode && (
          <div className="rounded-md bg-primary/5 px-4 py-3">
            <p className="text-xs text-[#64748B]">Temporary Employee ID</p>
            <p className="font-mono text-lg font-semibold text-primary">
              {approvedIdCode}
            </p>
          </div>
        )}

        {isRejected && (
          <div className="rounded-md bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-800">Rejected at L2</p>
            <p className="text-xs text-red-700">Not forwarded to Admin.</p>
          </div>
        )}

        {reversedTarget && !isApproved && !isRejected && (
          <div className="rounded-md bg-amber-50 px-4 py-3">
            <p className="text-sm font-medium text-amber-900">
              {reversedTarget === "l1"
                ? "Sent back to L1 Approver"
                : "Reversed to Submitter"}
            </p>
            <p className="text-xs text-amber-800">
              {reversedTarget === "l1"
                ? "Listed under Reversed Applications until L1 re-approves it."
                : "Listed under Reversed Applications until the submitter resubmits."}
            </p>
          </div>
        )}

        {forwardedToAdminAt && (
          <div className="rounded-md bg-green-50 px-4 py-3">
            <p className="text-xs text-green-700">Sent to Admin</p>
            <p className="text-sm text-green-800">
              {new Date(forwardedToAdminAt).toLocaleString("en-IN")}
            </p>
          </div>
        )}

        {forwardedToSupportAt && (
          <div className="rounded-md bg-green-50 px-4 py-3">
            <p className="text-xs text-green-700">Forwarded to Support</p>
            <p className="text-sm text-green-800">
              {new Date(forwardedToSupportAt).toLocaleString("en-IN")}
            </p>
          </div>
        )}

        {canReview && (
          <div className="space-y-3">
            <Checkbox
              id="l2-approval-confirmation"
              checked={confirmChecked}
              onChange={(e) => setConfirmChecked(e.target.checked)}
              label="I have verified all employee details, uploaded documents, and bank details."
            />
            <div className="flex flex-wrap gap-2">
              <Button
                variant="default"
                size="sm"
                disabled={!confirmChecked || busy}
                onClick={() => void submitApprove()}
              >
                <CheckCircle className="h-4 w-4" />
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={busy}
                onClick={() => {
                  setShowReturnToL1(true);
                  setComment("");
                  setError(null);
                }}
              >
                <ArrowLeftCircle className="h-4 w-4" />
                Send Back to L1
              </Button>
            </div>
          </div>
        )}

        {showReturnToL1 && canReview && (
          <div className="space-y-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <Label htmlFor="l2-reverse-note">Note for L1 Approver</Label>
            <Textarea
              id="l2-reverse-note"
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
                onClick={() => void submitReturnToL1()}
              >
                Confirm Send Back to L1
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={busy}
                onClick={() => setShowReturnToL1(false)}
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
