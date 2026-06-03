import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { TEMPLATES } from "@/lib/templates";
import logo from "@/assets/tulip-logo.png";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  component: Dashboard,
});

function Dashboard() {
  const { doctor, logout } = useAuth();
  const nav = useNavigate();
  useEffect(() => { if (!doctor) nav({ to: "/login", replace: true }); }, [doctor, nav]);
  if (!doctor) return null;

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const favs = TEMPLATES.filter((t) => t.favourite);
  const others = TEMPLATES.filter((t) => !t.favourite);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="" className="h-10" />
            <div>
              <div className="font-bold text-gray-800">Tulip DocBuilder</div>
              <div className="text-xs text-gray-500">Tulip Superspeciality Hospital, Anand</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right text-sm">
              <div className="font-semibold text-gray-800">{doctor.fullName}</div>
              <div className="text-xs">
                <span className="bg-[var(--teal)] text-white px-2 py-0.5 rounded">{doctor.department}</span>
                {doctor.isAdmin && <span className="ml-1 bg-[var(--coral)] text-white px-2 py-0.5 rounded">Admin</span>}
              </div>
            </div>
            <button onClick={() => { logout(); nav({ to: "/login" }); }} className="text-sm text-gray-600 hover:text-[var(--coral)]">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Welcome, Dr. Himanshu</h1>
          <p className="text-sm text-gray-500">{today}</p>
        </div>

        <h2 className="text-sm font-semibold uppercase text-gray-500 tracking-wide mb-3">⭐ Favourite Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {favs.map((t) => (
            <TemplateCard key={t.id} id={t.id} name={t.name} docType={t.docType} />
          ))}
        </div>

        <h2 className="text-sm font-semibold uppercase text-gray-500 tracking-wide mb-3">All Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {others.map((t) => (
            <TemplateCard key={t.id} id={t.id} name={t.name} docType={t.docType} />
          ))}
        </div>

        <h2 className="text-sm font-semibold uppercase text-gray-500 tracking-wide mb-3">Departments</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-[var(--teal)] text-white rounded-lg p-3 text-sm font-semibold">Cardiology ✓</div>
          {["Neurology", "Orthopedics", "Gastroenterology", "Pulmonology", "Urology"].map((d) => (
            <div key={d} className="bg-gray-100 text-gray-400 rounded-lg p-3 text-sm">{d} <span className="block text-[10px]">Coming soon</span></div>
          ))}
        </div>
      </main>
    </div>
  );
}

function TemplateCard({ id, name, docType }: { id: string; name: string; docType: string }) {
  return (
    <Link
      to="/generate/$templateId"
      params={{ templateId: id }}
      className="block bg-white rounded-xl p-4 border hover:border-[var(--teal)] hover:shadow-md transition"
    >
      <div className="text-xs uppercase tracking-wide text-[var(--coral)] font-semibold">{docType}</div>
      <div className="mt-1 font-semibold text-gray-800 leading-tight">{name}</div>
      <div className="mt-3 text-xs text-[var(--teal)]">Use template →</div>
    </Link>
  );
}
