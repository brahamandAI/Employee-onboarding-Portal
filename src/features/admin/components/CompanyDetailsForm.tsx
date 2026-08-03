"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { updateCompanyDetailsAction } from "@/features/admin/actions/admin.actions";
import type { CompanyDetails } from "@/lib/services/admin.service";

interface CompanyDetailsFormProps {
  initial: CompanyDetails;
}

export function CompanyDetailsForm({ initial }: CompanyDetailsFormProps) {
  const [form, setForm] = useState(initial);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  function update(field: keyof CompanyDetails, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await updateCompanyDetailsAction(form);
      if (result.success) {
        toast({ title: "Saved", description: "Company details updated.", variant: "success" });
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    });
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="text-base">Company Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input id="tagline" value={form.tagline} onChange={(e) => update("tagline", e.target.value)} required />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input id="website" type="url" value={form.website} onChange={(e) => update("website", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" value={form.address} onChange={(e) => update("address", e.target.value)} rows={3} required />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="gstin">GSTIN</Label>
              <Input id="gstin" value={form.gstin ?? ""} onChange={(e) => update("gstin", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pan">PAN</Label>
              <Input id="pan" value={form.pan ?? ""} onChange={(e) => update("pan", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="founded">Founded</Label>
              <Input id="founded" value={form.founded ?? ""} onChange={(e) => update("founded", e.target.value)} />
            </div>
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Company Details"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
