"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  additionalParticularsSchema,
  AdditionalParticularsInput,
} from "@/features/onboarding/schemas/onboarding.schema";
import { ARMED_FORCES_BRANCHES } from "@/features/onboarding/constants";
import { useAutoSave } from "@/features/onboarding/components/AutoSaveIndicator";
import { FormSection } from "@/features/onboarding/components/FormSection";
import { EmployeeFormData } from "@/features/onboarding/types";

interface StepProps {
  defaultValues: EmployeeFormData;
  formId: string;
  onSubmit: (data: AdditionalParticularsInput) => void;
  onAutoSave: (data: AdditionalParticularsInput) => void;
}

function buildDefaults(formData: EmployeeFormData): AdditionalParticularsInput {
  const ex = formData.exServiceman;
  const gun = formData.gunman ?? { isGunman: false };

  return {
    exServiceman: {
      isExServiceman: ex.isExServiceman ?? false,
      armedForcesBranch: ex.armedForcesBranch ?? ex.regiment ?? "",
      rank: ex.rank ?? "",
      serviceNumber: ex.serviceNumber ?? "",
      dateOfDischarge: ex.dateOfDischarge ?? "",
      unitLastServed: ex.unitLastServed ?? "",
      dischargeBook: ex.dischargeBook ?? "",
    },
    gunman: {
      isGunman: gun.isGunman ?? false,
      gunNumber: gun.gunNumber ?? "",
      licenseNumber: gun.licenseNumber ?? "",
      licenseValidUpto: gun.licenseValidUpto ?? "",
    },
    additionalDetails: {
      drivingLicenseNumber: formData.additionalDetails.drivingLicenseNumber ?? "",
      drivingLicenseValidityDate: formData.additionalDetails.drivingLicenseValidityDate ?? "",
      trainingCertificateUpload: formData.additionalDetails.trainingCertificateUpload ?? "",
    },
  };
}

export function AdditionalStep({
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
  } = useForm<AdditionalParticularsInput>({
    resolver: zodResolver(additionalParticularsSchema),
    defaultValues: buildDefaults(defaultValues),
  });

  const exErrors = errors.exServiceman as
    | {
        armedForcesBranch?: { message?: string };
        rank?: { message?: string };
        serviceNumber?: { message?: string };
        dateOfDischarge?: { message?: string };
        unitLastServed?: { message?: string };
      }
    | undefined;
  const gunErrors = errors.gunman as
    | {
        gunNumber?: { message?: string };
        licenseNumber?: { message?: string };
        licenseValidUpto?: { message?: string };
      }
    | undefined;

  useAutoSave(watch(), onAutoSave);
  const isExServiceman = watch("exServiceman.isExServiceman");
  const isGunman = watch("gunman.isGunman");

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormSection sectionNumber={5} title="Additional Particulars — Ex Serviceman">
        <Checkbox
          id="isExServiceman"
          label="Ex Serviceman"
          checked={isExServiceman}
          onChange={(e) => setValue("exServiceman.isExServiceman", e.target.checked)}
        />
        {isExServiceman && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label required>Army / Navy / Air Force</Label>
              <Select
                {...register("exServiceman.armedForcesBranch")}
                placeholder="Select branch"
                options={ARMED_FORCES_BRANCHES.map((b) => ({ value: b, label: b }))}
                error={exErrors?.armedForcesBranch?.message}
              />
            </div>
            <div className="space-y-2">
              <Label required>Rank</Label>
              <Input {...register("exServiceman.rank")} error={exErrors?.rank?.message} />
            </div>
            <div className="space-y-2">
              <Label required>Service Number</Label>
              <Input
                {...register("exServiceman.serviceNumber")}
                error={exErrors?.serviceNumber?.message}
              />
            </div>
            <div className="space-y-2">
              <Label required>Date of Discharge</Label>
              <Input
                type="date"
                {...register("exServiceman.dateOfDischarge")}
                error={exErrors?.dateOfDischarge?.message}
              />
            </div>
            <div className="space-y-2">
              <Label required>Unit Last Served</Label>
              <Input
                {...register("exServiceman.unitLastServed")}
                error={exErrors?.unitLastServed?.message}
              />
            </div>
            <div className="space-y-2">
              <Label>Discharge Book</Label>
              <Input
                {...register("exServiceman.dischargeBook")}
                placeholder="Book / reference number"
              />
            </div>
          </div>
        )}
      </FormSection>

      <FormSection title="Additional Particulars — Gunman">
        <Checkbox
          id="isGunman"
          label="Gunman"
          checked={isGunman}
          onChange={(e) => setValue("gunman.isGunman", e.target.checked)}
        />
        {isGunman && (
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label required>Gun Number</Label>
              <Input {...register("gunman.gunNumber")} error={gunErrors?.gunNumber?.message} />
            </div>
            <div className="space-y-2">
              <Label required>License Number</Label>
              <Input
                {...register("gunman.licenseNumber")}
                error={gunErrors?.licenseNumber?.message}
              />
            </div>
            <div className="space-y-2">
              <Label required>Valid Upto</Label>
              <Input
                type="date"
                {...register("gunman.licenseValidUpto")}
                error={gunErrors?.licenseValidUpto?.message}
              />
            </div>
          </div>
        )}
      </FormSection>

      <FormSection title="Additional Details">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Driving License Number</Label>
            <Input {...register("additionalDetails.drivingLicenseNumber")} />
          </div>
          <div className="space-y-2">
            <Label>Validity Date</Label>
            <Input type="date" {...register("additionalDetails.drivingLicenseValidityDate")} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Training Certificate Upload</Label>
            <Input
              type="text"
              {...register("additionalDetails.trainingCertificateUpload")}
              placeholder="Upload reference / file name"
            />
          </div>
        </div>
      </FormSection>
    </form>
  );
}
