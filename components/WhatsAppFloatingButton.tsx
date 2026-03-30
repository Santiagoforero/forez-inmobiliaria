"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppFloatingButton() {
  return (
    <button
      type="button"
      className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-400/50 hover:bg-emerald-600"
      aria-label="WhatsApp Forez"
      onClick={() => {
        window.open(
          "https://wa.me/573213613351?text=Hola,%20quiero%20información%20sobre%20propiedades%20en%20Forez",
          "_blank",
        );
      }}
    >
      <MessageCircle className="h-5 w-5" />
    </button>
  );
}

