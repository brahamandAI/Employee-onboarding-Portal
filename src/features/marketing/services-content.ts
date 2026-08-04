export interface ServiceDetail {
  id: string;
  title: string;
  description: string;
  responsibilities: string[];
  benefits: string[];
  industries?: string[];
  image: string;
  imageAlt: string;
}

export const SERVICES_PAGE = {
  title: "Our Services",
  subtitle:
    "Professional Security, Facility Management, Manpower, and Business Support Solutions.",
  description:
    "Rakshak Securitas Pvt Ltd provides comprehensive security and facility management services to industries, corporate organizations, commercial establishments, residential communities, healthcare institutions, educational organizations, and government sectors. Our trained workforce and structured operational approach enable us to deliver reliable, professional, and technology-driven services across multiple industries.",
} as const;

export const SERVICE_DETAILS: ServiceDetail[] = [
  {
    id: "security-services",
    title: "Security Services",
    description:
      "Rakshak Securitas provides trained security professionals for commercial, industrial, residential, institutional, and government organizations. Security personnel are deployed following structured recruitment, verification, training, and operational procedures to help clients maintain a safe and secure environment.",
    responsibilities: [
      "Access Control",
      "Visitor Management",
      "Patrolling",
      "Asset Protection",
      "Emergency Response",
      "Incident Reporting",
    ],
    industries: [
      "Corporate Offices",
      "Hospitals",
      "Residential Communities",
      "Educational Institutions",
      "Warehouses",
      "Commercial Buildings",
    ],
    benefits: [
      "Professionally trained security personnel",
      "Structured access and visitor control",
      "Continuous patrolling and site monitoring",
      "Documented incident reporting procedures",
    ],
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Professional security personnel on duty",
  },
  {
    id: "industrial-security",
    title: "Industrial Security",
    description:
      "Industrial security services are designed to protect manufacturing facilities, factories, warehouses, production units, equipment, inventory, and employees through continuous monitoring, access management, and preventive security practices.",
    responsibilities: [
      "Plant Security",
      "Factory Security",
      "Warehouse Security",
      "Material Movement Monitoring",
      "Entry Exit Management",
      "Emergency Handling",
    ],
    benefits: [
      "Protection for plant and production assets",
      "Controlled material movement oversight",
      "Managed entry and exit at facilities",
      "Coordinated emergency response support",
    ],
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Industrial facility security operations",
  },
  {
    id: "corporate-security",
    title: "Corporate Security",
    description:
      "Professional security solutions for IT companies, business parks, offices, commercial complexes, and corporate campuses.",
    responsibilities: [
      "Reception Security",
      "Visitor Verification",
      "Employee Access Control",
      "Parking Management",
      "Office Patrol",
      "Emergency Coordination",
    ],
    benefits: [
      "Professional reception and front-desk security",
      "Verified visitor and employee access",
      "Organized parking and traffic flow",
      "Regular office patrol coverage",
    ],
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Corporate office building security",
  },
  {
    id: "residential-security",
    title: "Residential Security",
    description:
      "Security services for apartments, gated communities, villas, and residential societies.",
    responsibilities: [
      "Gate Security",
      "Visitor Entry",
      "Vehicle Monitoring",
      "Night Patrol",
      "Resident Assistance",
      "Emergency Response",
    ],
    benefits: [
      "Controlled gate and entry management",
      "Registered visitor verification",
      "Vehicle monitoring at access points",
      "Night patrol and resident assistance",
    ],
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Residential community security",
  },
  {
    id: "hospital-security",
    title: "Hospital Security",
    description:
      "Healthcare security services supporting hospitals, clinics, and medical institutions.",
    responsibilities: [
      "Patient Safety",
      "Visitor Management",
      "Emergency Support",
      "Restricted Area Monitoring",
      "Parking Control",
      "Crowd Management",
    ],
    benefits: [
      "Support for patient and staff safety",
      "Managed visitor flow in healthcare settings",
      "Monitoring of restricted clinical areas",
      "Parking and crowd coordination",
    ],
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6bf0d?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Hospital and healthcare security",
  },
  {
    id: "event-security",
    title: "Event Security",
    description:
      "Professional event security for conferences, exhibitions, cultural programs, corporate events, and public gatherings.",
    responsibilities: [
      "Crowd Control",
      "VIP Security",
      "Access Control",
      "Emergency Coordination",
      "Entry Verification",
      "Venue Monitoring",
    ],
    benefits: [
      "Organized crowd control at venues",
      "VIP and restricted access protection",
      "Entry verification for attendees",
      "On-site emergency coordination",
    ],
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Event security and crowd management",
  },
  {
    id: "atm-security",
    title: "ATM Security",
    description:
      "Dedicated ATM security personnel responsible for maintaining customer safety and monitoring ATM locations.",
    responsibilities: [
      "ATM Monitoring",
      "Customer Assistance",
      "Incident Reporting",
      "Asset Protection",
      "Emergency Response",
    ],
    benefits: [
      "Continuous ATM location monitoring",
      "Customer safety and on-site assistance",
      "Prompt incident reporting procedures",
      "Asset protection at banking touchpoints",
    ],
    image:
      "https://images.unsplash.com/photo-1563013547-7ae1e01a9e2f?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "ATM security monitoring",
  },
  {
    id: "facility-management",
    title: "Facility Management",
    description:
      "Integrated facility management solutions supporting day-to-day operations of commercial, industrial, healthcare, educational, and residential facilities.",
    responsibilities: [
      "Building Maintenance",
      "Operations Support",
      "Technical Services",
      "Utility Management",
      "Vendor Coordination",
      "Facility Supervision",
    ],
    benefits: [
      "Coordinated building maintenance support",
      "Day-to-day operations assistance",
      "Technical and utility service oversight",
      "Vendor and facility supervision",
    ],
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Facility management operations",
  },
  {
    id: "housekeeping",
    title: "Housekeeping Services",
    description:
      "Professional housekeeping services for offices, hospitals, educational institutions, hotels, residential communities, and commercial establishments.",
    responsibilities: [
      "Cleaning",
      "Sanitation",
      "Waste Management",
      "Office Maintenance",
      "Floor Care",
      "Daily Housekeeping",
    ],
    benefits: [
      "Professional cleaning and sanitation",
      "Scheduled waste management support",
      "Office and floor care maintenance",
      "Consistent daily housekeeping standards",
    ],
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Professional housekeeping services",
  },
  {
    id: "manpower-services",
    title: "Manpower Services",
    description:
      "Professional manpower solutions providing trained and verified personnel for multiple industries.",
    responsibilities: [
      "Recruitment",
      "Employee Verification",
      "Training",
      "Deployment",
      "Workforce Management",
      "Replacement Support",
    ],
    benefits: [
      "Structured recruitment processes",
      "Employee verification before deployment",
      "Training and workforce coordination",
      "Replacement and deployment support",
    ],
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Professional workforce and manpower services",
  },
];

