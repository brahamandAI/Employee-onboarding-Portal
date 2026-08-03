"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import {
  createSiteLocationAction,
  updateSiteLocationAction,
} from "@/features/admin/actions/admin.actions";
import { Plus, Pencil } from "lucide-react";

export interface SiteLocationRow {
  _id: string;
  name: string;
  code: string;
  address?: string;
  city: string;
  state: string;
  pincode?: string;
  contactPerson?: string;
  contactPhone?: string;
  isActive: boolean;
}

interface SiteLocationsManagerProps {
  sites: SiteLocationRow[];
}

export function SiteLocationsManager({ sites }: SiteLocationsManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", code: "", address: "", city: "", state: "",
    pincode: "", contactPerson: "", contactPhone: "",
  });
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  function resetForm() {
    setForm({ name: "", code: "", address: "", city: "", state: "", pincode: "", contactPerson: "", contactPhone: "" });
    setEditingId(null);
    setShowForm(false);
  }

  function startEdit(site: SiteLocationRow) {
    setEditingId(site._id);
    setForm({
      name: site.name, code: site.code, address: site.address ?? "",
      city: site.city, state: site.state, pincode: site.pincode ?? "",
      contactPerson: site.contactPerson ?? "", contactPhone: site.contactPhone ?? "",
    });
    setShowForm(true);
  }

  function update(field: keyof typeof form, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const payload = {
        ...form,
        address: form.address || undefined,
        pincode: form.pincode || undefined,
        contactPerson: form.contactPerson || undefined,
        contactPhone: form.contactPhone || undefined,
      };
      const result = editingId
        ? await updateSiteLocationAction(editingId, payload)
        : await createSiteLocationAction(payload);

      if (result.success) {
        toast({ title: editingId ? "Updated" : "Created", description: "Site location saved.", variant: "success" });
        resetForm();
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    });
  }

  function toggleActive(site: SiteLocationRow) {
    startTransition(async () => {
      const result = await updateSiteLocationAction(site._id, { isActive: !site.isActive });
      if (result.success) {
        toast({ title: "Updated", description: "Site status changed.", variant: "success" });
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button type="button" size="sm" onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="mr-1 h-4 w-4" /> Add Site
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={(e) => update("name", e.target.value)} required /></div>
            <div className="space-y-2"><Label>Code</Label><Input value={form.code} onChange={(e) => update("code", e.target.value.toUpperCase())} required disabled={!!editingId} /></div>
            <div className="space-y-2"><Label>City</Label><Input value={form.city} onChange={(e) => update("city", e.target.value)} required /></div>
            <div className="space-y-2"><Label>State</Label><Input value={form.state} onChange={(e) => update("state", e.target.value)} required /></div>
            <div className="space-y-2"><Label>Pincode</Label><Input value={form.pincode} onChange={(e) => update("pincode", e.target.value)} /></div>
            <div className="space-y-2"><Label>Contact Person</Label><Input value={form.contactPerson} onChange={(e) => update("contactPerson", e.target.value)} /></div>
            <div className="space-y-2"><Label>Contact Phone</Label><Input value={form.contactPhone} onChange={(e) => update("contactPhone", e.target.value)} /></div>
          </div>
          <div className="space-y-2"><Label>Address</Label><Textarea value={form.address} onChange={(e) => update("address", e.target.value)} rows={2} /></div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : editingId ? "Update" : "Create"}</Button>
            <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <th className="px-4 py-3 text-left font-medium text-[#64748B]">Code</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B]">Name</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B]">Location</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B]">Contact</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B]">Status</th>
              <th className="px-4 py-3 text-right font-medium text-[#64748B]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sites.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-[#64748B]">No site locations yet.</td></tr>
            ) : sites.map((site) => (
              <tr key={site._id} className="border-b border-[#E2E8F0] last:border-0">
                <td className="px-4 py-3 font-mono text-xs">{site.code}</td>
                <td className="px-4 py-3">{site.name}</td>
                <td className="px-4 py-3 text-[#64748B]">{site.city}, {site.state}</td>
                <td className="px-4 py-3 text-[#64748B]">{site.contactPerson ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${site.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                    {site.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button type="button" onClick={() => startEdit(site)} className="mr-2 text-primary hover:underline">
                    <Pencil className="inline h-3.5 w-3.5" />
                  </button>
                  <button type="button" onClick={() => toggleActive(site)} className="text-xs text-[#64748B] hover:text-primary">
                    {site.isActive ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
