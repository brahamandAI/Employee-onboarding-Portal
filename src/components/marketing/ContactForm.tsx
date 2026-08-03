"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { submitContactFormAction } from "@/features/marketing/actions/contact.actions";
import { CONTACT_SUBJECTS } from "@/features/marketing/contact-content";

const contactSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z
    .string()
    .min(10, "Enter a valid mobile number")
    .regex(/^[0-9+\s-]{10,15}$/, "Enter a valid mobile number"),
  company: z.string().optional(),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const subjectOptions = CONTACT_SUBJECTS.map((item) => ({
  value: item.value,
  label: item.label,
}));

export function ContactForm() {
  const { toast } = useToast();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(data: ContactFormData) {
    const result = await submitContactFormAction(data);
    if (result.success) {
      toast({
        title: "Message sent",
        description: result.message,
        variant: "success",
      });
      reset();
    } else {
      toast({
        title: "Unable to send message",
        description: result.error,
        variant: "destructive",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            autoComplete="name"
            {...register("name")}
            error={errors.name?.message}
          />
        </div>
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
            error={errors.email?.message}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone">Mobile Number</Label>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            {...register("phone")}
            error={errors.phone?.message}
          />
        </div>
        <div>
          <Label htmlFor="company">Company Name (Optional)</Label>
          <Input id="company" autoComplete="organization" {...register("company")} />
        </div>
      </div>

      <div>
        <Label htmlFor="subject">Subject</Label>
        <Controller
          name="subject"
          control={control}
          render={({ field }) => (
            <Select
              id="subject"
              placeholder="Select a subject"
              options={subjectOptions}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.subject?.message}
            />
          )}
        />
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          rows={5}
          {...register("message")}
          error={errors.message?.message}
        />
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <Button type="submit" variant="accent" size="lg" isLoading={isSubmitting}>
          Send Message
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          disabled={isSubmitting}
          onClick={() => reset()}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
