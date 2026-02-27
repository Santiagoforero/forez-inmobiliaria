"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function DreamRequestBox() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [tipo, setTipo] = useState("");
  const [presupuesto, setPresupuesto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from("dream_requests").insert({
        nombre: nombre || null,
        email: email || null,
        telefono: telefono || null,
        ubicacion_deseada: ubicacion || null,
        tipo_deseado: tipo || null,
        presupuesto_max: presupuesto ? Number(presupuesto) : null,
        descripcion: descripcion || null,
      });
      if (error) {
        toast.error("No se pudo registrar tu solicitud. Intenta de nuevo.");
      } else {
        toast.success("Recibimos tu solicitud. Un asesor te contactará.");
        setNombre("");
        setEmail("");
        setTelefono("");
        setUbicacion("");
        setTipo("");
        setPresupuesto("");
        setDescripcion("");
      }
    } catch {
      toast.error("No se pudo registrar tu solicitud. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardContent className="space-y-4 p-5 sm:p-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
          Inmueble ideal
        </p>
        <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
          Cuéntanos cómo es el inmueble o predio de tus sueños
        </h2>
        <p className="text-xs text-slate-600 sm:text-sm">
          Buscamos por ti incluso fuera de catálogo: activos silenciosos, oportunidades
          off-market y proyectos en etapa temprana.
        </p>
        <form className="space-y-3 text-xs sm:text-sm" onSubmit={handleSubmit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-600">
                Nombre
              </label>
              <Input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="border-slate-300 bg-white text-xs sm:text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-600">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-slate-300 bg-white text-xs sm:text-sm"
              />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-600">
                Teléfono
              </label>
              <Input
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="border-slate-300 bg-white text-xs sm:text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-600">
                Presupuesto aproximado (COP)
              </label>
              <Input
                type="number"
                value={presupuesto}
                onChange={(e) => setPresupuesto(e.target.value)}
                className="border-slate-300 bg-white text-xs sm:text-sm"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-600">
              Ciudad / ubicación deseada
            </label>
            <Input
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              className="border-slate-300 bg-white text-xs sm:text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-600">
              Tipo de activo
            </label>
            <Input
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              placeholder="Apartamento, lote, bodega, local comercial, industria…"
              className="border-slate-300 bg-white text-xs sm:text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-600">
              Descripción (m2, habitaciones, usos, etc.)
            </label>
            <Textarea
              rows={4}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="border-slate-300 bg-white text-xs sm:text-sm"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="mt-1 w-full bg-[#0A2540] text-xs font-semibold text-white hover:bg-[#103463]"
          >
            {loading ? "Enviando solicitud..." : "Quiero que me ayuden a buscar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

