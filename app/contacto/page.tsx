"use client";

import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
            Contacto
          </p>
          <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Hablemos de tu próxima inversión
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
            Déjanos tus datos y un asesor Forez se pondrá en contacto contigo
            para entender tu necesidad y presentarte alternativas a la medida.
          </p>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardContent className="space-y-5 p-6 sm:p-8">
                <form className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        Nombre completo
                      </label>
                      <Input
                        placeholder="Tu nombre y apellidos"
                        className="border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        Correo electrónico
                      </label>
                      <Input
                        type="email"
                        placeholder="tu@correo.com"
                        className="border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        Teléfono / WhatsApp
                      </label>
                      <Input
                        placeholder="+57 ..."
                        className="border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        Ciudad de interés
                      </label>
                      <Input
                        placeholder="Bucaramanga, Bogotá, Medellín..."
                        className="border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      Mensaje
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Cuéntanos qué tipo de propiedad buscas, presupuesto aproximado y plazo."
                      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                    />
                  </div>
                  <Button className="w-full bg-[#0A2540] text-sm font-semibold text-white hover:bg-[#103463]">
                    Enviar solicitud
                  </Button>
                  <p className="text-[11px] text-slate-500">
                    Al enviar tus datos autorizas a Forez Inmobiliaria a
                    contactarte por los medios suministrados para fines
                    comerciales relacionados con servicios inmobiliarios.
                  </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="space-y-4"
          >
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardContent className="space-y-3 p-6">
                <h2 className="text-sm font-semibold text-slate-900">
                  Información de contacto
                </h2>
                <p className="text-xs text-slate-600">
                  Atendemos clientes en Bucaramanga, Bogotá y Medellín con
                  agenda previa.
                </p>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <p>
                    <span className="font-medium text-slate-700">
                      Correo:
                    </span>{" "}
                    contacto@forez.com
                  </p>
                  <p>
                    <span className="font-medium text-slate-700">
                      Teléfono:
                    </span>{" "}
                    +57 (300) 000 0000
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-dashed border-slate-300 bg-slate-50">
              <CardContent className="flex h-52 flex-col items-center justify-center gap-2 text-center">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  MAPA FOREZ
                </span>
                <p className="max-w-xs text-xs text-slate-500">
                  Aquí podrás integrar próximamente un mapa interactivo (por
                  ejemplo, Mapbox) con oficinas y zonas de cobertura Forez.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

