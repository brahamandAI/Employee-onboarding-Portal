/**
 * Central site content configuration.
 * Replace placeholder values with official Rakshak Securitas details when available.
 * Do not treat placeholder text as verified company facts.
 */

export const SITE = {
  legalName: "Rakshak Securitas Pvt Ltd",
  shortName: "Rakshak Securitas",
  name: "Rakshak Securitas",
  tagline: "Secure Operations. Trusted People. Digital Excellence.",
  intro:
    "Rakshak Securitas delivers professional security and facility management services across India. Our Employee Onboarding Management System (EOMS) streamlines hiring — from digital employment forms and document verification to L1/L2 approval and ID card issuance.",
  description:
    "Rakshak Securitas EOMS — digital employee onboarding, application tracking, document uploads, L1/L2 approval workflow, and secure ID card generation for security workforce management.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXTAUTH_URL ?? "https://www.rakshaksecuritas.com",
  email: "recruitment@rakshaksecuritas.com",
  generalEmail: "admin@rakshaksecuritas.com",
  phone: "+91 9818662052",
  officePhone: "011-42760103",
  address:
    "T-5, Plot No. 12, Manish Plaza-III, Sector-10, Dwarka, New Delhi – 110075, India",
  officeHours: "Monday – Saturday: 9:00 AM – 6:00 PM",
  heroImage: "/marketing/hero-pattern.svg",
  founded: "",
} as const;

/** Core platform capabilities shown on the home page */
export const PLATFORM_FEATURES = [
  {
    title: "Digital Employment Form",
    description:
      "7-section online form matching the official paper employment application — applicant details, references, family, nominee, additional particulars, documents, and declaration.",
    icon: "FileText",
    color: "from-primary to-primary-hover",
  },
  {
    title: "Auto-Save & Progress",
    description:
      "Applications save automatically at every step. Applicants can pause and resume anytime from the employee portal.",
    icon: "Save",
    color: "from-[#0f2d4a] to-primary",
  },
  {
    title: "Document Uploads",
    description:
      "Secure upload of Aadhaar, PAN, photo, bank passbook, certificates, and more — stored safely in the cloud.",
    icon: "Upload",
    color: "from-accent to-[#b8941f]",
  },
  {
    title: "L1 / L2 Approval",
    description:
      "Structured review workflow — L1 verification, employee ID generation, L2 final approval, and support operations.",
    icon: "CheckCircle",
    color: "from-primary-hover to-[#0a1f38]",
  },
  {
    title: "Application Tracking",
    description:
      "Real-time status timeline for applicants — see exactly where your application is in the review process.",
    icon: "Clock",
    color: "from-[#1a3a5c] to-primary-hover",
  },
  {
    title: "Digital ID Cards",
    description:
      "Official employee ID cards with QR verification, generated after full approval and available for download.",
    icon: "CreditCard",
    color: "from-[#b8941f] to-accent",
  },
] as const;

export const PORTAL_ROLES = [
  {
    role: "Employee Portal",
    description: "Register, complete employment form, upload documents, track status, download ID card.",
    href: "/apply",
    cta: "Employee Registration",
    icon: "User",
    accent: "bg-blue-500",
  },
  {
    role: "L1 Reviewer",
    description: "Review applications, verify documents, approve or return for corrections.",
    href: "/staff/login",
    cta: "Staff Login",
    icon: "Search",
    accent: "bg-emerald-500",
  },
  {
    role: "L2 Approver",
    description: "Final management approval before ID card generation and onboarding completion.",
    href: "/staff/login",
    cta: "Staff Login",
    icon: "BadgeCheck",
    accent: "bg-violet-500",
  },
  {
    role: "Support Admin",
    description: "ID card generation, user management, departments, audit logs, and system settings.",
    href: "/staff/login",
    cta: "Staff Login",
    icon: "Settings",
    accent: "bg-amber-500",
  },
] as const;

export const NAV_LINKS = [
  { label: "About", href: "/?section=about" },
  { label: "Services", href: "/?section=services" },
  { label: "FAQ", href: "/?section=faq" },
  { label: "Contact", href: "/?section=contact" },
] as const;

/** @deprecated Use MARKETING_SECTIONS from sections.ts */
export const HOME_ANCHORS = [
  { label: "About", href: "/?section=about" },
  { label: "Services", href: "/?section=services" },
  { label: "FAQ", href: "/?section=faq" },
  { label: "Contact", href: "/?section=contact" },
] as const;

export const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://www.rakshaksecuritas.com", icon: "Linkedin" },
  { label: "Facebook", href: "https://www.rakshaksecuritas.com", icon: "Facebook" },
  { label: "Instagram", href: "https://www.rakshaksecuritas.com", icon: "Instagram" },
  { label: "YouTube", href: "https://www.rakshaksecuritas.com", icon: "Youtube" },
] as const;