export const INDUSTRIES_WE_SERVE = [
  { title: "Manufacturing", icon: "Factory" },
  { title: "Corporate Offices", icon: "Building2" },
  { title: "IT Parks", icon: "Laptop" },
  { title: "Hospitals", icon: "Hospital" },
  { title: "Educational Institutions", icon: "GraduationCap" },
  { title: "Banks", icon: "Landmark" },
  { title: "Hotels", icon: "Hotel" },
  { title: "Retail", icon: "ShoppingBag" },
  { title: "Warehouses", icon: "Package" },
  { title: "Residential Communities", icon: "Home" },
  { title: "Government Organizations", icon: "Landmark" },
  { title: "Commercial Buildings", icon: "Building" },
] as const;

export const SERVICES_WHY_CHOOSE = [
  {
    title: "Professionally Trained Workforce",
    description:
      "Personnel are recruited, verified, and prepared through structured processes before client deployment.",
    icon: "Users",
  },
  {
    title: "Verified Employees",
    description:
      "Document verification and multi-level approval ensure only qualified candidates are onboarded.",
    icon: "ShieldCheck",
  },
  {
    title: "Transparent Recruitment",
    description:
      "Digital onboarding provides clear visibility into application status and approval stages.",
    icon: "Eye",
  },
  {
    title: "Technology Driven Operations",
    description:
      "Modern systems support workforce management, approvals, and operational coordination.",
    icon: "Cpu",
  },
  {
    title: "Employee Onboarding Management System",
    description:
      "EOMS streamlines registration, verification, ID generation, and deployment readiness.",
    icon: "Laptop",
  },
  {
    title: "Compliance Focused",
    description:
      "Statutory documentation and verification procedures support lawful and organized operations.",
    icon: "ClipboardCheck",
  },
  {
    title: "Customer Satisfaction",
    description:
      "Dependable service delivery, responsive support, and continuous operational improvement.",
    icon: "ThumbsUp",
  },
  {
    title: "PAN India Operations",
    description:
      "Security and facility management services delivered across multiple locations in India.",
    icon: "MapPin",
  },
] as const;

export const EMPLOYEE_ONBOARDING_WORKFLOW = [
  "Employee Registration",
  "Employment Form",
  "Document Upload",
  "L1 Approval",
  "Employee Number",
  "L2 Approval",
  "Support Team",
  "ID Card Generation",
  "Deployment",
] as const;

export const EMPLOYEE_ONBOARDING_SECTION = {
  title: "Our People Are Our Strength",
  description:
    "Every employee deployed by Rakshak Securitas completes a structured digital onboarding process through the Employee Onboarding Management System (EOMS). The process includes online registration, employment form submission, document verification, multi-level approval, employee number generation, and digital ID card issuance before deployment.",
} as const;
