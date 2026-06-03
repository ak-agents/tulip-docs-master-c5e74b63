export interface Medicine {
  id: string;
  name: string;
  generic?: string;
  form: "Tab" | "Cap" | "Inj" | "Syp" | "Drop";
  defaultDose?: string;
  defaultFrequency?: string;
  notes?: string;
  department: string;
}

const SEED: Medicine[] = [
  { id: "ecosprin-75", name: "Ecosprin", generic: "Aspirin", form: "Tab", defaultDose: "75mg", defaultFrequency: "0-1-0", department: "Cardiology" },
  { id: "ecosprin-150", name: "Ecosprin", generic: "Aspirin", form: "Tab", defaultDose: "150mg", defaultFrequency: "0-1-0", department: "Cardiology" },
  { id: "brilinta-90", name: "Brilinta", generic: "Ticagrelor", form: "Tab", defaultDose: "90mg", defaultFrequency: "1-0-1", department: "Cardiology" },
  { id: "clopidogrel-75", name: "Clopidogrel", generic: "Clopidogrel", form: "Tab", defaultDose: "75mg", defaultFrequency: "0-0-1", department: "Cardiology" },
  { id: "atorva-20", name: "Atorvastatin", generic: "Atorvastatin", form: "Tab", defaultDose: "20mg", defaultFrequency: "0-0-1", department: "Cardiology" },
  { id: "atorva-40", name: "Atorvastatin", generic: "Atorvastatin", form: "Tab", defaultDose: "40mg", defaultFrequency: "0-0-1", department: "Cardiology" },
  { id: "atorva-ez", name: "Atorva EZ", generic: "Atorvastatin+Ezetimibe", form: "Tab", defaultDose: "40/10mg", defaultFrequency: "0-0-1", department: "Cardiology" },
  { id: "rosuva-10", name: "Rosuvastatin", generic: "Rosuvastatin", form: "Tab", defaultDose: "10mg", defaultFrequency: "0-0-1", department: "Cardiology" },
  { id: "rosuva-20", name: "Rosuvastatin", generic: "Rosuvastatin", form: "Tab", defaultDose: "20mg", defaultFrequency: "0-0-1", department: "Cardiology" },
  { id: "bisoheart-2.5", name: "Bisoheart", generic: "Bisoprolol", form: "Tab", defaultDose: "2.5mg", defaultFrequency: "1-0-0", department: "Cardiology" },
  { id: "bisoheart-5", name: "Bisoheart", generic: "Bisoprolol", form: "Tab", defaultDose: "5mg", defaultFrequency: "1-0-0", department: "Cardiology" },
  { id: "ramipril-2.5", name: "Ramipril", generic: "Ramipril", form: "Tab", defaultDose: "2.5mg", defaultFrequency: "1-0-0", department: "Cardiology" },
  { id: "ramipril-5", name: "Ramipril", generic: "Ramipril", form: "Tab", defaultDose: "5mg", defaultFrequency: "1-0-0", department: "Cardiology" },
  { id: "telma-40", name: "Telmisartan", generic: "Telmisartan", form: "Tab", defaultDose: "40mg", defaultFrequency: "1-0-0", department: "Cardiology" },
  { id: "telma-80", name: "Telmisartan", generic: "Telmisartan", form: "Tab", defaultDose: "80mg", defaultFrequency: "1-0-0", department: "Cardiology" },
  { id: "amlo-5", name: "Amlodipine", generic: "Amlodipine", form: "Tab", defaultDose: "5mg", defaultFrequency: "1-0-0", department: "Cardiology" },
  { id: "lasix-40", name: "Furosemide", generic: "Furosemide", form: "Tab", defaultDose: "40mg", defaultFrequency: "1-0-0", department: "Cardiology" },
  { id: "aldactone-25", name: "Aldactone", generic: "Spironolactone", form: "Tab", defaultDose: "25mg", defaultFrequency: "0-0-1", department: "Cardiology" },
  { id: "ismn-30", name: "Isosorbide Mononitrate", generic: "ISMN", form: "Tab", defaultDose: "30mg", defaultFrequency: "1-0-0", department: "Cardiology" },
  { id: "eliquis-2.5", name: "Eliquis", generic: "Apixaban", form: "Tab", defaultDose: "2.5mg", defaultFrequency: "1-0-1", department: "Cardiology" },
  { id: "eliquis-5", name: "Eliquis", generic: "Apixaban", form: "Tab", defaultDose: "5mg", defaultFrequency: "1-0-1", department: "Cardiology" },
  { id: "rivaroxa-20", name: "Rivaroxaban", generic: "Rivaroxaban", form: "Tab", defaultDose: "20mg", defaultFrequency: "0-0-1", department: "Cardiology" },
  { id: "warfarin-5", name: "Warfarin", generic: "Warfarin", form: "Tab", defaultDose: "5mg", defaultFrequency: "0-0-1", department: "Cardiology" },
  { id: "enoxa-60", name: "Enoxaparin", generic: "Enoxaparin", form: "Inj", defaultDose: "60mg", defaultFrequency: "SC BD", department: "Cardiology" },
  { id: "amioda-200", name: "Amiodarone", generic: "Amiodarone", form: "Tab", defaultDose: "200mg", defaultFrequency: "1-0-1", department: "Cardiology" },
  { id: "digoxin", name: "Digoxin", generic: "Digoxin", form: "Tab", defaultDose: "0.25mg", defaultFrequency: "1-0-0", department: "Cardiology" },
  { id: "ivabra-5", name: "Ivabradine", generic: "Ivabradine", form: "Tab", defaultDose: "5mg", defaultFrequency: "1-0-1", department: "Cardiology" },
  { id: "glycomet-500", name: "Glycomet", generic: "Metformin", form: "Tab", defaultDose: "500mg", defaultFrequency: "1-0-1", department: "Cardiology" },
  { id: "glycomet-sr-500", name: "Glycomet SR", generic: "Metformin SR", form: "Tab", defaultDose: "500mg", defaultFrequency: "0-1-1", department: "Cardiology" },
  { id: "sitaxa-d", name: "Sitaxa-D", generic: "Sitagliptin+Metformin", form: "Tab", defaultDose: "50/500mg", defaultFrequency: "1-0-1", department: "Cardiology" },
  { id: "jardiance-10", name: "Jardiance", generic: "Empagliflozin", form: "Tab", defaultDose: "10mg", defaultFrequency: "1-0-0", department: "Cardiology" },
  { id: "forxiga-10", name: "Forxiga", generic: "Dapagliflozin", form: "Tab", defaultDose: "10mg", defaultFrequency: "1-0-0", department: "Cardiology" },
  { id: "pan-40", name: "Pantoprazole", generic: "Pantoprazole", form: "Tab", defaultDose: "40mg", defaultFrequency: "1-0-0", notes: "Before breakfast", department: "Cardiology" },
  { id: "veloz-20", name: "Veloz", generic: "Rabeprazole", form: "Tab", defaultDose: "20mg", defaultFrequency: "1-0-0", notes: "Before breakfast", department: "Cardiology" },
  { id: "zoni-m", name: "Zoni-M", generic: "Zonisamide+Metformin", form: "Tab", defaultDose: "1/500mg", defaultFrequency: "0-1-0", department: "Cardiology" },
  { id: "clopiprin-av", name: "Clopiprin-AV", generic: "Clopidogrel+Aspirin+Atorvastatin", form: "Cap", defaultDose: "75/20mg", defaultFrequency: "0-0-1", department: "Cardiology" },
];

const STORAGE_KEY = "tulip_medicines_v1";

export function getAllMedicines(): Medicine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
  return SEED;
}

export function addMedicine(m: Omit<Medicine, "id">): Medicine {
  const list = getAllMedicines();
  const created: Medicine = { ...m, id: `m_${Date.now()}` };
  const next = [...list, created];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return created;
}

export function searchMedicines(query: string, department = "Cardiology"): Medicine[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return getAllMedicines()
    .filter((m) => m.department === department || m.department === "All")
    .filter((m) =>
      m.name.toLowerCase().includes(q) ||
      (m.generic?.toLowerCase().includes(q) ?? false)
    )
    .slice(0, 8);
}