export const COMPANY_STATS = [
  { id: "sections", label: "Registration Sections", displayValue: "7", numericValue: 7, suffix: "" },
  { id: "documents", label: "Required Documents", displayValue: "10", numericValue: 10, suffix: "+" },
  { id: "roles", label: "Portal Roles", displayValue: "4", numericValue: 4, suffix: "" },
  { id: "workflow", label: "Approval Stages", displayValue: "9", numericValue: 9, suffix: "" },
  {
    id: "portal",
    label: "Secure Cloud Based Employee Onboarding",
    displayValue: "Cloud",
    numericValue: null as number | null,
    suffix: "",
  },
] as const;

export const PORTAL_ROLES_LIST = [
  "Employee",
  "L1 Approver",
  "L2 Approver",
  "Support Team",
] as const;

export const APPROVAL_STAGES_LIST = [
  "Draft",
  "Submitted",
  "Pending L1",
  "L1 Approved",
  "Employee Number Generated",
  "Pending L2",
  "L2 Approved",
  "ID Card Generated",
  "Completed",
] as const;

export const ABOUT_CONTENT = {
  title: "About Rakshak Securitas Pvt Ltd",
  intro: [
    "Rakshak Securitas Pvt Ltd is a leading Security and Facility Management Company providing professional security services, integrated facility management, housekeeping services, manpower solutions, skill development, and technical support services across India.",
    "The company is committed to delivering reliable security solutions through trained professionals, operational excellence, technology-driven workforce management, and customer-focused services.",
    "To improve employee onboarding and recruitment, Rakshak Securitas has implemented a secure digital Employee Onboarding Management System (EOMS) that replaces traditional paper-based recruitment with a streamlined online process.",
  ],
  overview:
    "Rakshak Securitas Pvt Ltd specializes in providing professional manpower and integrated security solutions for corporate organizations, industries, residential communities, hospitals, educational institutions, commercial establishments, and various public sector organizations. The company follows a structured recruitment and verification process to ensure every employee meets organizational standards before deployment. The Employee Onboarding Management System enables candidates to complete employment registration, upload documents, track approvals, and complete joining formalities digitally.",
  mission:
    "To deliver reliable, professional, and technology-driven security and facility management solutions by building a disciplined workforce, maintaining transparent recruitment practices, and providing exceptional customer service.",
  vision:
    "To become one of India's most trusted security and facility management organizations by continuously improving operational excellence, employee development, client satisfaction, and digital workforce management.",
  objectives: [
    "Deliver high-quality security and facility management services.",
    "Build a skilled and disciplined workforce through structured recruitment and training.",
    "Ensure complete statutory compliance and transparent employee onboarding.",
    "Improve operational efficiency using digital technologies.",
    "Maintain long-term relationships through quality service and customer satisfaction.",
    "Support employee growth through continuous training and professional development.",
  ],
  values: [
    {
      title: "Integrity",
      description:
        "We conduct our business with honesty, transparency, and ethical practices while maintaining the trust of our employees, clients, and business partners.",
      icon: "Scale",
    },
    {
      title: "Professionalism",
      description:
        "Our employees maintain high standards of discipline, appearance, communication, and service quality in every assignment.",
      icon: "Award",
    },
    {
      title: "Reliability",
      description:
        "We are committed to delivering dependable services through consistent operations, timely response, and well-trained personnel.",
      icon: "ShieldCheck",
    },
    {
      title: "Accountability",
      description:
        "Every employee is responsible for maintaining organizational standards, complying with company policies, and continuously improving service quality.",
      icon: "ClipboardCheck",
    },
    {
      title: "Customer Commitment",
      description:
        "We strive to understand client requirements and deliver customized security and facility management solutions with excellence.",
      icon: "HeartHandshake",
    },
    {
      title: "Continuous Improvement",
      description:
        "We encourage innovation, training, and continuous learning to improve employee performance and organizational growth.",
      icon: "TrendingUp",
    },
  ],
} as const;

export const COMPANY_HIGHLIGHTS = [
  { title: "Digital Employee Onboarding", icon: "Laptop", description: "End-to-end online hiring from registration to joining." },
  { title: "Paperless Registration", icon: "FileCheck", description: "Replace manual forms with a secure digital employment application." },
  { title: "Secure Document Verification", icon: "Shield", description: "Upload and verify identity, education, and compliance documents online." },
  { title: "Role Based Approval Workflow", icon: "GitBranch", description: "Structured L1 and L2 review with audit-ready decision tracking." },
  { title: "Employee ID Generation", icon: "Hash", description: "Unique employee numbers assigned automatically after L1 approval." },
  { title: "Digital ID Card Management", icon: "CreditCard", description: "Official ID cards generated, issued, and verified through the portal." },
] as const;

