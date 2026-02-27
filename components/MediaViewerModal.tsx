"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

export type MediaViewerType = "image" | "video" | "embed";

export type MediaItem = {
  type: MediaViewerType;
  url: string;
  title?: string;
};

export type MediaViewerModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type?: MediaViewerType;
  url?: string;
  title?: string;
  /** Cuando se pasa, se muestran flechas para navegar entre ítems */
  items?: MediaItem[];
  initialIndex?: number;
};

export function MediaViewerModal({
  open,
  onOpenChange,
  type = "image",
  url = "",
  title = "Vista detallada",
  items,
  initialIndex = 0,
}: MediaViewerModalProps) {
  const list = items?.length ? items : [{ type, url, title }];
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (open) setCurrentIndex(Math.min(initialIndex, list.length - 1));
  }, [open, initialIndex, list.length]);

  const current = list[currentIndex];
  const hasMultiple = list.length > 1;
  const canPrev = hasMultiple && currentIndex > 0;
  const canNext = hasMultiple && currentIndex < list.length - 1;

  if (!current?.url) return null;

  const goPrev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const goNext = () => setCurrentIndex((i) => Math.min(list.length - 1, i + 1));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[95vh] w-[95vw] max-w-6xl overflow-hidden p-0"
        showCloseButton={true}
      >
        <DialogTitle className="sr-only">{current.title || title}</DialogTitle>
        <div className="relative flex min-h-[70vh] w-full flex-col bg-slate-900">
          {hasMultiple && (
            <>
              {canPrev && (
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}
              {canNext && (
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Siguiente"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}
              <div className="absolute left-4 top-4 z-10 rounded bg-black/60 px-2 py-1 text-xs font-medium text-white">
                {currentIndex + 1} / {list.length}
              </div>
            </>
          )}

          {current.type === "image" && (
            <div className="relative flex min-h-[70vh] w-full items-center justify-center p-4">
              <Image
                key={current.url}
                src={current.url}
                alt={current.title || title}
                fill
                className="object-contain"
                sizes="95vw"
                unoptimized={current.url.startsWith("blob:") || current.url.includes("supabase")}
              />
            </div>
          )}
          {current.type === "video" && (
            <div className="relative aspect-video w-full">
              <iframe
                key={current.url}
                src={current.url}
                title={current.title || title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          )}
          {current.type === "embed" && (
            <div className="h-[85vh] w-full">
              <iframe
                key={current.url}
                src={current.url}
                title={current.title || title}
                className="h-full w-full bg-white"
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
