// Template definitions. Each template is a list of sections; each section has
// blocks (text/heading/field/prescription). Placeholders use {{key}} syntax and
// are replaced with patient + clinical field values at render time.

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "select"
  | "prescription";

export interface ClinicalField {
  key: string; // matches placeholder {{key}}
  label: string;
  type: FieldType;
  options?: string[];
  unit?: string;
  defaultValue?: string;
  placeholder?: string;
}

export interface TemplateSection {
  title?: string;
  // a body string with placeholders, OR a list of label/value pairs.
  body?: string;
  rows?: Array<{ label: string; valueKey: string; unit?: string }>;
  prescription?: boolean; // if true renders the medicine table here
}

export interface Template {
  id: string;
  name: string;
  docType: "OPD" | "Discharge" | "Echo" | "CAG" | "Followup";
  department: string;
  fields: ClinicalField[];
  sections: TemplateSection[];
  favourite?: boolean;
}

const DIAGNOSIS_CARDIO = [
  "ACS – NSTEMI",
  "ACS – STEMI (Anterior Wall)",
  "ACS – STEMI (Inferior Wall)",
  "Re ACS – AWMI",
  "Unstable Angina",
  "Stable Angina (CCS II)",
  "CAD – Single vessel disease",
  "CAD – Double vessel disease",
  "CAD – Triple vessel disease",
  "Heart Failure with Reduced EF (HFrEF)",
  "Heart Failure with Preserved EF (HFpEF)",
  "Hypertension – Stage I",
  "Hypertension – Stage II",
  "Atrial Fibrillation",
  "Atrial Flutter",
  "Paroxysmal SVT",
  "Complete Heart Block",
  "Dilated Cardiomyopathy",
  "Rheumatic Heart Disease",
  "Mitral Regurgitation",
  "Aortic Stenosis",
  "Diabetes Mellitus Type II",
  "Dyslipidemia",
];

const ADVICE_OPTS = [
  "Aggressive medical management",
  "OCT for proximal LAD lesion",
  "PCI advised",
  "CABG advised",
  "Lifestyle modification + medical management",
  "Follow up after 1 week with reports",
  "Repeat 2D Echo after 3 months",
];

