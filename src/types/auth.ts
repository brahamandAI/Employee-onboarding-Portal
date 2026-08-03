import { UserRole, StaffRole } from "@/types/enums";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: StaffRole;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: StaffRole;
  }

  interface JWT {
    id: string;
    role: StaffRole;
  }
}

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

export type EmployeeSessionPayload = {
  employeeId: string;
  applicationRef: string;
  email: string;
  role: UserRole.EMPLOYEE;
};

export type PasswordResetPayload = {
  userId: string;
  email: string;
  purpose: "password_reset";
};
