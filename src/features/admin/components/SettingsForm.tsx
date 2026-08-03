"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { updateAppSettingsAction } from "@/features/admin/actions/admin.actions";
import type { AppSettings } from "@/lib/services/admin.service";

interface SettingsFormProps {
  initial: AppSettings;
}

export function SettingsForm({ initial }: SettingsFormProps) {
  const [form, setForm] = useState(initial);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await updateAppSettingsAction(form);
      if (result.success) {
        toast({ title: "Saved", description: "Application settings updated.", variant: "success" });
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    });
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="text-base">Application Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Checkbox
            id="maintenanceMode"
            label="Maintenance mode (disable employee portal)"
            checked={form.maintenanceMode}
            onChange={(e) => setForm((p) => ({ ...p, maintenanceMode: e.target.checked }))}
          />
          <Checkbox
            id="allowRegistration"
            label="Allow new employee registrations"
            checked={form.allowEmployeeRegistration}
            onChange={(e) => setForm((p) => ({ ...p, allowEmployeeRegistration: e.target.checked }))}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="otpExpiry">OTP Expiry (minutes)</Label>
              <Input
                id="otpExpiry"
                type="number"
                min={1}
                max={60}
                value={form.otpExpiryMinutes}
                onChange={(e) => setForm((p) => ({ ...p, otpExpiryMinutes: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxAttempts">Max Login Attempts</Label>
              <Input
                id="maxAttempts"
                type="number"
                min={1}
                max={20}
                value={form.maxLoginAttempts}
                onChange={(e) => setForm((p) => ({ ...p, maxLoginAttempts: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                min={1}
                max={24}
                value={form.sessionTimeoutHours}
                onChange={(e) => setForm((p) => ({ ...p, sessionTimeoutHours: Number(e.target.value) }))}
              />
            </div>
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
