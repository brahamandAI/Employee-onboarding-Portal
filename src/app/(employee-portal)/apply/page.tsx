import { getEmployeeSession } from "@/lib/auth/employee-session";
import { getOnboardingEmployee } from "@/lib/services/onboarding.service";
import {
  getApplicationStatus,
} from "@/lib/services/application-status.service";
import { getEmployeeNotificationHistory } from "@/lib/services/notification.service";
import { EmployeeStatus } from "@/types/enums";
import { OnboardingWizardLoader } from "@/features/onboarding/components/OnboardingWizardLoader";
import { EmploymentFormLayout } from "@/features/onboarding/components/EmploymentFormLayout";
import { createEmptyOnboardingEmployee } from "@/features/onboarding/utils/empty-employee";
import { RegistrationStatusPanel } from "@/features/registration/components/RegistrationStatusPanel";
import {
  getApprovalStageLabel,
  getRegistrationStatusLabel,
} from "@/features/application-status/constants";

export const metadata = { title: "Employee Registration — Rakshak Securitas" };

const EDITABLE_STATUSES = [
  EmployeeStatus.DRAFT,
  EmployeeStatus.L1_RETURNED,
  EmployeeStatus.L2_RETURNED,
];

export default async function ApplyPage() {
  const session = await getEmployeeSession();
  let employee = null;
  let registrationMode = true;

  if (session) {
    employee = await getOnboardingEmployee(session.employeeId);
    if (employee) {
      registrationMode = false;
    }
  }

  if (employee && !EDITABLE_STATUSES.includes(employee.status)) {
    const [status, notifications] = await Promise.all([
      getApplicationStatus(session!.employeeId),
      getEmployeeNotificationHistory(session!.employeeId, 8),
    ]);

    if (status) {
      const liveStatus = {
        ...status,
        statusLabel: getRegistrationStatusLabel(status.status),
        approvalStage: getApprovalStageLabel(status.status),
        notifications,
        updatedAt: new Date().toISOString(),
      };

      return (
        <EmploymentFormLayout applicationRef={status.applicationRef}>
          <RegistrationStatusPanel initialData={liveStatus} />
        </EmploymentFormLayout>
      );
    }
  }

  const displayEmployee = employee ?? createEmptyOnboardingEmployee();

  return (
    <EmploymentFormLayout
      applicationRef={displayEmployee.applicationRef || undefined}
      currentStep={displayEmployee.currentStep}
    >
      <OnboardingWizardLoader employee={displayEmployee} registrationMode={registrationMode} />
    </EmploymentFormLayout>
  );
}
