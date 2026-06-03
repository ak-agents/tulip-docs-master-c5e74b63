import { forwardRef } from "react";
import { TulipLetterhead, TulipFooter, SignatureBlock } from "./TulipHeader";
import type { Template } from "@/lib/templates";
import { replacePlaceholders } from "@/lib/templates";
import type { RxRow } from "./PrescriptionBuilder";

export interface PatientData {
  prefix: string;
  fullName: string;
  age: string;
  gender: string;
  address: string;
  regNo: string;
  apptNo: string;
  date: string;
  consultant: string;
  department: string;
}

interface Props {
  template: Template;
  patient: PatientData;
  values: Record<string, string>;
  rx: RxRow[];
}

function Placeholder({ text }: { text: string }) {
  // render greyed underscores for unfilled placeholders
  const parts = text.split(/(__\w+__)/g);
  return <>{parts.map((p, i) => /^__\w+__$/.test(p)
    ? <span key={i} className="text-gray-400 italic">[{p.replace(/__/g, "").replace(/_/g, " ")}]</span>
    : <span key={i}>{p}</span>)}</>;
}

function renderBodyLines(body: string, values: Record<string, string>) {
  const replaced = replacePlaceholders(body, values);
  return replaced.split("\n").map((line, i) => (
    <div key={i}><Placeholder text={line || "\u00A0"} /></div>
  ));
}

export const DocumentPreview = forwardRef<HTMLDivElement, Props>(({ template, patient, values, rx }, ref) => {
  return (
    <div ref={ref} className="doc-page">
      <TulipLetterhead />

      <h1 className="text-center text-xl font-bold uppercase tracking-wide my-3 underline decoration-2 underline-offset-4">
        {template.name.split("—")[0].trim()}
      </h1>

      <div className="border border-gray-300 rounded p-3 mb-4 grid grid-cols-2 gap-x-6 gap-y-1 text-[10.5pt]">
        <div><b>Reg No:</b> {patient.regNo || "—"}</div>
        <div><b>Appt No:</b> {patient.apptNo || "—"}</div>
        <div className="col-span-2"><b>Patient:</b> {patient.prefix} {patient.fullName || "—"} ({patient.age || "—"}Y / {patient.gender || "—"})</div>
        <div className="col-span-2"><b>Address:</b> {patient.address || "—"}</div>
        <div><b>Date:</b> {patient.date || "—"}</div>
        <div><b>Department:</b> {patient.department || "Cardiology"}</div>
        <div className="col-span-2"><b>Consultant:</b> {patient.consultant || "Dr. Himanshu Meghnathi"}</div>
      </div>

      {template.sections.map((s, idx) => (
        <div key={idx} className="mb-3">
          {s.title && <h2 className="text-[var(--teal)] font-bold text-[12pt] mb-1 border-b border-[var(--accent)]">{s.title}</h2>}
          {s.body && <div className="text-[10.5pt] whitespace-pre-wrap">{renderBodyLines(s.body, values)}</div>}
          {s.rows && (
            <div className="grid grid-cols-2 gap-x-6 text-[10.5pt]">
              {s.rows.map((r) => (
                <div key={r.valueKey}>
                  <b>{r.label}:</b>{" "}
                  <span>
                    {values[r.valueKey]?.trim()
                      ? <>{values[r.valueKey]}{r.unit ? ` ${r.unit}` : ""}</>
                      : <span className="text-gray-400 italic">[—]</span>}
                  </span>
                </div>
              ))}
            </div>
          )}
          {s.prescription && (
            <table className="w-full text-[10pt] border-collapse mt-1">
              <thead>
                <tr className="bg-[var(--accent)]">
                  <th className="border p-1 text-left w-8">#</th>
                  <th className="border p-1 text-left">Medicine</th>
                  <th className="border p-1 text-left w-24">Dose</th>
                  <th className="border p-1 text-left w-28">M-A-N</th>
                  <th className="border p-1 text-left w-28">Duration</th>
                  <th className="border p-1 text-left">Instructions</th>
                </tr>
              </thead>
              <tbody>
                {rx.length === 0 && <tr><td colSpan={6} className="border p-2 text-center text-gray-400 italic">No medicines</td></tr>}
                {rx.map((r, i) => (
                  <tr key={r.id}>
                    <td className="border p-1">{i + 1}</td>
                    <td className="border p-1">{r.form} {r.name}</td>
                    <td className="border p-1">{r.dose}</td>
                    <td className="border p-1">{r.frequency}</td>
                    <td className="border p-1">{r.duration}</td>
                    <td className="border p-1">{r.instructions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}

      <SignatureBlock consultant={patient.consultant} />
      <TulipFooter />
    </div>
  );
});
DocumentPreview.displayName = "DocumentPreview";
