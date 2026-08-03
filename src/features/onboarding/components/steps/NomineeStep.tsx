"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  nomineeSchema,
  NomineeInput,
} from "@/features/onboarding/schemas/onboarding.schema";
import { useAutoSave } from "@/features/onboarding/components/AutoSaveIndicator";
import { FormSection } from "@/features/onboarding/components/FormSection";
import { EmployeeFormData } from "@/features/onboarding/types";

interface StepProps {
  defaultValues: EmployeeFormData;
  formId: string;
  onSubmit: (data: NomineeInput) => void;
  onAutoSave: (data: NomineeInput) => void;
}

function formatAadhaarInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 12);
  const parts = digits.match(/.{1,4}/g) ?? [];
  return parts.join(" ");
}

function buildDefaults(formData: EmployeeFormData): NomineeInput {
  const n = formData.nominee;
  return {
    nominee: {
      name: n.name ?? "",
      relationship: n.relationship ?? "",
      dateOfBirth: n.dateOfBirth ?? "",
      aadhaarNumber: formatAadhaarInput(n.aadhaarNumber ?? ""),
    },
  };
}

export function NomineeStep({
  defaultValues,
  formId,
  onSubmit,
  onAutoSave,
}: StepProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<NomineeInput>({
    resolver: zodResolver(nomineeSchema),
    defaultValues: buildDefaults(defaultValues),
  });

  const nomineeErrors = errors.nominee as
    | {
        name?: { message?: string };
        dateOfBirth?: { message?: string };
        relationship?: { message?: string };
        aadhaarNumber?: { message?: string };
      }
    | undefined;

  useAutoSave(watch(), onAutoSave);

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormSection
        sectionNumber={4}
        title="Nominee Details"
        subtitle="Mandatory for EPF / insurance nomination."
      >
        <div className="overflow-x-auto rounded-lg border border-[#E2E8F0]">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <th className="px-3 py-2 text-left font-medium text-[#64748B]">Name</th>
                <th className="px-3 py-2 text-left font-medium text-[#64748B]">DOB</th>
                <th className="px-3 py-2 text-left font-medium text-[#64748B]">Relationship</th>
                <th className="px-3 py-2 text-left font-medium text-[#64748B]">Aadhaar Number *</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-2">
                  <Input {...register("nominee.name")} error={nomineeErrors?.name?.message} />
                </td>
                <td className="px-3 py-2">
                  <Input
                    type="date"
                    {...register("nominee.dateOfBirth")}
                    error={nomineeErrors?.dateOfBirth?.message}
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    {...register("nominee.relationship")}
                    error={nomineeErrors?.relationship?.message}
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    {...register("nominee.aadhaarNumber")}
                    value={watch("nominee.aadhaarNumber") ?? ""}
                    onChange={(e) =>
                      setValue("nominee.aadhaarNumber", formatAadhaarInput(e.target.value), {
                        shouldValidate: true,
                      })
                    }
                    placeholder="1234 5678 9012"
                    maxLength={14}
                    error={nomineeErrors?.aadhaarNumber?.message}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </FormSection>
    </form>
  );
}
