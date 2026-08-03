"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  referencesSchema,
  ReferencesInput,
} from "@/features/onboarding/schemas/onboarding.schema";
import { useAutoSave } from "@/features/onboarding/components/AutoSaveIndicator";
import { FormSection } from "@/features/onboarding/components/FormSection";
import { EmployeeFormData } from "@/features/onboarding/types";

interface StepProps {
  defaultValues: EmployeeFormData;
  formId: string;
  onSubmit: (data: ReferencesInput) => void;
  onAutoSave: (data: ReferencesInput) => void;
}

function buildDefaults(formData: EmployeeFormData): ReferencesInput {
  const refs =
    formData.references.length >= 2
      ? formData.references.slice(0, 2).map((r) => ({
          name: r.name ?? "",
          phone: r.phone ?? "",
          address: r.address ?? "",
        }))
      : [
          { name: "", phone: "", address: "" },
          { name: "", phone: "", address: "" },
        ];

  return { references: refs };
}

export function ReferencesStep({
  defaultValues,
  formId,
  onSubmit,
  onAutoSave,
}: StepProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ReferencesInput>({
    resolver: zodResolver(referencesSchema),
    defaultValues: buildDefaults(defaultValues),
  });

  useAutoSave(watch(), onAutoSave);

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormSection
        sectionNumber={2}
        title="Reference Details"
        subtitle="Please give name and address of two persons other than relatives for reference."
      >
        {[0, 1].map((index) => (
          <div
            key={index}
            className="mb-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4 last:mb-0"
          >
            <h4 className="mb-3 text-sm font-semibold text-[#1D4ED8]">
              Reference Person {index + 1}
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label required>Full Name</Label>
                <Input
                  {...register(`references.${index}.name`)}
                  error={errors.references?.[index]?.name?.message}
                />
              </div>
              <div className="space-y-2">
                <Label required>Contact Number</Label>
                <Input
                  {...register(`references.${index}.phone`)}
                  maxLength={10}
                  error={errors.references?.[index]?.phone?.message}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label required>Address</Label>
                <Textarea
                  {...register(`references.${index}.address`)}
                  rows={2}
                  error={errors.references?.[index]?.address?.message}
                />
              </div>
            </div>
          </div>
        ))}
      </FormSection>
    </form>
  );
}
