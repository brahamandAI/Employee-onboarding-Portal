import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FieldChange {
  path: string;
  label: string;
  oldValue: string;
  newValue: string;
}

export function FieldChangesPanel({ changes }: { changes?: FieldChange[] | null }) {
  if (!changes || changes.length === 0) return null;

  return (
    <Card className="border-amber-200 bg-amber-50/60">
      <CardHeader>
        <CardTitle className="text-base text-amber-900">
          Updated Fields ({changes.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-3 text-sm text-amber-800">
          These fields were changed after the previous submission. Please review carefully.
        </p>
        <div className="overflow-x-auto rounded-lg border border-amber-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-amber-50 text-xs uppercase tracking-wide text-amber-800">
              <tr>
                <th className="px-3 py-2 font-semibold">Field</th>
                <th className="px-3 py-2 font-semibold">Previous</th>
                <th className="px-3 py-2 font-semibold">Updated</th>
              </tr>
            </thead>
            <tbody>
              {changes.map((change) => (
                <tr key={change.path} className="border-t border-amber-100">
                  <td className="px-3 py-2 font-medium text-[#0F172A]">{change.label}</td>
                  <td className="px-3 py-2 text-[#64748B]">{change.oldValue}</td>
                  <td className="px-3 py-2 font-medium text-[#166534]">{change.newValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
