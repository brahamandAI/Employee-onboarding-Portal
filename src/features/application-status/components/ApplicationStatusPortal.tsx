"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Clock,
  XCircle,
  AlertTriangle,
  Download,
  Eye,
  Printer,
  Shield,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ApplicationStatusData,
  TimelineStep,
  TimelineStepState,
} from "@/features/application-status/constants";
import { cn } from "@/lib/utils";

interface ApplicationStatusPortalProps {
  data: ApplicationStatusData;
}

export function ApplicationStatusPortal({ data }: ApplicationStatusPortalProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary lg:hidden">
          Application Status
        </h1>
        <p className="mt-1 text-sm text-[#64748B] lg:hidden">
          Track your onboarding progress below.
        </p>
      </div>

      {data.displayStatus === "CORRECTION_REQUIRED" && (
        <Card className="border-amber-200 bg-amber-50 shadow-sm">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <AlertTriangle className="h-6 w-6 shrink-0 text-amber-600" />
              <div>
                <p className="font-semibold text-amber-900">Action Required</p>
                <p className="mt-1 text-sm text-amber-800">
                  {data.correctionNotes ??
                    "Your application requires corrections. Please update and resubmit."}
                </p>
              </div>
            </div>
            {data.editUrl && (
              <Link href={data.editUrl}>
                <Button variant="accent">
                  Edit Application
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}

      {data.displayStatus === "REJECTED" && (
        <Card className="border-red-200 bg-red-50 shadow-sm">
          <CardContent className="flex gap-3 p-5">
            <XCircle className="h-6 w-6 shrink-0 text-red-600" />
            <div>
              <p className="font-semibold text-red-900">Application Rejected</p>
              <p className="mt-1 text-sm text-red-800">
                {data.rejectionReason ??
                  "Your application was not approved. Contact support for more information."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {data.idCard && (
        <Card className="overflow-hidden border-primary/20 shadow-md">
          <CardContent className="flex flex-col gap-4 bg-gradient-to-br from-primary/5 to-accent/5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg">
                <Shield className="h-7 w-7" />
              </div>
              <div>
                <p className="font-heading text-lg font-semibold text-primary">ID Card Generated</p>
                <p className="text-sm text-[#64748B]">
                  Generated on{" "}
                  {new Date(data.idCard.generatedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href={data.idCard.url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2">
                  <Eye className="h-4 w-4" />
                  View ID Card
                </Button>
              </a>
              <a href={data.idCard.url} target="_blank" rel="noopener noreferrer" download>
                <Button variant="accent" size="lg" className="gap-2">
                  <Download className="h-5 w-5" />
                  Download ID Card
                </Button>
              </a>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => window.open(data.idCard!.url, "_blank")}
              >
                <Printer className="h-4 w-4" />
                Print ID Card
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h2 className="font-heading text-lg font-semibold text-primary">
            Detailed Timeline
          </h2>
          <p className="mt-1 text-sm text-[#64748B]">
            Step-by-step progress of your application review and onboarding.
          </p>
          <div className="mt-6">
            <StatusTimeline steps={data.timeline} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatusTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="relative space-y-0">
      {steps.map((step, index) => (
        <li key={step.id} className="relative flex gap-4 pb-8 last:pb-0">
          {index < steps.length - 1 && (
            <span
              className={cn(
                "absolute left-[19px] top-10 h-[calc(100%-2rem)] w-0.5",
                step.state === "completed" ? "bg-green-300" : "bg-[#E2E8F0]"
              )}
            />
          )}
          <TimelineIcon state={step.state} />
          <div className="min-w-0 flex-1 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <p
              className={cn(
                "font-medium",
                step.state === "pending" ? "text-[#94A3B8]" : "text-primary"
              )}
            >
              {step.title}
            </p>
            <p className="mt-1 text-sm text-[#64748B]">{step.description}</p>
            {step.date && (
              <p className="mt-2 text-xs font-medium text-accent">{step.date}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

function TimelineIcon({ state }: { state: TimelineStepState }) {
  const base =
    "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm";

  switch (state) {
    case "completed":
      return (
        <div className={cn(base, "bg-green-100 ring-4 ring-green-50")}>
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        </div>
      );
    case "current":
      return (
        <div className={cn(base, "bg-primary ring-4 ring-primary/15")}>
          <Clock className="h-4 w-4 text-white" />
        </div>
      );
    case "error":
      return (
        <div className={cn(base, "bg-red-100 ring-4 ring-red-50")}>
          <XCircle className="h-5 w-5 text-red-600" />
        </div>
      );
    default:
      return (
        <div className={cn(base, "border-2 border-[#E2E8F0] bg-white")}>
          <Circle className="h-4 w-4 text-[#CBD5E1]" />
        </div>
      );
  }
}
