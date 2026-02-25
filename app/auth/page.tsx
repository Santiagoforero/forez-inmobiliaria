"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "login") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) {
          setError(signInError.message);
          setLoading(false);
          return;
        }
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) {
          setError(signUpError.message);
          setLoading(false);
          return;
        }
      }
      router.push("/");
    } catch (e: any) {
      setError(typeof e?.message === "string" ? e.message : "Error de autenticación.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-slate-50">
      <div className="mx-auto w-full max-w-md px-4 py-10 sm:px-0">
        <Card className="border-slate-200 bg-white shadow-lg shadow-slate-200/80">
          <CardContent className="space-y-6 p-6 sm:p-8">
            <div className="space-y-2 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
                Acceso clientes
              </p>
              <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">
                {mode === "login" ? "Inicia sesión" : "Crea tu cuenta"}
              </h1>
              <p className="text-xs text-slate-500">
                Usa tu correo corporativo o personal para acceder a Forez Inmobiliaria.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">
                  Correo electrónico
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-slate-300 bg-white text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">
                  Contraseña
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-slate-300 bg-white text-sm"
                />
              </div>

              {error && (
                <p className="text-xs font-semibold text-red-600">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="mt-2 w-full bg-[#0A2540] text-sm font-semibold text-white hover:bg-[#103463]"
              >
                {loading
                  ? "Procesando..."
                  : mode === "login"
                    ? "Iniciar sesión"
                    : "Crear cuenta"}
              </Button>
            </form>

            <button
              type="button"
              className="w-full text-center text-xs font-medium text-sky-700 hover:text-sky-800"
              onClick={() =>
                setMode((prev) => (prev === "login" ? "register" : "login"))
              }
            >
              {mode === "login"
                ? "¿No tienes cuenta? Crear cuenta"
                : "¿Ya tienes cuenta? Iniciar sesión"}
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

