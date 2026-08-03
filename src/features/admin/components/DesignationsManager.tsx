"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import {
  createDesignationAction,
  updateDesignationAction,
} from "@/features/admin/actions/admin.actions";
import { Plus, Pencil } from "lucide-react";

export interface DesignationRow {
  _id: string;
  name: string;
  code: string;
  level?: number;
  isActive: boolean;
  departmentId?: { _id: string; name: string } | string | null;
}

interface DesignationsManagerProps {
  designations: DesignationRow[];
  departments: { _id: string; name: string }[];
}

function getDeptName(dept: DesignationRow["departmentId"]) {
  if (!dept) return "—";
  if (typeof dept === "object" && dept !== null && "name" in dept) return dept.name;
  return "—";
}

export function DesignationsManager({ designations, departments }: DesignationsManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [level, setLevel] = useState(1);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const deptOptions = departments.map((d) => ({ value: d._id, label: d.name }));

  function resetForm() {
    setName(""); setCode(""); setDepartmentId(""); setLevel(1);
    setEditingId(null); setShowForm(false);
  }

  function startEdit(des: DesignationRow) {
    setEditingId(des._id);
    setName(des.name);
    setCode(des.code);
    setLevel(des.level ?? 1);
    const deptId = typeof des.departmentId === "object" && des.departmentId ? des.departmentId._id : "";
    setDepartmentId(deptId);
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const payload = {
        name, code,
        departmentId: departmentId || undefined,
        level,
      };
      const result = editingId
        ? await updateDesignationAction(editingId, payload)
        : await createDesignationAction(payload);

      if (result.success) {
        toast({ title: editingId ? "Updated" : "Created", description: "Designation saved.", variant: "success" });
        resetForm();
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    });
  }

  function toggleActive(des: DesignationRow) {
    startTransition(async () => {
      const result = await updateDesignationAction(des._id, { isActive: !des.isActive });
      if (result.success) {
        toast({ title: "Updated", description: "Designation status changed.", variant: "success" });
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button type="button" size="sm" onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="mr-1 h-4 w-4" /> Add Designation
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
            <div className="space-y-2"><Label>Code</Label><Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} required disabled={!!editingId} /></div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Select options={deptOptions} placeholder="Select department" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} />
            </div>
            <div className="space-y-2"><Label>Level</Label><Input type="number" min={1} max={10} value={level} onChange={(e) => setLevel(Number(e.target.value))} /></div>
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
              <th className="px-4 py-3 text-left font-medium text-[#64748B]">Department</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B]">Level</th>
              <th className="px-4 py-3 text-left font-medium text-[#64748B]">Status</th>
              <th className="px-4 py-3 text-right font-medium text-[#64748B]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {designations.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-[#64748B]">No designations yet.</td></tr>
            ) : designations.map((des) => (
              <tr key={des._id} className="border-b border-[#E2E8F0] last:border-0">
                <td className="px-4 py-3 font-mono text-xs">{des.code}</td>
                <td className="px-4 py-3">{des.name}</td>
                <td className="px-4 py-3 text-[#64748B]">{getDeptName(des.departmentId)}</td>
                <td className="px-4 py-3">{des.level ?? 1}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${des.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                    {des.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button type="button" onClick={() => startEdit(des)} className="mr-2 text-primary hover:underline">
                    <Pencil className="inline h-3.5 w-3.5" />
                  </button>
                  <button type="button" onClick={() => toggleActive(des)} className="text-xs text-[#64748B] hover:text-primary">
                    {des.isActive ? "Deactivate" : "Activate"}
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
