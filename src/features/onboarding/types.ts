import {
  ONBOARDING_TOTAL_STEPS,
  DocumentType,
} from "@/features/onboarding/constants";
import { EmployeeStatus } from "@/types/enums";

export interface PersonalDetails {
  branchName?: string;
  clientId?: string;
  clientName?: string;
  siteName?: string;
  dateOfJoining?: string;
  postAppliedFor?: string;
  fullName?: string;
  fatherName?: string;
  motherName?: string;
  spouseOrNok?: string;
  dateOfBirth?: string;
  maritalStatus?: string;
  bloodGroup?: string;
  aadhaarNumber?: string;
  panNumber?: string;
  identificationMarks?: string;
  /** @deprecated legacy field */
  fatherOrHusbandName?: string;
  gender?: string;
  nationality?: string;
  religion?: string;
  alternatePhone?: string;
}

export interface AddressDetails {
  localAddress?: string;
  permanentAddress?: string;
  sameAsPresent?: boolean;
  /** @deprecated legacy structured address */
  present?: Record<string, string>;
  permanent?: Record<string, string>;
}

export interface EducationDetails {
  educationalQualification?: string;
  technicalQualification?: string;
  /** @deprecated legacy array entries */
  entries?: EducationEntry[];
}

export interface EducationEntry {
  qualification?: string;
  institution?: string;
  boardOrUniversity?: string;
  yearOfPassing?: string;
  percentage?: string;
}

export interface ReferenceEntry {
  name?: string;
  address?: string;
  phone?: string;
  occupation?: string;
  yearsKnown?: string;
}

export interface FamilyMember {
  name?: string;
  relationship?: string;
  dateOfBirth?: string;
  aadhaarNumber?: string;
  /** @deprecated */
  age?: string;
  occupation?: string;
  contactNumber?: string;
}

export interface NomineeDetails {
  name?: string;
  relationship?: string;
  dateOfBirth?: string;
  aadhaarNumber?: string;
  /** @deprecated */
  address?: string;
  sharePercentage?: string;
  guardianName?: string;
}

export interface ExServicemanDetails {
  isExServiceman?: boolean;
  armedForcesBranch?: string;
  rank?: string;
  serviceNumber?: string;
  dateOfDischarge?: string;
  unitLastServed?: string;
  dischargeBook?: string;
  /** @deprecated */
  regiment?: string;
  reasonForDischarge?: string;
}

export interface GunmanDetails {
  isGunman?: boolean;
  gunNumber?: string;
  licenseNumber?: string;
  licenseValidUpto?: string;
}

export interface AdditionalDetails {
  height?: string;
  weight?: string;
  eyeSight?: string;
  eyeColor?: string;
  hearing?: string;
  willingToWorkAnywhere?: boolean;
  joiningTimeline?: string;
  previousEmployer?: string;
  uanNo?: string;
  esicNumber?: string;
  ifscCode?: string;
  drivingLicenseNumber?: string;
  drivingLicenseValidityDate?: string;
  trainingCertificateUpload?: string;
  pasaraNumber?: string;
  pasaraValidityDate?: string;
  /** @deprecated */
  chestNormal?: string;
  chestExpanded?: string;
  languagesKnown?: string[];
  previousDesignation?: string;
  previousExperienceYears?: string;
  expectedDateOfJoining?: string;
  emergencyContactName?: string;
  emergencyContactRelation?: string;
  emergencyContactPhone?: string;
  hasCriminalRecord?: boolean;
  criminalRecordDetails?: string;
}

export interface DeclarationDetails {
  agreed?: boolean;
  policeVerificationAccepted?: boolean;
  place?: string;
  signatureDataUrl?: string;
  signedAt?: string;
}

export interface EmployeeFormData {
  personalDetails: PersonalDetails;
  address: AddressDetails;
  education: EducationDetails;
  references: ReferenceEntry[];
  familyDetails: FamilyMember[];
  nominee: NomineeDetails;
  exServiceman: ExServicemanDetails;
  gunman: GunmanDetails;
  additionalDetails: AdditionalDetails;
  declaration: DeclarationDetails;
}

export interface DocumentRecord {
  _id: string;
  documentType: DocumentType;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  uploadedAt: string;
}

export interface OnboardingEmployee {
  _id: string;
  applicationRef: string;
  status: EmployeeStatus;
  email: string;
  phone: string;
  currentStep: number;
  completedSteps: number[];
  correctionNotes?: string;
  correctionSteps?: number[];
  pendingFieldChanges?: Array<{
    path: string;
    label: string;
    oldValue: string;
    newValue: string;
  }>;
  formData: EmployeeFormData;
  documents: DocumentRecord[];
  lastSavedAt?: string;
}

export { ONBOARDING_TOTAL_STEPS };
