import { EmployeeStatus } from "@/types/enums";
import { OnboardingEmployee, EmployeeFormData } from "@/features/onboarding/types";

function emptyFormData(): EmployeeFormData {
  return {
    personalDetails: {
      branchName: "",
      clientId: "",
      clientName: "",
      siteName: "",
      dateOfJoining: "",
      fullName: "",
      postAppliedFor: "",
    },
    address: { localAddress: "", permanentAddress: "", sameAsPresent: false },
    education: { educationalQualification: "", technicalQualification: "" },
    references: [
      { name: "", phone: "", address: "" },
      { name: "", phone: "", address: "" },
    ],
    familyDetails: [{ name: "", relationship: "", dateOfBirth: "", aadhaarNumber: "" }],
    nominee: {},
    exServiceman: { isExServiceman: false },
    gunman: { isGunman: false },
    additionalDetails: {},
    declaration: {},
  };
}

export function createEmptyOnboardingEmployee(): OnboardingEmployee {
  return {
    _id: "",
    applicationRef: "",
    status: EmployeeStatus.DRAFT,
    email: "",
    phone: "",
    currentStep: 1,
    completedSteps: [],
    formData: emptyFormData(),
    documents: [],
  };
}
