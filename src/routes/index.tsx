import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  ssr: false,
  component: Index,
});

function Index() {
  const { doctor } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    nav({ to: doctor ? "/dashboard" : "/login", replace: true });
  }, [doctor, nav]);
  return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading…</div>;
}