export const TEMPLATES: Template[] = [
  {
    id: "opd-cardio",
    name: "OPD Case Paper — Cardiology",
    docType: "OPD",
    department: "Cardiology",
    favourite: true,
    fields: [
      { key: "chief_complaint", label: "Chief Complaint / Notes", type: "textarea", placeholder: "e.g. F/up case, Better, No F/C" },
      { key: "diagnosis", label: "Diagnosis", type: "select", options: DIAGNOSIS_CARDIO },
      { key: "bp", label: "BP (mmHg)", type: "text", placeholder: "140/80" },
      { key: "pulse", label: "Pulse (bpm)", type: "number" },
      { key: "spo2", label: "SpO2 (%)", type: "number" },
      { key: "rbs", label: "RBS (mg/dl)", type: "number" },
      { key: "medicine_table", label: "Prescription", type: "prescription" },
      { key: "investigations", label: "Investigations Advised", type: "textarea", placeholder: "HbA1c, Lipid profile" },
      { key: "followup", label: "Follow up", type: "text", defaultValue: "After 1 month with reports" },
    ],
    sections: [
      { title: "Chief Complaint", body: "{{chief_complaint}}" },
      { title: "Vitals", rows: [
        { label: "BP", valueKey: "bp", unit: "mmHg" },
        { label: "Pulse", valueKey: "pulse", unit: "bpm" },
        { label: "SpO2", valueKey: "spo2", unit: "%" },
        { label: "RBS", valueKey: "rbs", unit: "mg/dl" },
      ]},
      { title: "Diagnosis", body: "{{diagnosis}}" },
      { title: "Rx (Treatment)", prescription: true },
      { title: "Investigations Advised", body: "{{investigations}}" },
      { title: "Follow up", body: "{{followup}}" },
    ],
  },
  {
    id: "discharge-nstemi",
    name: "Discharge Summary — ACS / NSTEMI",
    docType: "Discharge",
    department: "Cardiology",
    favourite: true,
    fields: [
      { key: "admission_date", label: "Admission Date", type: "date" },
      { key: "discharge_date", label: "Discharge Date", type: "date" },
      { key: "procedure_date", label: "Coronary Angiography Date", type: "date" },
      { key: "hospital_course", label: "History & Hospital Course", type: "textarea",
        placeholder: "A {{age}} year old {{gender}}, known case of...",
        defaultValue: "Known case of diabetes mellitus, recent Re ACS-AWMI (Thrombolysed elsewhere), H/O CAG s/o single vessel disease (on medical management); was referred for coronary angiography. On examination vitals were BP: {{bp}} mmHg, P: {{pulse}}/min, SpO2: {{spo2}}% RA. ECG showed ST-T changes in anterior leads. 2D echo showed normal LV systolic function (LVEF {{lvef}}%) with RWMA. He was advised coronary angiography to rule out CAD. After informed consent from relatives, he underwent trans-radial coronary angiography which showed Single vessel disease. Relatives were explained about severity of disease related risk and advised for OCT for proximal LAD lesion and aggressive medical management. He was given discharge with following medications." },
      { key: "bp", label: "BP at admission", type: "text", defaultValue: "140/80" },
      { key: "pulse", label: "Pulse", type: "number", defaultValue: "78" },
      { key: "spo2", label: "SpO2", type: "number", defaultValue: "99" },
      { key: "lvef", label: "LVEF", type: "number", unit: "%", defaultValue: "55" },
      { key: "diagnosis", label: "Diagnosis", type: "textarea",
        defaultValue: "1. ACS – NSTEMI, Good LV systolic function, DM II, CAG – SVD\n2. Re ACS – AWMI (Tx), Fair LV Function\n3. CAD – Single vessel disease" },
      { key: "medicine_table", label: "Treatment on Discharge", type: "prescription" },
      { key: "followup", label: "Follow up", type: "text", defaultValue: "In OPD after 10 days with FBS/PPBS reports" },
    ],
    sections: [
      { rows: [
        { label: "Admission Date", valueKey: "admission_date" },
        { label: "Discharge Date", valueKey: "discharge_date" },
        { label: "Coronary Angiography", valueKey: "procedure_date" },
      ]},
      { title: "History and Hospital Course", body: "{{hospital_course}}" },
      { title: "Diagnosis", body: "{{diagnosis}}" },
      { title: "Treatment on Discharge", prescription: true },
      { title: "Follow up", body: "{{followup}}" },
    ],
  },
  {
    id: "echo-2d",
    name: "2D Echo + Color Doppler Report",
    docType: "Echo",
    department: "Cardiology",
    favourite: true,
    fields: [
      { key: "mitral", label: "Mitral Valve", type: "select", options: ["Normal Structure", "Mild MR", "Moderate MR", "Severe MR", "Mitral Stenosis"], defaultValue: "Normal Structure" },
      { key: "aortic", label: "Aortic Valve", type: "select", options: ["Normal Structure", "Mild AR", "Moderate AR", "Aortic Stenosis"], defaultValue: "Normal Structure" },
      { key: "tricuspid", label: "Tricuspid Valve", type: "select", options: ["Normal Structure", "Trivial TR", "Mild TR", "Moderate TR", "Severe TR"], defaultValue: "Normal Structure" },
      { key: "pulmonary", label: "Pulmonary Valve", type: "select", options: ["Normal Structure", "Pulmonary Stenosis", "Pulmonary Regurgitation"], defaultValue: "Normal Structure" },
      { key: "ias", label: "IAS", type: "select", options: ["Intact", "ASD"], defaultValue: "Intact" },
      { key: "ivs", label: "IVS", type: "select", options: ["Intact", "VSD"], defaultValue: "Intact" },
      { key: "lv_dim", label: "LV Diastolic/Systolic Dimension (mm)", type: "text", defaultValue: "49/26" },
      { key: "ivs_pw", label: "IVS/PW (mm)", type: "text", defaultValue: "11/11" },
      { key: "la", label: "LA (mm)", type: "number", defaultValue: "35" },
      { key: "aorta", label: "Aorta (mm)", type: "number", defaultValue: "30" },
      { key: "ra_rv", label: "RA-RV", type: "text", defaultValue: "Normal" },
      { key: "lvef", label: "LVEF (%)", type: "number", defaultValue: "55" },
      { key: "pericardium", label: "Pericardium", type: "text", defaultValue: "Normal" },
      { key: "rwma", label: "RWMA", type: "text", defaultValue: "No RWMA" },
      { key: "ea", label: "E/A", type: "text", defaultValue: "0.7/1.0" },
      { key: "aortic_signal", label: "Aortic signal (m/s)", type: "text", defaultValue: "1.1" },
      { key: "rvsp", label: "RVSP (mmHg)", type: "number", defaultValue: "28" },
      { key: "tr_mr_pah", label: "TR / MR / PAH", type: "text", defaultValue: "Trivial TR, Trivial MR, No PAH" },
      { key: "ivc", label: "IVC", type: "text", defaultValue: "Normal" },
      { key: "impression", label: "Impression", type: "textarea",
        defaultValue: "Normal LV size with Normal LV systolic function (LVEF {{lvef}}%) / RWMA present\nTrivial TR, Trivial MR, No PAH\nGrade 1 LV diastolic dysfunction, Good RV function" },
    ],
    sections: [
      { title: "2D / M-Mode Findings", rows: [
        { label: "Mitral Valve", valueKey: "mitral" },
        { label: "Aortic Valve", valueKey: "aortic" },
        { label: "Tricuspid Valve", valueKey: "tricuspid" },
        { label: "Pulmonary Valve", valueKey: "pulmonary" },
        { label: "IAS", valueKey: "ias" },
        { label: "IVS", valueKey: "ivs" },
        { label: "LV Diastolic / Systolic Dimension", valueKey: "lv_dim", unit: "mm" },
        { label: "IVS / PW", valueKey: "ivs_pw", unit: "mm" },
        { label: "LA", valueKey: "la", unit: "mm" },
        { label: "Aorta", valueKey: "aorta", unit: "mm" },
        { label: "RA-RV", valueKey: "ra_rv" },
        { label: "LVEF", valueKey: "lvef", unit: "%" },
        { label: "Pericardium", valueKey: "pericardium" },
        { label: "RWMA", valueKey: "rwma" },
      ]},
      { title: "Doppler Findings", rows: [
        { label: "E/A", valueKey: "ea" },
        { label: "Aortic signal", valueKey: "aortic_signal", unit: "m/s" },
        { label: "RVSP", valueKey: "rvsp", unit: "mmHg" },
        { label: "TR / MR / PAH", valueKey: "tr_mr_pah" },
        { label: "IVC", valueKey: "ivc" },
      ]},
      { title: "Impression", body: "{{impression}}" },
    ],
  },
  {
    id: "cag",
    name: "Coronary Angiography Report",
    docType: "CAG",
    department: "Cardiology",
    favourite: true,
    fields: [
      { key: "done_by", label: "Done by", type: "text", defaultValue: "Dr. Himanshu Meghnathi" },
      { key: "catheter", label: "Catheter", type: "text", defaultValue: "5F TIG" },
      { key: "contrast", label: "Contrast", type: "text", defaultValue: "20-25ml Omnipaque" },
      { key: "access", label: "Access", type: "select", options: ["Right radial artery", "Left radial artery", "Right femoral artery"], defaultValue: "Right radial artery" },
      { key: "lmca", label: "LMCA", type: "text", defaultValue: "Normal" },
      { key: "lad", label: "LAD", type: "textarea", defaultValue: "Type III vessel, Proximal plaque with subtle haziness, non obstructing lesion, mid plaque" },
      { key: "diagonals", label: "Diagonals", type: "textarea", defaultValue: "Major diagonal is average sized with ostioproximal 60-70% stenosis, bifurcates then after, one of division has 90% stenosis (thin calibre)" },
      { key: "lcx", label: "LCX", type: "text", defaultValue: "Non-Dominant, mild proximal plaque" },
      { key: "oms", label: "OMs", type: "text", defaultValue: "Normal" },
      { key: "rca", label: "RCA", type: "text", defaultValue: "Dominant, mild mid segment eccentric plaque, rest normal" },
      { key: "pda_plv", label: "PDA & PLV", type: "text", defaultValue: "Normal" },
      { key: "impression", label: "Impression", type: "textarea",
        defaultValue: "ACS – NSTEMI with Good LV function, DM\nCAG – Single vessel disease\nCAD – Single vessel disease" },
      { key: "advice", label: "Advice", type: "textarea",
        options: ADVICE_OPTS,
        defaultValue: "OCT for proximal LAD lesion\nAggressive medical management" },
    ],
    sections: [
      { rows: [
        { label: "Done by", valueKey: "done_by" },
        { label: "Catheter", valueKey: "catheter" },
        { label: "Contrast", valueKey: "contrast" },
        { label: "Access", valueKey: "access" },
      ]},
      { title: "Findings", rows: [
        { label: "LMCA", valueKey: "lmca" },
        { label: "LAD", valueKey: "lad" },
        { label: "Diagonals", valueKey: "diagonals" },
        { label: "LCX", valueKey: "lcx" },
        { label: "OMs", valueKey: "oms" },
        { label: "RCA", valueKey: "rca" },
        { label: "PDA & PLV", valueKey: "pda_plv" },
      ]},
      { title: "Impression", body: "{{impression}}" },
      { title: "Advice", body: "{{advice}}" },
    ],
  },
  {
    id: "followup",
    name: "OPD Follow-up Note (short)",
    docType: "Followup",
    department: "Cardiology",
    fields: [
      { key: "status", label: "Status", type: "text", defaultValue: "Better, No F/C" },
      { key: "medicine_table", label: "Continue Medications", type: "prescription" },
      { key: "investigations", label: "Investigations", type: "textarea", defaultValue: "HbA1c, Lipid profile" },
      { key: "followup", label: "Follow up", type: "text", defaultValue: "After 1 month" },
    ],
    sections: [
      { title: "Status", body: "{{status}}" },
      { title: "Continue Medications", prescription: true },
      { title: "Investigations", body: "{{investigations}}" },
      { title: "Follow up", body: "{{followup}}" },
    ],
  },
];

export function getTemplate(id: string) {
  return TEMPLATES.find((t) => t.id === id);
}

export function replacePlaceholders(text: string, values: Record<string, string>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const v = values[key];
    return v && v.trim() ? v : `__${key}__`;
  });
}
