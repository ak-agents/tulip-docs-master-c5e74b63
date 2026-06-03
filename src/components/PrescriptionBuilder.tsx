import { useEffect, useRef, useState } from "react";
import { addMedicine, searchMedicines, type Medicine } from "@/lib/medicines";

export interface RxRow {
  id: string;
  form: string;
  name: string;
  dose: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export function newRow(): RxRow {
  return { id: `r_${Math.random().toString(36).slice(2)}`, form: "Tab.", name: "", dose: "", frequency: "", duration: "", instructions: "" };
}

interface Props {
  rows: RxRow[];
  onChange: (rows: RxRow[]) => void;
}

export function PrescriptionBuilder({ rows, onChange }: Props) {
  const update = (id: string, patch: Partial<RxRow>) => {
    onChange(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };
  const remove = (id: string) => onChange(rows.filter((r) => r.id !== id));
  const add = () => onChange([...rows, newRow()]);

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-[var(--accent)] text-left">
          <tr>
            <th className="p-2 w-8">#</th>
            <th className="p-2 w-20">Form</th>
            <th className="p-2">Medicine</th>
            <th className="p-2 w-24">Dose</th>
            <th className="p-2 w-28">M-A-N</th>
            <th className="p-2 w-28">Duration</th>
            <th className="p-2">Instructions</th>
            <th className="p-2 w-10"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id} className="border-t">
              <td className="p-2 text-gray-500">{i + 1}</td>
              <td className="p-2">
                <select className="w-full bg-transparent" value={r.form} onChange={(e) => update(r.id, { form: e.target.value })}>
                  {["Tab.", "Cap.", "Inj.", "Syp.", "Drop"].map((f) => <option key={f}>{f}</option>)}
                </select>
              </td>
              <td className="p-2">
                <MedicineAutocomplete
                  value={r.name}
                  onPick={(m) => update(r.id, {
                    name: m.name,
                    form: `${m.form}.`,
                    dose: m.defaultDose ?? r.dose,
                    frequency: m.defaultFrequency ?? r.frequency,
                    instructions: m.notes ?? r.instructions,
                  })}
                  onChange={(v) => update(r.id, { name: v })}
                />
              </td>
              <td className="p-2"><input className="w-full bg-transparent" value={r.dose} onChange={(e) => update(r.id, { dose: e.target.value })} placeholder="75mg" /></td>
              <td className="p-2"><input className="w-full bg-transparent" value={r.frequency} onChange={(e) => update(r.id, { frequency: e.target.value })} placeholder="1-0-1" /></td>
              <td className="p-2"><input className="w-full bg-transparent" value={r.duration} onChange={(e) => update(r.id, { duration: e.target.value })} placeholder="1 month" /></td>
              <td className="p-2"><input className="w-full bg-transparent" value={r.instructions} onChange={(e) => update(r.id, { instructions: e.target.value })} placeholder="" /></td>
              <td className="p-2">
                <button onClick={() => remove(r.id)} className="text-[var(--coral)] hover:underline text-xs">×</button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan={8} className="p-4 text-center text-gray-500">No medicines added</td></tr>
          )}
        </tbody>
      </table>
      <div className="p-2 border-t bg-gray-50">
        <button onClick={add} className="px-3 py-1.5 bg-[var(--teal)] text-white rounded text-sm hover:opacity-90">+ Add medicine</button>
      </div>
    </div>
  );
}

function MedicineAutocomplete({ value, onChange, onPick }: { value: string; onChange: (v: string) => void; onPick: (m: Medicine) => void }) {
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<Medicine[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const r = searchMedicines(value);
    setResults(r);
    setShowAdd(value.trim().length > 1 && r.length === 0);
  }, [value]);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} className="relative">
      <input
        className="w-full bg-transparent"
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder="Type to search..."
      />
      {open && (results.length > 0 || showAdd) && (
        <div className="absolute z-20 left-0 right-0 mt-1 bg-white border rounded-md shadow-lg max-h-72 overflow-auto">
          {results.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => { onPick(m); setOpen(false); }}
              className="w-full text-left px-3 py-2 hover:bg-[var(--accent)] flex justify-between items-center"
            >
              <div>
                <div className="font-medium">{m.form}. {m.name} {m.defaultDose}</div>
                <div className="text-xs text-gray-500">{m.generic} · {m.defaultFrequency}</div>
              </div>
              <span className="text-[10px] bg-[var(--teal)] text-white px-1.5 py-0.5 rounded">Hospital</span>
            </button>
          ))}
          {showAdd && <QuickAdd name={value} onAdded={(m) => { onPick(m); setOpen(false); }} />}
        </div>
      )}
    </div>
  );
}

function QuickAdd({ name, onAdded }: { name: string; onAdded: (m: Medicine) => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Medicine["form"]>("Tab");
  const [generic, setGeneric] = useState("");
  const [dose, setDose] = useState("");
  const [freq, setFreq] = useState("");
  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="w-full px-3 py-2 text-left text-sm text-[var(--teal)] hover:bg-[var(--accent)] border-t">
        + Add "<b>{name}</b>" to hospital library
      </button>
    );
  }
  return (
    <div className="p-3 border-t bg-gray-50 space-y-2">
      <div className="text-xs font-semibold">Add new medicine: {name}</div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <select className="border rounded px-2 py-1" value={form} onChange={(e) => setForm(e.target.value as Medicine["form"])}>
          {["Tab", "Cap", "Inj", "Syp", "Drop"].map((f) => <option key={f}>{f}</option>)}
        </select>
        <input className="border rounded px-2 py-1" placeholder="Generic" value={generic} onChange={(e) => setGeneric(e.target.value)} />
        <input className="border rounded px-2 py-1" placeholder="Dose (75mg)" value={dose} onChange={(e) => setDose(e.target.value)} />
        <input className="border rounded px-2 py-1" placeholder="Freq (1-0-1)" value={freq} onChange={(e) => setFreq(e.target.value)} />
      </div>
      <button
        type="button"
        className="px-3 py-1.5 bg-[var(--teal)] text-white rounded text-sm"
        onClick={() => {
          const m = addMedicine({ name, generic, form, defaultDose: dose, defaultFrequency: freq, department: "Cardiology" });
          onAdded(m);
        }}
      >Save & use</button>
    </div>
  );
}
