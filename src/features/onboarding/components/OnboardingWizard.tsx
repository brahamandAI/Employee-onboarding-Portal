"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Send,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AutoSaveIndicator } from "@/features/onboarding/components/AutoSaveIndicator";
import { FormStepNav } from "@/features/onboarding/components/FormStepNav";
import { ApplicantFormStep } from "@/features/onboarding/components/steps/ApplicantFormStep";
import { ReferencesStep } from "@/features/onboarding/components/steps/ReferencesStep";
import { FamilyStep } from "@/features/onboarding/components/steps/FamilyStep";
import { NomineeStep } from "@/features/onboarding/components/steps/NomineeStep";
import { AdditionalStep } from "@/features/onboarding/components/steps/AdditionalStep";
import { DeclarationStep } from "@/features/onboarding/components/steps/DeclarationStep";
import { DocumentsStep } from "@/features/onboarding/components/steps/DocumentsStep";
import {
  saveStepAction,
  goToStepAction,
  submitApplicationAction,
} from "@/features/onboarding/actions/onboarding.actions";
import { registerAndSaveStep1Action } from "@/features/registration/actions/register.actions";
import {
  ONBOARDING_STEPS,
  ONBOARDING_TOTAL_STEPS,
  DocumentType,
  getRequiredDocuments,
} from "@/features/onboarding/constants";
import { OnboardingEmployee, DocumentRecord } from "@/features/onboarding/types";
import { useToast } from "@/components/ui/toast";
import { RegistrationSubmittedSuccess } from "@/features/onboarding/components/RegistrationSubmittedSuccess";
import { EmployeeStatus } from "@/types/enums";

interface OnboardingWizardProps {
  employee: OnboardingEmployee;
  registrationMode?: boolean;
  submitterMode?: boolean;
  l1EditMode?: boolean;
}