export const WHY_CHOOSE = [
  {
    title: "Experienced Team",
    description:
      "A dedicated workforce of trained professionals committed to delivering reliable and efficient services across multiple industries.",
    icon: "Users",
  },
  {
    title: "Professional Security",
    description:
      "Well-trained security personnel equipped to manage corporate, industrial, residential, healthcare, and commercial security requirements.",
    icon: "Shield",
  },
  {
    title: "Trained Staff",
    description:
      "Employees undergo systematic recruitment, verification, and onboarding procedures to maintain high professional standards.",
    icon: "GraduationCap",
  },
  {
    title: "Digital Recruitment",
    description:
      "The Employee Onboarding Management System provides a paperless, secure, and transparent recruitment experience from registration to joining.",
    icon: "Zap",
  },
  {
    title: "Nationwide Operations",
    description:
      "The organization provides security and facility management services across multiple locations in India with standardized operational practices.",
    icon: "MapPin",
  },
  {
    title: "Employee Welfare",
    description:
      "Rakshak Securitas promotes employee development, workplace discipline, and professional growth through structured HR processes.",
    icon: "Heart",
  },
  {
    title: "Compliance",
    description:
      "The company follows statutory documentation, employee verification, and organizational compliance procedures to support lawful operations.",
    icon: "ClipboardCheck",
  },
  {
    title: "Customer Satisfaction",
    description:
      "Customer satisfaction is achieved through dependable services, responsive support, trained manpower, and continuous operational improvement.",
    icon: "ThumbsUp",
  },
] as const;

export const SERVICES = [
  {
    title: "Security Services",
    description:
      "Trained security professionals for commercial, industrial, residential, institutional, and government organizations.",
    icon: "Shield",
  },
  {
    title: "Industrial Security",
    description:
      "Protection for manufacturing facilities, warehouses, production units, equipment, and inventory.",
    icon: "Factory",
  },
  {
    title: "Corporate Security",
    description:
      "Security solutions for IT companies, business parks, offices, and corporate campuses.",
    icon: "Building2",
  },
  {
    title: "Residential Security",
    description:
      "Gate security, visitor management, and patrol services for apartments and gated communities.",
    icon: "Home",
  },
  {
    title: "Hospital Security",
    description:
      "Healthcare security supporting hospitals, clinics, and medical institutions.",
    icon: "Hospital",
  },
  {
    title: "Event Security",
    description:
      "Crowd control, VIP security, and venue monitoring for conferences and public gatherings.",
    icon: "Calendar",
  },
  {
    title: "ATM Security",
    description:
      "Dedicated ATM security personnel for customer safety and location monitoring.",
    icon: "CreditCard",
  },
  {
    title: "Facility Management",
    description:
      "Integrated facility operations for commercial, industrial, healthcare, and residential sites.",
    icon: "Wrench",
  },
  {
    title: "Housekeeping Services",
    description:
      "Professional cleaning, sanitation, and maintenance for offices, hospitals, and hotels.",
    icon: "Sparkles",
  },
  {
    title: "Manpower Services",
    description:
      "Recruitment, verification, training, and deployment of trained personnel across industries.",
    icon: "UserPlus",
  },
] as const;

export const RECRUITMENT_STEPS = [
  { step: 1, title: "Employee Registration", description: "Create your account with basic contact details to begin the application.", icon: "UserPlus" },
  { step: 2, title: "Fill Employment Form", description: "Complete the digital employment form with personal, family, and nominee details.", icon: "FileText" },
  { step: 3, title: "Upload Documents", description: "Submit required identity, education, and supporting documents securely online.", icon: "Upload" },
  { step: 4, title: "L1 Verification", description: "L1 reviewer validates your application and documents for completeness.", icon: "Search" },
  { step: 5, title: "Employee ID Generation", description: "Upon L1 approval, a unique employee number is generated automatically.", icon: "Hash" },
  { step: 6, title: "L2 Approval", description: "L2 approver conducts final review before forwarding to support operations.", icon: "CheckCircle" },
  { step: 7, title: "ID Card Generation", description: "Support team generates your official employee ID card with QR verification.", icon: "CreditCard" },
  { step: 8, title: "Successfully Onboarded", description: "Receive confirmation and access your employee portal and ID card download.", icon: "BadgeCheck" },
] as const;

export const ONBOARDING_WORKFLOW = [
  { title: "Registration", description: "Employee registers on the portal" },
  { title: "Document Verification", description: "Documents uploaded and verified" },
  { title: "L1 Approval", description: "First-level review and decision" },
  { title: "Employee Number Generated", description: "Unique ID assigned automatically" },
  { title: "L2 Approval", description: "Final management approval" },
  { title: "ID Card Generation", description: "Support team issues ID card" },
  { title: "Employee Active", description: "Onboarding complete" },
] as const;

