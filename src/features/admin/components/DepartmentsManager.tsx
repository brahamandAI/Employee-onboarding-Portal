"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import {
  createDepartmentAction,
  updateDepartmentAction,
} from "@/features/admin/actions/admin.actions";
import { Plus, Pencil } from "lucide-react";

export interface DepartmentRow {
  _id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
}

interface DepartmentsManagerProps {
  departments: DepartmentRow[];
}

export function DepartmentsManager({ departments }: DepartmentsManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  function resetForm() {
    setName("");
    setCode("");
    setDescription("");
    setEditingId(null);
    setShowForm(false);
  }

  function startEdit(dept: DepartmentRow) {
    setEditingId(dept._id);
    setName(dept.name);
    setCode(dept.code);
    setDescription(dept.description ?? "");
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const payload = { name, code, description: description || undefined };
      const result = editingId
        ? await updateDepartmentAction(editingId, payload)
        : await createDepartmentAction(payload);

      if (result.success) {
        toast({
          title: editingId ? "Updated" : "Created",
          description: `Department ${editingId ? "updated" : "created"} successfully.`,
          variant: "success",
        });
        resetForm();
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    });
  }

  function toggleActive(dept: DepartmentRow) {
    startTransition(async () => {
      const result = await updateDepartmentAction(dept._id, { isActive: !dept.isActive });
      if (result.success) {
        toast({ title: "Updated", description: "Department status changed.", variant: "success" });
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button type="button" size="sm" onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="mr-1 h-4 w-4" /> Add Department
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Code</Label>
              <Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} required disabled={!!editingId} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </div>
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
              <th className="px-4 py-3 text-left font-medium text-[#64748B]">Description</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B]">Status</th>
              <th className="px-4 py-3 text-right font-medium text-[#64748B]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-[#64748B]">No departments yet.</td></tr>
            ) : departments.map((dept) => (
              <tr key={dept._id} className="border-b border-[#E2E8F0] last:border-0">
                <td className="px-4 py-3 font-mono text-xs">{dept.code}</td>
                <td className="px-4 py-3">{dept.name}</td>
                <td className="px-4 py-3 text-[#64748B]">{dept.description ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${dept.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                    {dept.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button type="button" onClick={() => startEdit(dept)} className="mr-2 text-primary hover:underline">
                    <Pencil className="inline h-3.5 w-3.5" />
                  </button>
                  <button type="button" onClick={() => toggleActive(dept)} className="text-xs text-[#64748B] hover:text-primary">
                    {dept.isActive ? "Deactivate" : "Activate"}
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
