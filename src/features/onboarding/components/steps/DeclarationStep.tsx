"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  declarationSchema,
  DeclarationInput,
} from "@/features/onboarding/schemas/onboarding.schema";
import {
  DECLARATION_TEXT,
  APPLICANT_POLICE_VERIFICATION_DECLARATION,
  DIGITAL_SUBMISSION_NOTICE,
  DIGITAL_SUBMISSION_NOTICE_TITLE,
} from "@/features/onboarding/constants";
import { useAutoSave } from "@/features/onboarding/components/AutoSaveIndicator";
import { FormSection } from "@/features/onboarding/components/FormSection";
import { SignaturePad } from "@/features/onboarding/components/SignaturePad";
import { DeclarationDetails } from "@/features/onboarding/types";

interface StepProps {
  defaultValues: DeclarationDetails;
  formId: string;
  onSubmit: (data: DeclarationInput) => void;
  onAutoSave: (data: DeclarationInput) => void;
}

export function DeclarationStep({
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
  } = useForm<DeclarationInput>({
    resolver: zodResolver(declarationSchema),
    defaultValues: {
      declaration: {
        agreed: defaultValues.agreed ?? false,
        policeVerificationAccepted: defaultValues.policeVerificationAccepted ?? false,
        place: defaultValues.place ?? "",
        signatureDataUrl: defaultValues.signatureDataUrl ?? "",
        signedAt: defaultValues.signedAt ?? "",
      },
    },
  });

  useAutoSave(watch(), onAutoSave);
  const agreed = watch("declaration.agreed");
  const policeVerificationAccepted = watch("declaration.policeVerificationAccepted");
  const signatureDataUrl = watch("declaration.signatureDataUrl");

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormSection sectionNumber={7} title="Declaration" variant="highlight">
        <div className="mb-5 flex gap-3 rounded-xl border border-sky-200 bg-sky-50/70 p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" aria-hidden />
          <div>
            <p className="text-sm font-semibold text-sky-900">
              {DIGITAL_SUBMISSION_NOTICE_TITLE}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-sky-900/90">
              {DIGITAL_SUBMISSION_NOTICE}
            </p>
          </div>
        </div>

        <p className="mb-4 text-sm leading-relaxed text-[#334155]">{DECLARATION_TEXT}</p>

        <Checkbox
          id="declaration-agreed"
          label="I hereby declare that the information provided by me is true and correct."
          checked={!!agreed}
          onChange={(e) => setValue("declaration.agreed", e.target.checked)}
          error={errors.declaration?.agreed?.message}
        />

        <div className="mt-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
          <p className="text-xs font-semibold tracking-wide text-[#64748B]">FOR APPLICANT</p>
          <p className="mt-2 text-sm leading-relaxed text-[#334155]">
            {APPLICANT_POLICE_VERIFICATION_DECLARATION}
          </p>
          <div className="mt-3">
            <Checkbox
              id="police-verification-accepted"
              label="I accept the Police Verification declaration."
              checked={!!policeVerificationAccepted}
              onChange={(e) =>
                setValue("declaration.policeVerificationAccepted", e.target.checked)
              }
              error={errors.declaration?.policeVerificationAccepted?.message}
            />
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label required>Place</Label>
            <Input
              {...register("declaration.place")}
              placeholder="City name"
              error={errors.declaration?.place?.message}
            />
          </div>
          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              value={new Date().toISOString().slice(0, 10)}
              disabled
              className="bg-[#F1F5F9]"
            />
          </div>
        </div>

        <div className="mt-4">
          <SignaturePad
            value={signatureDataUrl}
            onChange={(dataUrl) => {
              setValue("declaration.signatureDataUrl", dataUrl, { shouldValidate: true });
              if (dataUrl) {
                setValue("declaration.signedAt", new Date().toISOString());
              }
            }}
            error={errors.declaration?.signatureDataUrl?.message}
          />
        </div>
      </FormSection>
    </form>
  );
}
