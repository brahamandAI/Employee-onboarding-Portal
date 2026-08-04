export const CONTACT_PAGE = {
  title: "Contact Rakshak Securitas Pvt Ltd",
  subtitle:
    "We're here to assist candidates, employees, and clients with recruitment, employee onboarding, HR support, and general inquiries. Our team is committed to providing timely assistance throughout your onboarding journey.",
} as const;

export const CORPORATE_OFFICE = {
  title: "Corporate Office",
  subtitle: "Registered & Corporate Office",
  lines: [
    "T-5, Plot No. 12",
    "Manish Plaza-III",
    "Sector-10",
    "Dwarka",
    "New Delhi – 110075",
    "India",
  ],
  mapQuery:
    "T-5, Plot No. 12, Manish Plaza-III, Sector-10, Dwarka, New Delhi 110075, India",
} as const;

export const HR_CONTACT = {
  title: "HR & Recruitment",
  subtitle: "Recruitment Team",
  mobile: "+91 9818662052",
  office: "011-42760103",
  recruitmentEmail: "recruitment@rakshaksecuritas.com",
  generalEmail: "admin@rakshaksecuritas.com",
  website: "https://www.rakshaksecuritas.com",
} as const;

export const WORKING_HOURS = [
  { day: "Monday", hours: "9:00 AM – 6:00 PM", closed: false },
  { day: "Tuesday", hours: "9:00 AM – 6:00 PM", closed: false },
  { day: "Wednesday", hours: "9:00 AM – 6:00 PM", closed: false },
  { day: "Thursday", hours: "9:00 AM – 6:00 PM", closed: false },
  { day: "Friday", hours: "9:00 AM – 6:00 PM", closed: false },
  { day: "Saturday", hours: "9:00 AM – 6:00 PM", closed: false },
  { day: "Sunday", hours: "Closed", closed: true },
] as const;

export const CONTACT_FORM = {
  title: "Send Us a Message",
  description:
    "Have a question regarding recruitment, employee onboarding, or our services? Complete the form below and our HR team will contact you.",
} as const;

export const CONTACT_SUBJECTS = [
  { value: "recruitment", label: "Recruitment" },
  { value: "employee-registration", label: "Employee Registration" },
  { value: "application-status", label: "Application Status" },
  { value: "document-upload", label: "Document Upload" },
  { value: "hr-support", label: "HR Support" },
  { value: "technical-support", label: "Technical Support" },
  { value: "security-services", label: "Security Services" },
  { value: "facility-management", label: "Facility Management" },
  { value: "general-inquiry", label: "General Inquiry" },
] as const;

export const EMPLOYEE_HELP_DESK = {
  title: "Employee Support Center",
  description:
    "The Employee Help Desk provides assistance throughout the recruitment and onboarding process.",
  items: [
    {
      title: "Employee Registration",
      description: "Need help creating your account?",
      icon: "UserPlus",
      href: "/apply",
    },
    {
      title: "Application Status",
      description: "Track your onboarding progress.",
      icon: "Clock",
      href: "/login",
    },
    {
      title: "Document Upload",
      description: "Support for uploading employment documents.",
      icon: "Upload",
      href: "/login",
    },
    {
      title: "L1 & L2 Approval",
      description: "Understand the approval process.",
      icon: "CheckCircle",
      href: "/?section=faq",
    },
    {
      title: "Employee Number",
      description:
        "Information about Employee Number generation after L1 approval.",
      icon: "Hash",
      href: "/?section=faq",
    },
    {
      title: "Employee ID Card",
      description:
        "Download your ID Card after Support completes the process.",
      icon: "CreditCard",
      href: "/login",
    },
  ],
} as const;

export const RECRUITMENT_SUPPORT = {
  title: "Join Rakshak Securitas Pvt Ltd",
  description:
    "Our digital Employee Onboarding Management System allows candidates to complete every stage of recruitment online.",
  workflow: [
    "Create Account",
    "Fill Employment Form",
    "Upload Documents",
    "Submit Application",
    "L1 Approval",
    "Employee Number Generated",
    "L2 Approval",
    "Support Team",
    "ID Card Generation",
    "Employee Successfully Onboarded",
  ],
} as const;

export const CONTACT_WHY_CHOOSE = [
  {
    title: "Dedicated HR Team",
    description: "Professional recruitment assistance.",
    icon: "Users",
  },
  {
    title: "Fast Response",
    description: "Quick responses to employee queries.",
    icon: "Zap",
  },
  {
    title: "Transparent Communication",
    description: "Real-time onboarding updates.",
    icon: "Eye",
  },
  {
    title: "Secure Employee Portal",
    description: "Protected employee information.",
    icon: "ShieldCheck",
  },
  {
    title: "Digital Recruitment",
    description: "Paperless onboarding process.",
    icon: "Laptop",
  },
  {
    title: "Technical Assistance",
    description: "Support for portal-related issues.",
    icon: "Headphones",
  },
] as const;

export const CONTACT_FAQ_ITEMS = [
  {
    question: "How do I register?",
    answer:
      "Visit the Employee Registration page and create your account with your name, email, and mobile number. After signing in, complete the digital employment form and upload the required documents to submit your application.",
  },
  {
    question: "What documents are required?",
    answer:
      "Applicants typically need a passport-size photo, Aadhaar, PAN, bank passbook, signature, education certificates, experience certificates (if applicable), police verification, medical certificate, and driving license where relevant. The portal lists all required uploads during document submission.",
  },
  {
    question: "How can I track my application?",
    answer:
      "Sign in to the Employee Portal using your registered credentials. Your application dashboard displays real-time status updates across registration, document verification, L1 review, employee number assignment, L2 approval, and ID card generation.",
  },
  {
    question: "When will I receive my Employee Number?",
    answer:
      "Your Employee Number is generated automatically after L1 approval. Once assigned, it appears in your application status timeline and is visible on your employee dashboard.",
  },
  {
    question: "How is my Employee ID Card generated?",
    answer:
      "After L2 approval, your application is forwarded to the Support team. The Support team verifies completion of all onboarding steps and generates your official employee ID card with QR verification for download from the portal.",
  },
  {
    question: "How can I contact HR?",
    answer:
      "You can reach our HR and recruitment team by phone at +91 9818662052 or 011-42760103, by email at recruitment@rakshaksecuritas.com or admin@rakshaksecuritas.com, or by submitting the contact form on this page.",
  },
] as const;

export const CONTACT_STICKY_SECTIONS = [
  { id: "contact-info", label: "Contact Info" },
  { id: "contact-map", label: "Location" },
  { id: "contact-form", label: "Send Message" },
  { id: "help-desk", label: "Help Desk" },
  { id: "recruitment", label: "Recruitment" },
  { id: "contact-faq", label: "FAQ" },
] as const;

export function getMapUrls(query: string) {
  const encoded = encodeURIComponent(query);
  return {
    embed: `https://www.google.com/maps?q=${encoded}&output=embed`,
    directions: `https://www.google.com/maps/dir/?api=1&destination=${encoded}`,
    open: `https://www.google.com/maps/search/?api=1&query=${encoded}`,
  };
}