export const REQUIRED_DOCUMENTS = [
  { title: "Passport Photo", icon: "Camera" },
  { title: "Aadhaar", icon: "Fingerprint" },
  { title: "PAN", icon: "CreditCard" },
  { title: "Bank Passbook", icon: "Landmark" },
  { title: "Signature", icon: "PenLine" },
  { title: "Education Certificates", icon: "GraduationCap" },
  { title: "Experience Certificates", icon: "Briefcase" },
  { title: "Police Verification", icon: "ShieldCheck" },
  { title: "Medical Certificate", icon: "HeartPulse" },
  { title: "Driving License", icon: "Car" },
  { title: "Other Documents", icon: "Files" },
] as const;

export const BENEFITS = [
  {
    title: "Career Growth",
    description:
      "Structured roles across security operations, facility management, and supervisory positions with advancement pathways.",
    icon: "TrendingUp",
  },
  {
    title: "Professional Environment",
    description:
      "Work with trained teams following organized procedures, uniforms, and professional workplace standards.",
    icon: "Building",
  },
  {
    title: "Timely Salary",
    description:
      "Established payroll and workforce management practices supporting reliable compensation for deployed personnel.",
    icon: "Wallet",
  },
  {
    title: "Training",
    description:
      "Orientation, verification, and role-specific preparation before deployment to client locations.",
    icon: "BookOpen",
  },
  {
    title: "Job Security",
    description:
      "Opportunities with an established security and facility management organization operating across multiple sectors.",
    icon: "Lock",
  },
  {
    title: "Employee Support",
    description:
      "HR assistance, digital onboarding support, and help desk guidance throughout the recruitment process.",
    icon: "Headphones",
  },
  {
    title: "Uniform",
    description:
      "Professional uniform and deployment readiness as part of organized security workforce operations.",
    icon: "Shirt",
  },
  {
    title: "Insurance",
    description:
      "Workforce policies aligned with statutory compliance and organizational employment procedures.",
    icon: "Shield",
  },
] as const;

export const WHY_JOIN = {
  headline: "Build a Secure Career with Rakshak Securitas",
  description:
    "Join a professional security and facility management organization with digital onboarding, structured verification, and clear pathways from application to deployment.",
  points: [
    {
      title: "Career Opportunities",
      description:
        "Roles across security guarding, supervision, facility management, housekeeping, and manpower services.",
    },
    {
      title: "Learning & Development",
      description:
        "Training, verification, and preparation before assignment to client sites and operational duties.",
    },
    {
      title: "Growth",
      description:
        "Advancement opportunities based on performance, experience, and operational requirements.",
    },
    {
      title: "Safe Working Environment",
      description:
        "Organized deployment procedures, supervision, and compliance-focused workforce management.",
    },
    {
      title: "Recognition",
      description:
        "Professional standards, accountability, and performance-oriented operational culture.",
    },
    {
      title: "Long-Term Career",
      description:
        "Stable employment opportunities with a growing security services organization across India.",
    },
  ],
} as const;

export const FAQ_ITEMS = [
  {
    question: "How do I join as an employee?",
    answer:
      "Contact HR or click Employee Registration on the home page. Complete the 7-section employment form and upload all required documents to begin onboarding.",
  },
  {
    question: "What documents are required?",
    answer:
      "Required documents typically include passport photo, Aadhaar, PAN, bank passbook, signature, and supporting certificates. See the Required Documents section for the full checklist.",
  },
  {
    question: "How long does approval take?",
    answer:
      "Processing time depends on application completeness and review workload. You can track real-time status on the registration page after submission.",
  },
  {
    question: "How do I receive my employee ID?",
    answer:
      "After L1 approval, your employee number is generated automatically. You will see it in your application status timeline once assigned.",
  },
  {
    question: "When will my ID card be generated?",
    answer:
      "After L2 approval, the request is forwarded to the Support team who generates your ID card. You will be notified when it is ready for download.",
  },
] as const;

/** Legacy exports for backward compatibility */
export const STATS = COMPANY_STATS.map((s) => ({ value: s.displayValue, label: s.label }));
export const VALUES = ABOUT_CONTENT.values;
export const WHY_US = WHY_CHOOSE.map((w) => w.title);
export const CAREERS = [
  {
    title: "Security Guard",
    location: "Pan India — Client Sites",
    type: "Full-time",
    department: "Security Operations",
  },
  {
    title: "Security Supervisor",
    location: "Delhi NCR & Major Cities",
    type: "Full-time",
    department: "Security Operations",
  },
  {
    title: "Facility Management Staff",
    location: "Commercial & Industrial Sites",
    type: "Full-time",
    department: "Facility Management",
  },
  {
    title: "Housekeeping Personnel",
    location: "Offices, Hospitals & Institutions",
    type: "Full-time",
    department: "Housekeeping Services",
  },
] as const;
