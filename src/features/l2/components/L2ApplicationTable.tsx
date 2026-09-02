"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftCircle, CheckCircle, Eye } from "lucide-react";
import { ApplicationListItem } from "@/lib/services/l1.service";
import { StatusBadge } from "@/features/l1/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { EmployeeStatus } from "@/types/enums";
import {
  l2ApproveAction,
  l2ReturnToL1Action,
} from "@/features/l2/actions/l2.actions";
import { EmptyState } from "@/components/ui/empty-state";

interface L2ApplicationTableProps {
  applications: ApplicationListItem[];
  emptyMessage?: string;
  viewPathPrefix?: string;
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function L2ApplicationTable({
  applications,
  emptyMessage = "No applications found.",
  viewPathPrefix = "/dashboard/l2/applications",
}: L2ApplicationTableProps) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());
  const [reversingId, setReversingId] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleApprove(employeeId: string) {
    if (busyId || doneIds.has(employeeId)) return;
    setError(null);
    setSuccess("Approved — forwarded successfully.");
    setDoneIds((prev) => new Set(prev).add(employeeId));
    setReversingId(null);

    const fd = new FormData();
    fd.set("employeeId", employeeId);

    try {
      const result = await l2ApproveAction(fd);
      if (!result.success) {
        setDoneIds((prev) => {
          const next = new Set(prev);
          next.delete(employeeId);
          return next;
        });
        setSuccess(null);
        setError(result.error ?? "Approval failed");
        return;
      }
      router.refresh();
    } catch {
      setDoneIds((prev) => {
        const next = new Set(prev);
        next.delete(employeeId);
        return next;
      });
      setSuccess(null);
      setError("Approval failed. Please try again.");
    }
  }

  async function handleReturnToL1(employeeId: string) {
    if (busyId || doneIds.has(employeeId)) return;
    setError(null);
    setBusyId(employeeId);

    const fd = new FormData();
    fd.set("employeeId", employeeId);
    fd.set("comment", comment);

    try {
      const result = await l2ReturnToL1Action(fd);
      if (!result.success) {
        setError(result.error ?? "Send back failed");
        setBusyId(null);
        return;
      }
      setDoneIds((prev) => new Set(prev).add(employeeId));
      setReversingId(null);
      setComment("");
      setSuccess("Sent back to L1 for re-review.");
      setBusyId(null);
      router.refresh();
    } catch {
      setError("Send back failed. Please try again.");
      setBusyId(null);
    }
  }

  if (applications.length === 0) {
    return (
      <EmptyState
        title={emptyMessage}
        description="Applications forwarded from L1 will appear in this queue."
      />
    );
  }

  return (
    <div className="space-y-4">
      {success && (
        <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-800">{success}</p>
      )}
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>
      )}

      <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]/90">
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                  Application Ref
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">Name</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">Post</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">Status</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                  L1 Approved By
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => {
                const canReview =
                  !doneIds.has(app._id) && app.status === EmployeeStatus.L2_REVIEW;

                return (
                  <tr
                    key={app._id}
                    className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC]"
                  >
                    <td className="px-4 py-3 font-medium text-primary">
                      {app.applicationRef}
                    </td>
                    <td className="px-4 py-3">{app.fullName}</td>
                    <td className="px-4 py-3 text-[#64748B]">
                      {app.postAppliedFor ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      {doneIds.has(app._id) ? (
                        <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                          Done
                        </span>
                      ) : (
                        <StatusBadge status={app.status} />
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#64748B]">
                      {app.l1ApprovedByName
                        ? `${app.l1ApprovedByName}${app.l1ApprovedAt ? ` (${formatDate(app.l1ApprovedAt)})` : ""}`
                        : formatDate(app.l1ApprovedAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <Link
                          href={`${viewPathPrefix}/${app._id}`}
                          className="inline-flex h-8 items-center gap-1 rounded-md px-3 text-sm font-medium text-primary hover:bg-muted"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Link>
                        {canReview && (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              disabled={!!busyId}
                              onClick={() => void handleApprove(app._id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={!!busyId}
                              onClick={() => {
                                setReversingId(app._id);
                                setComment("");
                                setError(null);
                              }}
                            >
                              <ArrowLeftCircle className="h-4 w-4" />
                              Send Back to L1
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {reversingId && !doneIds.has(reversingId) && (
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <Label htmlFor="reverse-comment">Note for L1 Approver</Label>
          <Textarea
            id="reverse-comment"
            rows={3}
            className="mt-2"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Explain what needs correction (min 10 characters)"
          />
          <div className="mt-3 flex gap-2">
            <Button
              variant="default"
              size="sm"
              isLoading={busyId === reversingId}
              disabled={comment.trim().length < 10 || !!busyId}
              onClick={() => void handleReturnToL1(reversingId)}
            >
              Confirm Send Back to L1
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={!!busyId}
              onClick={() => setReversingId(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