export function OnboardingWizard({
  employee: initialEmployee,
  registrationMode = false,
  submitterMode = false,
  l1EditMode = false,
}: OnboardingWizardProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [employee, setEmployee] = useState(initialEmployee);
  const [currentStep, setCurrentStep] = useState(
    Math.min(employee.currentStep || 1, ONBOARDING_TOTAL_STEPS)
  );
  const [completedSteps, setCompletedSteps] = useState(employee.completedSteps);
  const [documents, setDocuments] = useState<DocumentRecord[]>(employee.documents);
  const [lastSavedAt, setLastSavedAt] = useState(employee.lastSavedAt ?? null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [contactEmail, setContactEmail] = useState(employee.email);
  const [contactPhone, setContactPhone] = useState(employee.phone);

  const isNewRegistration = registrationMode && !employee.applicationRef;
  const formId = `step-form-${currentStep}`;
  const stepMeta = ONBOARDING_STEPS[currentStep - 1];
  const { formData } = employee;

  function mergeStepData(step: number, data: Record<string, unknown>) {
    setEmployee((prev) => {
      const nextFormData = { ...prev.formData };

      if (step === 1) {
        if (data.personalDetails) nextFormData.personalDetails = data.personalDetails as typeof nextFormData.personalDetails;
        if (data.address) nextFormData.address = data.address as typeof nextFormData.address;
        if (data.education) nextFormData.education = data.education as typeof nextFormData.education;
        if (data.additionalDetails) {
          nextFormData.additionalDetails = data.additionalDetails as typeof nextFormData.additionalDetails;
        }
      } else if (step === 2 && data.references) {
        nextFormData.references = data.references as typeof nextFormData.references;
      } else if (step === 3 && data.familyDetails) {
        nextFormData.familyDetails = data.familyDetails as typeof nextFormData.familyDetails;
      } else if (step === 4 && data.nominee) {
        nextFormData.nominee = data.nominee as typeof nextFormData.nominee;
      } else if (step === 5) {
        if (data.exServiceman) nextFormData.exServiceman = data.exServiceman as typeof nextFormData.exServiceman;
        if (data.gunman) nextFormData.gunman = data.gunman as typeof nextFormData.gunman;
        if (data.additionalDetails) {
          nextFormData.additionalDetails = {
            ...nextFormData.additionalDetails,
            ...(data.additionalDetails as typeof nextFormData.additionalDetails),
          };
        }
      } else if (step === 7 && data.declaration) {
        nextFormData.declaration = data.declaration as typeof nextFormData.declaration;
      }

      return { ...prev, formData: nextFormData };
    });
  }

  const handleAutoSave = useCallback(
    async (data: Record<string, unknown>) => {
      if (isNewRegistration) return;
      setIsSaving(true);
      const result = await saveStepAction(currentStep, data, { validate: false });
      if (result.success && result.data?.savedAt) {
        setLastSavedAt(result.data.savedAt);
        mergeStepData(currentStep, data);
      }
      setIsSaving(false);
    },
    [currentStep, isNewRegistration]
  );

  const handleStepSubmit = useCallback(
    async (data: Record<string, unknown>) => {
      setIsSaving(true);

      if (currentStep === 1 && isNewRegistration) {
        const fullName =
          (data as { personalDetails?: { fullName?: string } }).personalDetails?.fullName ?? "";

        const result = await registerAndSaveStep1Action(
          { fullName, email: contactEmail, phone: contactPhone },
          data
        );

        if (!result.success) {
          toast({
            title: "Registration failed",
            description: result.error,
            variant: "destructive",
          });
          setIsSaving(false);
          return;
        }

        toast({
          title: "Registration started",
          description: "Your application has been created. Continue with the next sections.",
          variant: "success",
        });

        setEmployee((prev) => ({
          ...prev,
          applicationRef: result.applicationRef,
          email: contactEmail,
          phone: contactPhone,
        }));
        mergeStepData(1, data);

        if (!completedSteps.includes(1)) {
          setCompletedSteps((prev) => [...prev, 1].sort((a, b) => a - b));
        }

        const next = 2;
        setCurrentStep(next);
        router.refresh();
        setIsSaving(false);
        return;
      }

      const result = await saveStepAction(currentStep, data, {
        validate: true,
        markComplete: true,
      });

      if (!result.success) {
        toast({
          title: "Validation error",
          description: result.error,
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }

      setLastSavedAt(result.data?.savedAt ?? null);
      mergeStepData(currentStep, data);
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps((prev) => [...prev, currentStep].sort((a, b) => a - b));
      }

      if (currentStep < ONBOARDING_TOTAL_STEPS) {
        const next = currentStep + 1;
        setCurrentStep(next);
        void goToStepAction(next);
      }

      setIsSaving(false);
    },
    [currentStep, completedSteps, toast, isNewRegistration, contactEmail, contactPhone, router]
  );

  async function handleFinalSubmit() {
    const requiredDocs = getRequiredDocuments({
      isExServiceman: Boolean(formData.exServiceman?.isExServiceman),
      isGunman: Boolean(formData.gunman?.isGunman),
    });
    const hasLiveSig =
      typeof formData.declaration?.signatureDataUrl === "string" &&
      formData.declaration.signatureDataUrl.startsWith("data:image/");
    const missing = requiredDocs.filter((t) => {
      if (t === DocumentType.SIGNATURE && hasLiveSig) return false;
      return !documents.some((d) => d.documentType === t);
    });

    if (missing.length > 0) {
      toast({
        title: "Documents required",
        description: `Please upload: ${missing.join(", ")}`,
        variant: "destructive",
      });
      setCurrentStep(6);
      return;
    }

    setIsSubmitting(true);

    const submitResult = await submitApplicationAction();

    if (submitResult.success) {
      if (l1EditMode) {
        toast({
          title: "Updated",
          description: "Changes saved and form resubmitted for approval.",
          variant: "success",
        });
        window.location.assign(`/dashboard/l1/applications/${employee._id}`);
        return;
      }
      setIsSubmitted(true);
      if (!submitterMode) {
        toast({
          title: "Application submitted",
          description: "Your employment form has been submitted successfully.",
          variant: "success",
        });
      }
      router.refresh();
    } else {
      toast({ title: "Submission failed", description: submitResult.error, variant: "destructive" });
    }

    setIsSubmitting(false);
  }

  async function handleDeclarationSubmit(data: Record<string, unknown>) {
    setIsSaving(true);
    const result = await saveStepAction(7, data, { validate: true, markComplete: true });

    if (!result.success) {
      toast({
        title: "Validation error",
        description: result.error,
        variant: "destructive",
      });
      setIsSaving(false);
      return;
    }

    if (!completedSteps.includes(7)) {
      setCompletedSteps((prev) => [...prev, 7].sort((a, b) => a - b));
    }
    mergeStepData(7, data);

    setIsSaving(false);
    await handleFinalSubmit();
  }

  function handleNext() {
    if (currentStep === 7) {
      const form = document.getElementById(formId) as HTMLFormElement | null;
      form?.requestSubmit();
      return;
    }

    if (currentStep === 6) {
      const next = 7;
      setCurrentStep(next);
      void goToStepAction(next);
      if (!completedSteps.includes(6)) {
        setCompletedSteps((prev) => [...prev, 6].sort((a, b) => a - b));
      }
      return;
    }

    const form = document.getElementById(formId) as HTMLFormElement | null;
    form?.requestSubmit();
  }

  function handleBack() {
    if (currentStep <= 1) return;
    const prev = currentStep - 1;
    setCurrentStep(prev);
    if (!isNewRegistration) {
      void goToStepAction(prev);
    }
  }

  function handleStepClick(step: number) {
    if (step === currentStep) return;
    setCurrentStep(step);
    if (!isNewRegistration) {
      void goToStepAction(step);
    }
  }

  if (isSubmitted) {
    return (
      <RegistrationSubmittedSuccess
        applicationRef={employee.applicationRef || "—"}
        employeeId={employee._id}
        submitterMode={submitterMode}
        onContinueEditing={
          submitterMode
            ? () => {
                setIsSubmitted(false);
                setCurrentStep(1);
              }
            : undefined
        }
      />
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col">
      <FormStepNav
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
      />

      <div className="flex flex-1 flex-col">
        <div className="flex-1 py-4 sm:py-6">
          {employee.correctionNotes && (
            <div className="mb-6 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <p className="text-sm font-semibold text-amber-800">
                  Reversed — Update Required
                </p>
                <p className="mt-1 text-sm text-amber-700">{employee.correctionNotes}</p>
                <p className="mt-2 text-xs text-amber-700">
                  Please update the mentioned details and click Update &amp; Resubmit.
                </p>
              </div>
            </div>
          )}

          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-heading text-lg font-bold text-[#1E3A8A] sm:text-xl">
              {stepMeta?.label}
            </h2>
            {currentStep !== 6 && !isNewRegistration && (
              <AutoSaveIndicator isSaving={isSaving} lastSavedAt={lastSavedAt} />
            )}
          </div>

          <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm sm:p-6">
            {currentStep === 1 && (
              <ApplicantFormStep
                defaultValues={formData}
                email={contactEmail}
                phone={contactPhone}
                registrationMode={isNewRegistration}
                onContactChange={(field, value) => {
                  if (field === "email") setContactEmail(value);
                  else setContactPhone(value);
                }}
                formId={formId}
                onSubmit={handleStepSubmit}
                onAutoSave={handleAutoSave}
              />
            )}
            {currentStep === 2 && (
              <ReferencesStep
                defaultValues={formData}
                formId={formId}
                onSubmit={handleStepSubmit}
                onAutoSave={handleAutoSave}
              />
            )}
            {currentStep === 3 && (
              <FamilyStep
                defaultValues={formData}
                formId={formId}
                onSubmit={handleStepSubmit}
                onAutoSave={handleAutoSave}
              />
            )}
            {currentStep === 4 && (
              <NomineeStep
                defaultValues={formData}
                formId={formId}
                onSubmit={handleStepSubmit}
                onAutoSave={handleAutoSave}
              />
            )}
            {currentStep === 5 && (
              <AdditionalStep
                defaultValues={formData}
                formId={formId}
                onSubmit={handleStepSubmit}
                onAutoSave={handleAutoSave}
              />
            )}
            {currentStep === 6 && (
              <DocumentsStep
                documents={documents}
                onDocumentsChange={setDocuments}
                isExServiceman={Boolean(formData.exServiceman?.isExServiceman)}
                isGunman={Boolean(formData.gunman?.isGunman)}
              />
            )}
            {currentStep === 7 && (
              <DeclarationStep
                defaultValues={formData.declaration}
                formId={formId}
                onSubmit={handleDeclarationSubmit}
                onAutoSave={handleAutoSave}
              />
            )}
          </div>
        </div>

        <div className="sticky bottom-0 flex items-center justify-between gap-4 border-t border-[#E2E8F0] bg-white py-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1 || isSaving || isSubmitting}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {currentStep < ONBOARDING_TOTAL_STEPS ? (
            <Button type="button" onClick={handleNext} isLoading={isSaving} disabled={isSubmitting}>
              Save & Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <div className="flex flex-wrap justify-end gap-2">
              {l1EditMode && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSaving || isSubmitting}
                  onClick={() => {
                    window.location.assign(
                      `/dashboard/l1/applications/${employee._id}`
                    );
                  }}
                >
                  Back to Review
                </Button>
              )}
              <Button
                type="button"
                onClick={handleNext}
                isLoading={isSubmitting || isSaving}
                className="bg-gradient-to-r from-[#1D4ED8] to-[#2563EB]"
              >
                <Send className="h-4 w-4" />
                {l1EditMode ||
                employee.status === EmployeeStatus.L1_RETURNED ||
                employee.status === EmployeeStatus.L2_RETURNED ||
                employee.status === EmployeeStatus.SUBMITTED ||
                employee.status === EmployeeStatus.L1_REVIEW
                  ? "Update & Resubmit"
                  : "Submit Application"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
