import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/lib/auth";
import { getTemplate } from "@/lib/templates";
import { DocumentPreview, type PatientData } from "@/components/DocumentPreview";
import { PrescriptionBuilder, newRow, type RxRow } from "@/components/PrescriptionBuilder";
import logo from "@/assets/tulip-logo.png";

export const Route = createFileRoute("/generate/$templateId")({
  ssr: false,
  component: Generate,
});

const PATIENT_KEY = "tulip_patient_session"; // session-only via sessionStorage

function loadPatient(): PatientData {
  try {
    const raw = sessionStorage.getItem(PATIENT_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    prefix: "Mr.",
    fullName: "",
    age: "",
    gender: "M",
    address: "",
    regNo: "",
    apptNo: "",
    date: new Date().toLocaleDateString("en-GB"),
    consultant: "Dr. Himanshu Meghnathi",
    department: "Cardiology",
  };
}

function Generate() {
  const { doctor } = useAuth();
  const nav = useNavigate();
  const { templateId } = Route.useParams();
  const template = getTemplate(templateId);

  useEffect(() => { if (!doctor) nav({ to: "/login", replace: true }); }, [doctor, nav]);

  const [patient, setPatient] = useState<PatientData>(loadPatient);
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    template?.fields.forEach((f) => { if (f.defaultValue) init[f.key] = f.defaultValue; });
    return init;
  });
  const [rx, setRx] = useState<RxRow[]>([]);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sessionStorage.setItem(PATIENT_KEY, JSON.stringify(patient));
  }, [patient]);

  // merge patient details into values so placeholders {{age}}, {{gender}} etc resolve
  const mergedValues = useMemo(() => ({
    ...values,
    patient_name: `${patient.prefix} ${patient.fullName}`.trim(),
    age: patient.age,
    gender: patient.gender === "M" ? "Male" : patient.gender === "F" ? "Female" : patient.gender,
    reg_no: patient.regNo,
    appt_no: patient.apptNo,
    date: patient.date,
    consultant: patient.consultant,
    department: patient.department,
    address: patient.address,
  }), [values, patient]);

  if (!template) return <div className="p-8">Template not found. <Link to="/dashboard" className="text-[var(--teal)] underline">Back</Link></div>;
  if (!doctor) return null;

  const updateField = (k: string, v: string) => setValues((p) => ({ ...p, [k]: v }));
  const updatePatient = <K extends keyof PatientData>(k: K, v: PatientData[K]) => setPatient((p) => ({ ...p, [k]: v }));

  const handlePrint = () => window.print();

  const handleDownloadPdf = async () => {
    const node = previewRef.current;
    if (!node) return;
    const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);
    const canvas = await html2canvas(node, { scale: 2, backgroundColor: "#fff" });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const imgH = (canvas.height * pageW) / canvas.width;
    let heightLeft = imgH;
    let position = 0;
    pdf.addImage(img, "PNG", 0, position, pageW, imgH);
    heightLeft -= pageH;
    while (heightLeft > 0) {
      position = heightLeft - imgH;
      pdf.addPage();
      pdf.addImage(img, "PNG", 0, position, pageW, imgH);
      heightLeft -= pageH;
    }
    const safeName = (patient.fullName || "patient").replace(/\W+/g, "_");
    pdf.save(`${template.docType}_${safeName}_${patient.date.replace(/\//g, "-")}.pdf`);
  };

  const clearAll = () => {
    if (!confirm("Clear all patient data and start a new document?")) return;
    sessionStorage.removeItem(PATIENT_KEY);
    setPatient(loadPatient());
    setValues({});
    setRx([]);
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="bg-white border-b sticky top-0 z-10 no-print">
        <div className="max-w-[1600px] mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-gray-500 hover:text-[var(--teal)]">←</Link>
            <img src={logo} alt="" className="h-8" />
            <div>
              <div className="text-xs uppercase text-[var(--coral)] font-semibold">{template.docType}</div>
              <div className="text-sm font-semibold">{template.name}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={clearAll} className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50">Clear</button>
            <button onClick={handleDownloadPdf} className="px-3 py-1.5 text-sm bg-[var(--coral)] text-white rounded hover:opacity-90">Download PDF</button>
            <button onClick={handlePrint} className="px-3 py-1.5 text-sm bg-[var(--teal)] text-white rounded hover:opacity-90">Print</button>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-[420px_1fr] gap-6 max-w-[1600px] mx-auto p-4">
        <aside className="space-y-6 no-print">
          <section className="bg-white rounded-xl border p-4">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">Patient Details</h3>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <select className="border rounded px-2 py-1.5" value={patient.prefix} onChange={(e) => updatePatient("prefix", e.target.value)}>
                {["Mr.", "Mrs.", "Ms.", "Master", "Baby"].map((p) => <option key={p}>{p}</option>)}
              </select>
              <input className="border rounded px-2 py-1.5 col-span-2" placeholder="Full Name" value={patient.fullName} onChange={(e) => updatePatient("fullName", e.target.value)} />
              <input className="border rounded px-2 py-1.5" placeholder="Age" value={patient.age} onChange={(e) => updatePatient("age", e.target.value)} />
              <select className="border rounded px-2 py-1.5" value={patient.gender} onChange={(e) => updatePatient("gender", e.target.value)}>
                <option value="M">Male</option><option value="F">Female</option><option value="O">Other</option>
              </select>
              <input className="border rounded px-2 py-1.5" placeholder="Date" value={patient.date} onChange={(e) => updatePatient("date", e.target.value)} />
              <input className="border rounded px-2 py-1.5 col-span-3" placeholder="Address" value={patient.address} onChange={(e) => updatePatient("address", e.target.value)} />
              <input className="border rounded px-2 py-1.5" placeholder="Reg No" value={patient.regNo} onChange={(e) => updatePatient("regNo", e.target.value)} />
              <input className="border rounded px-2 py-1.5 col-span-2" placeholder="Appt No" value={patient.apptNo} onChange={(e) => updatePatient("apptNo", e.target.value)} />
              <input className="border rounded px-2 py-1.5 col-span-3" placeholder="Consultant" value={patient.consultant} onChange={(e) => updatePatient("consultant", e.target.value)} />
            </div>
          </section>

          <section className="bg-white rounded-xl border p-4">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">Clinical Fields</h3>
            <div className="space-y-3">
              {template.fields.map((f) => {
                if (f.type === "prescription") {
                  return (
                    <div key={f.key}>
                      <label className="text-xs font-semibold text-gray-600">{f.label}</label>
                      <PrescriptionBuilder rows={rx} onChange={setRx} />
                      {rx.length === 0 && <button onClick={() => setRx([newRow()])} className="text-xs text-[var(--teal)] mt-1">Start prescription</button>}
                    </div>
                  );
                }
                return (
                  <div key={f.key}>
                    <label className="text-xs font-semibold text-gray-600">{f.label}{f.unit ? ` (${f.unit})` : ""}</label>
                    {f.type === "textarea" ? (
                      <textarea
                        className="w-full mt-1 border rounded px-2 py-1.5 text-sm min-h-[80px]"
                        value={values[f.key] ?? ""}
                        onChange={(e) => updateField(f.key, e.target.value)}
                        placeholder={f.placeholder}
                      />
                    ) : f.type === "select" ? (
                      <>
                        <select
                          className="w-full mt-1 border rounded px-2 py-1.5 text-sm"
                          value={values[f.key] ?? ""}
                          onChange={(e) => updateField(f.key, e.target.value)}
                        >
                          <option value="">-- select --</option>
                          {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                          <option value="__custom__">+ Type custom...</option>
                        </select>
                        {values[f.key] === "__custom__" && (
                          <input className="w-full mt-1 border rounded px-2 py-1.5 text-sm" placeholder="Enter custom..." onChange={(e) => updateField(f.key, e.target.value)} />
                        )}
                      </>
                    ) : (
                      <input
                        type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                        className="w-full mt-1 border rounded px-2 py-1.5 text-sm"
                        value={values[f.key] ?? ""}
                        onChange={(e) => updateField(f.key, e.target.value)}
                        placeholder={f.placeholder}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <div className="text-xs text-gray-500 bg-amber-50 border border-amber-200 rounded p-3">
            🔒 All patient data stays in this browser tab only. Nothing is sent to any server.
          </div>
        </aside>

        <main className="overflow-auto">
          <DocumentPreview ref={previewRef} template={template} patient={patient} values={mergedValues} rx={rx} />
        </main>
      </div>
    </div>
  );
}
