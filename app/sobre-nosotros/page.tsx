"use client";

import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
            Sobre nosotros
          </p>
          <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Forez Inmobiliaria, aliados en activos
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
            Acompañamos a familias, empresas e inversionistas en la compra y venta de
            vivienda, lotes, comercio, industria y proyectos sobre planos en Bucaramanga, Bogotá,
            Medellín y otras ciudades clave de Colombia.
          </p>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14 grid gap-8 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2 space-y-6"
          >
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardContent className="space-y-4 p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-slate-900">
                  Nuestra filosofía
                </h2>
                <p className="text-sm text-slate-600">
                  Seleccionamos un portafolio curado de inmuebles, lotes, activos
                  comerciales e industriales y proyectos sobre planos que cumplen
                  estándares estrictos de ubicación, diseño, seguridad y
                  potencial de valorización. Cada activo se analiza con
                  criterios financieros y de estrategia patrimonial, para asegurar que
                  la decisión de inversión sea sólida y sostenible en el tiempo.
                </p>
                <p className="text-sm text-slate-600">
                  Trabajamos con un modelo boutique: pocos clientes, alta
                  dedicación. Esto nos permite ofrecer un servicio discreto,
                  personalizado y alineado con el nivel de detalle que exige el
                  mercado premium.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white shadow-sm">
              <CardContent className="grid gap-4 p-6 sm:grid-cols-3 sm:p-8">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                    Experiencia
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">
                    10+
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    años en el mercado inmobiliario colombiano.
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                    Ciudades
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">
                    3
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    enfoque en Bucaramanga, Bogotá y Medellín.
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                    Clientes
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">
                    150+
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    familias e inversionistas acompañados.
                  </p>
                </div>
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
                <h3 className="text-sm font-semibold text-slate-900">
                  Servicios Forez
                </h3>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li>• Curaduría de propiedades premium.</li>
                  <li>• Acompañamiento legal y financiero.</li>
                  <li>• Análisis de valorización e inversión.</li>
                  <li>• Gestión de compraventa y trámites.</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardContent className="space-y-3 p-6">
                <h3 className="text-sm font-semibold text-slate-900">
                  Cómo trabajamos
                </h3>
                <p className="text-xs text-slate-600">
                  Iniciamos con una reunión de entendimiento de tu perfil:
                  objetivos, plazo, tolerancia al riesgo y ciudades de interés.
                  A partir de allí, diseñamos un radar de oportunidades y te
                  presentamos únicamente inmuebles alineados con ese perfil.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

