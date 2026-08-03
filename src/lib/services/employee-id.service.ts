import { connectDB } from "@/lib/db/connect";
import { Setting } from "@/lib/db/models/Setting";
import { Employee } from "@/lib/db/models/Employee";
import { EmployeeStatus } from "@/types/enums";

export const TEMP_EMPLOYEE_ID_COUNTER_KEY = "employee_id_counter_rspl_temp";

export class EmployeeIdError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = "EmployeeIdError";
  }
}

export function formatTemporaryEmployeeId(sequence: number): string {
  return `RSPL ${String(sequence).padStart(5, "0")}`;
}

async function ensureTempCounterBaseline(): Promise<void> {
  const counter = await Setting.findOne({ key: TEMP_EMPLOYEE_ID_COUNTER_KEY });
  if (!counter) {
    await Setting.create({
      key: TEMP_EMPLOYEE_ID_COUNTER_KEY,
      value: { sequence: 0, prefix: "RSPL" },
    });
  }
}

/**
 * Generates a unique Temporary Employee ID after L2 approval.
 * Format: RSPL 00001, RSPL 00002, ...
 */
export async function generateTemporaryEmployeeId(
  employeeId: string
): Promise<{ employeeIdCode: string }> {
  await connectDB();

  const employee = await Employee.findById(employeeId);
  if (!employee) {
    throw new EmployeeIdError("Employee not found", "NOT_FOUND");
  }

  if (employee.temporaryEmployeeId) {
    return { employeeIdCode: employee.temporaryEmployeeId };
  }

  const allowedStatuses = [
    EmployeeStatus.APPROVED,
    EmployeeStatus.L2_REVIEW,
    EmployeeStatus.ID_GENERATED,
    EmployeeStatus.ID_CARD_ISSUED,
  ];

  if (!allowedStatuses.includes(employee.status)) {
    throw new EmployeeIdError(
      "Temporary Employee ID can only be generated after L2 approval",
      "INVALID_STATUS"
    );
  }

  await ensureTempCounterBaseline();

  const counter = await Setting.findOneAndUpdate(
    { key: TEMP_EMPLOYEE_ID_COUNTER_KEY },
    { $inc: { "value.sequence": 1 } },
    { new: true }
  );

  const sequence = (counter?.value as { sequence: number }).sequence;
  if (sequence == null || sequence < 1) {
    throw new EmployeeIdError(
      "Failed to allocate temporary employee number",
      "COUNTER_ERROR"
    );
  }

  const employeeIdCode = formatTemporaryEmployeeId(sequence);

  const duplicate = await Employee.findOne({
    $or: [
      { temporaryEmployeeId: employeeIdCode },
      { employeeId: employeeIdCode },
    ],
  });
  if (duplicate) {
    throw new EmployeeIdError("Duplicate employee ID generated", "DUPLICATE");
  }

  employee.temporaryEmployeeId = employeeIdCode;
  employee.employeeId = employeeIdCode;
  employee.idGeneratedAt = new Date();
  if (employee.status === EmployeeStatus.APPROVED) {
    employee.status = EmployeeStatus.ID_GENERATED;
  }
  await employee.save();

  return { employeeIdCode };
}
