"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  familyDetailsSchema,
  FamilyDetailsInput,
} from "@/features/onboarding/schemas/onboarding.schema";
import { useAutoSave } from "@/features/onboarding/components/AutoSaveIndicator";
import { FormSection } from "@/features/onboarding/components/FormSection";
import { EmployeeFormData } from "@/features/onboarding/types";

interface StepProps {
  defaultValues: EmployeeFormData;
  formId: string;
  onSubmit: (data: FamilyDetailsInput) => void;
  onAutoSave: (data: FamilyDetailsInput) => void;
}

function formatAadhaarInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 12);
  const parts = digits.match(/.{1,4}/g) ?? [];
  return parts.join(" ");
}

function buildDefaults(formData: EmployeeFormData): FamilyDetailsInput {
  const family =
    formData.familyDetails.length > 0
      ? formData.familyDetails.map((m) => ({
          name: m.name ?? "",
          relationship: m.relationship ?? "",
          dateOfBirth: m.dateOfBirth ?? m.age ?? "",
          aadhaarNumber: formatAadhaarInput(m.aadhaarNumber ?? ""),
        }))
      : [{ name: "", relationship: "", dateOfBirth: "", aadhaarNumber: "" }];

  return { familyDetails: family };
}

export function FamilyStep({
  defaultValues,
  formId,
  onSubmit,
  onAutoSave,
}: StepProps) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<FamilyDetailsInput>({
    resolver: zodResolver(familyDetailsSchema),
    defaultValues: buildDefaults(defaultValues),
  });

  const { fields, append, remove } = useFieldArray({ control, name: "familyDetails" });
  useAutoSave(watch(), onAutoSave);

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormSection
        sectionNumber={3}
        title="Family Details"
        subtitle="Provide details of family members for ESIC / medical records."
      >
        <div className="overflow-x-auto rounded-lg border border-[#E2E8F0]">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <th className="px-3 py-2 text-left font-medium text-[#64748B]">S.No.</th>
                <th className="px-3 py-2 text-left font-medium text-[#64748B]">Name *</th>
                <th className="px-3 py-2 text-left font-medium text-[#64748B]">DOB *</th>
                <th className="px-3 py-2 text-left font-medium text-[#64748B]">Relationship *</th>
                <th className="px-3 py-2 text-left font-medium text-[#64748B]">Aadhaar Number *</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id} className="border-b border-[#E2E8F0] last:border-0">
                  <td className="px-3 py-2 text-[#64748B]">{index + 1}</td>
                  <td className="px-3 py-2">
                    <Input
                      {...register(`familyDetails.${index}.name`)}
                      error={errors.familyDetails?.[index]?.name?.message}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="date"
                      {...register(`familyDetails.${index}.dateOfBirth`)}
                      error={errors.familyDetails?.[index]?.dateOfBirth?.message}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      {...register(`familyDetails.${index}.relationship`)}
                      error={errors.familyDetails?.[index]?.relationship?.message}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      {...register(`familyDetails.${index}.aadhaarNumber`)}
                      value={watch(`familyDetails.${index}.aadhaarNumber`) ?? ""}
                      onChange={(e) =>
                        setValue(
                          `familyDetails.${index}.aadhaarNumber`,
                          formatAadhaarInput(e.target.value),
                          { shouldValidate: true }
                        )
                      }
                      placeholder="1234 5678 9012"
                      maxLength={14}
                      error={errors.familyDetails?.[index]?.aadhaarNumber?.message}
                    />
                  </td>
                  <td className="px-3 py-2">
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() =>
            append({ name: "", relationship: "", dateOfBirth: "", aadhaarNumber: "" })
          }
        >
          <Plus className="h-4 w-4" />
          Add Member
        </Button>
      </FormSection>
    </form>
  );
}
