"use server";

import { z } from "zod";
import { CONTACT_SUBJECTS } from "@/features/marketing/contact-content";

const subjectValues: string[] = CONTACT_SUBJECTS.map((item) => item.value);

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z
    .string()
    .min(10)
    .regex(/^[0-9+\s-]{10,15}$/),
  company: z.string().optional(),
  subject: z.string().refine((value) => subjectValues.includes(value), {
    message: "Invalid subject",
  }),
  message: z.string().min(20),
});

export async function submitContactFormAction(
  data: z.infer<typeof contactSchema>
): Promise<{ success: true; message: string } | { success: false; error: string }> {
  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Please check your form inputs." };
  }

  console.info("[Contact Form]", parsed.data);

  return {
    success: true,
    message:
      "Thank you for contacting Rakshak Securitas. Our HR team will respond during office hours.",
  };
}
