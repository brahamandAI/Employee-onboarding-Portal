/**
 * Seed script — creates default staff users for development.
 * Run: npx tsx scripts/seed/users.ts
 */


import mongoose from "mongoose";
import { hashPassword } from "../../src/lib/auth/password";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Set MONGODB_URI environment variable");
  process.exit(1);
}

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["SUBMITTER", "L1", "L2", "SUPPORT", "ADMIN"], required: true },
    isActive: { type: Boolean, default: true },
    failedLoginAttempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User = mongoose.models.User ?? mongoose.model("User", UserSchema);

const SEED_USERS = [
  { email: "submitter@rakshaksecuritas.com", name: "Registration Submitter", role: "SUBMITTER", password: "Submit@123" },
  { email: "l1@rakshaksecuritas.com", name: "L1 Reviewer", role: "L1", password: "L1Pass@123" },
  { email: "l2@rakshaksecuritas.com", name: "L2 Approver", role: "L2", password: "L2Pass@123" },
  { email: "support@rakshaksecuritas.com", name: "Support Admin", role: "SUPPORT", password: "Support@123" },
  { email: "comadmin@rakshaksecuritas.com", name: "System Administrator", role: "ADMIN", password: "Admin@123" },
];

async function seed() {
  await mongoose.connect(MONGODB_URI!);

  for (const u of SEED_USERS) {
    const existing = await User.findOne({ email: u.email });
    if (existing) {
      console.log(`Skip: ${u.email} already exists`);
      continue;
    }

    await User.create({
      email: u.email,
      name: u.name,
      role: u.role,
      passwordHash: await hashPassword(u.password),
      isActive: true,
      failedLoginAttempts: 0,
    });

    console.log(`Created: ${u.email} (${u.role}) — password: ${u.password}`);
  }

  // Seed master data for admin module
  const Department = mongoose.models.Department ?? mongoose.model("Department", new mongoose.Schema({
    name: String, code: String, description: String, isActive: { type: Boolean, default: true },
  }, { timestamps: true }));

  const Designation = mongoose.models.Designation ?? mongoose.model("Designation", new mongoose.Schema({
    name: String, code: String, departmentId: mongoose.Schema.Types.ObjectId, level: Number, isActive: { type: Boolean, default: true },
  }, { timestamps: true }));

  const SiteLocation = mongoose.models.SiteLocation ?? mongoose.model("SiteLocation", new mongoose.Schema({
    name: String, code: String, city: String, state: String, isActive: { type: Boolean, default: true },
  }, { timestamps: true }));

  const SEED_DEPARTMENTS = [
    { name: "Operations", code: "OPS", description: "Field operations and deployment" },
    { name: "Human Resources", code: "HR", description: "Recruitment and employee management" },
    { name: "Technology", code: "TECH", description: "CCTV and surveillance systems" },
  ];

  for (const d of SEED_DEPARTMENTS) {
    const existing = await Department.findOne({ code: d.code });
    if (!existing) {
      const dept = await Department.create(d);
      console.log(`Created department: ${d.code}`);
      if (d.code === "OPS") {
        await Designation.findOneAndUpdate(
          { code: "SG" },
          { name: "Security Guard", code: "SG", departmentId: dept._id, level: 1, isActive: true },
          { upsert: true }
        );
        await Designation.findOneAndUpdate(
          { code: "SUP" },
          { name: "Supervisor", code: "SUP", departmentId: dept._id, level: 2, isActive: true },
          { upsert: true }
        );
        console.log("Created designations: SG, SUP");
      }
    }
  }

  const SEED_SITES = [
    { name: "Cyber City HQ", code: "GUR-001", city: "Gurugram", state: "Haryana" },
    { name: "Bandra Kurla Complex", code: "MUM-001", city: "Mumbai", state: "Maharashtra" },
    { name: "Electronic City", code: "BLR-001", city: "Bengaluru", state: "Karnataka" },
  ];

  for (const s of SEED_SITES) {
    const existing = await SiteLocation.findOne({ code: s.code });
    if (!existing) {
      await SiteLocation.create(s);
      console.log(`Created site: ${s.code}`);
    }
  }
  
  // Seed sample employees for OTP / status portal testing
  const EmployeeSchema = new mongoose.Schema(
    {
      applicationRef: { type: String, required: true, unique: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      status: { type: String, default: "DRAFT" },
      employeeId: { type: String },
      currentStep: { type: Number, default: 1 },
      completedSteps: { type: [Number], default: [] },
      personalDetails: { type: mongoose.Schema.Types.Mixed },
      submittedAt: { type: Date },
      correctionNotes: { type: String },
      rejectionReason: { type: String },
    },
    { timestamps: true }
  );

  const Employee =
    mongoose.models.Employee ?? mongoose.model("Employee", EmployeeSchema);

  const IdCardSchema = new mongoose.Schema(
    {
      employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
      employeeIdCode: { type: String, required: true },
      url: { type: String, required: true },
      format: { type: String, default: "PDF" },
      status: { type: String, default: "ACTIVE" },
      generatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
  );

  const IdCard = mongoose.models.IdCard ?? mongoose.model("IdCard", IdCardSchema);

  const SAMPLE_EMPLOYEES = [
    {
      applicationRef: "RS-APP-20260704-TEST",
      email: "employee@test.com",
      phone: "9876543210",
      personalDetails: {
        fullName: "Rajesh Kumar",
        postAppliedFor: "Security Guard",
        nationality: "Indian",
      },
      status: "DRAFT",
    },
    {
      applicationRef: "RS-APP-20260704-PEND",
      email: "pending@test.com",
      phone: "9876543211",
      personalDetails: {
        fullName: "Amit Sharma",
        postAppliedFor: "Supervisor",
        nationality: "Indian",
      },
      status: "L1_REVIEW",
      submittedAt: new Date(),
    },
    {
      applicationRef: "RS-APP-20260704-L2",
      email: "l2pending@test.com",
      phone: "9876543213",
      personalDetails: {
        fullName: "Vikram Mehta",
        postAppliedFor: "Security Guard",
        nationality: "Indian",
      },
      status: "L2_REVIEW",
      submittedAt: new Date(Date.now() - 2 * 86400000),
      l1ApprovedAt: new Date(Date.now() - 86400000),
    },
    {
      applicationRef: "RS-APP-20260704-SUP",
      email: "supportpending@test.com",
      phone: "9876543214",
      personalDetails: {
        fullName: "Sanjay Verma",
        postAppliedFor: "Security Guard",
        nationality: "Indian",
      },
      status: "ID_GENERATED",
      employeeId: "RS-2026-0002",
      submittedAt: new Date(Date.now() - 3 * 86400000),
      l1ApprovedAt: new Date(Date.now() - 2 * 86400000),
      forwardedToSupportAt: new Date(Date.now() - 86400000),
    },
    {
      applicationRef: "RS-APP-20260704-APPR",
      email: "approved@test.com",
      phone: "9876543212",
      personalDetails: {
        fullName: "Priya Singh",
        postAppliedFor: "Security Guard",
        nationality: "Indian",
      },
      status: "ID_CARD_ISSUED",
      employeeId: "RS-2026-0001",
      submittedAt: new Date(Date.now() - 7 * 86400000),
    },
  ];

  for (const sample of SAMPLE_EMPLOYEES) {
    const existing = await Employee.findOne({ applicationRef: sample.applicationRef });
    if (existing) {
      console.log(`Skip employee: ${sample.applicationRef}`);
      continue;
    }

    const emp = await Employee.create({
      ...sample,
      currentStep: 7,
      completedSteps: [1, 2, 3, 4, 5, 6, 7],
    });
    console.log(`Created employee: ${sample.applicationRef} (${sample.status})`);

    if (sample.status === "ID_CARD_ISSUED" && sample.employeeId) {
      await IdCard.create({
        employeeId: emp._id,
        employeeIdCode: sample.employeeId,
        url: "https://res.cloudinary.com/demo/image/upload/sample.pdf",
        format: "PDF",
        status: "ACTIVE",
      });
      console.log(`  + ID card for ${sample.employeeId}`);
    }
  }

  await mongoose.disconnect();
  console.log("Seed complete.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

