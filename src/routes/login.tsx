import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import logo from "@/assets/tulip-full-logo.jpg";

export const Route = createFileRoute("/login")({
  ssr: false,
  component: LoginPage,
});

function LoginPage() {
  const { login, doctor } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@tuliphospital.co");
  const [password, setPassword] = useState("cardiology2025");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");

  if (doctor) {
    nav({ to: "/dashboard", replace: true });
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = login(email, password);
    if (!r.ok) setErr(r.error ?? "Login failed");
    else nav({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[var(--accent)] to-white">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Tulip Superspeciality Hospital" className="h-24" />
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-800">Tulip DocBuilder</h1>
        <p className="text-center text-sm text-gray-500 mb-6">Sign in to your account</p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--teal)] outline-none"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-3 py-2 pr-20 border rounded-lg focus:ring-2 focus:ring-[var(--teal)] outline-none"
                required
              />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[var(--teal)]">
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {err && <div className="text-sm text-[var(--coral)] bg-red-50 px-3 py-2 rounded">{err}</div>}
          <button
            type="submit"
            className="w-full py-2.5 bg-[var(--teal)] hover:opacity-90 text-white font-semibold rounded-lg"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-xs text-gray-500 bg-gray-50 rounded p-3">
          <div className="font-semibold mb-1">Demo accounts:</div>
          <div>admin@tuliphospital.co / cardiology2025</div>
          <div>dr.himanshu@tuliphospital.co / cardiology2025</div>
        </div>
      </div>
    </div>
  );
}
