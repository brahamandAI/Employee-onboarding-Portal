export interface FieldChangeItem {
  path: string;
  label: string;
  oldValue: string;
  newValue: string;
}

export function formatFieldLabel(path: string): string {
  const last = path.split(".").filter((part) => !/^\d+$/.test(part)).pop() ?? path;
  return last
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (c) => c.toUpperCase());
}

export function computeFieldChanges(
  previous: Record<string, unknown> | null | undefined,
  current: Record<string, unknown>
): FieldChangeItem[] {
  const prevFlat = flatten(previous ?? {}, "");
  const nextFlat = flatten(current, "");
  const keys = new Set([...Object.keys(prevFlat), ...Object.keys(nextFlat)]);
  const changes: FieldChangeItem[] = [];

  for (const key of keys) {
    const oldValue = normalize(prevFlat[key]);
    const newValue = normalize(nextFlat[key]);
    if (oldValue === newValue) continue;
    if (!oldValue && !newValue) continue;
    changes.push({
      path: key,
      label: formatFieldLabel(key),
      oldValue: oldValue || "—",
      newValue: newValue || "—",
    });
  }

  return changes;
}

function flatten(
  value: unknown,
  prefix: string,
  out: Record<string, unknown> = {}
): Record<string, unknown> {
  if (value === null || value === undefined) {
    if (prefix) out[prefix] = "";
    return out;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      out[prefix || "list"] = "";
      return out;
    }
    value.forEach((item, index) => {
      flatten(item, prefix ? `${prefix}.${index}` : String(index), out);
    });
    return out;
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0 && prefix) {
      out[prefix] = "";
      return out;
    }
    for (const [key, child] of entries) {
      flatten(child, prefix ? `${prefix}.${key}` : key, out);
    }
    return out;
  }

  out[prefix || "value"] = value;
  return out;
}

function normalize(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return String(value);
  return String(value).trim();
}
