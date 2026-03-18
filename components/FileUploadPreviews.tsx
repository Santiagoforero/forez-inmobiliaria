"use client";

import { useState } from "react";

export function ImagePreviews({
  urls,
  onRemove,
  onAddMore,
  inputId,
  accept,
  multiple,
  uploading,
  labelCount = "imagen(es)",
}: {
  urls: string[];
  onRemove: (index: number) => void;
  onAddMore: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputId: string;
  accept: string;
  multiple: boolean;
  uploading?: boolean;
  labelCount?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <label
          htmlFor={inputId}
          className="inline-flex cursor-pointer items-center rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          {urls.length > 0 ? "Agregar más" : "Seleccionar archivos"}
        </label>
        <input
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={onAddMore}
        />
        {urls.length > 0 && (
          <span className="text-xs font-medium text-slate-600">
            {urls.length} {labelCount} cargado{urls.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>
      {urls.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {urls.map((url, i) => (
            <div
              key={`${url}-${i}`}
              className="relative h-20 w-28 overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
            >
              <img
                src={url}
                alt=""
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="absolute right-1 top-1 rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white hover:bg-red-600"
                aria-label="Eliminar"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      {uploading && <p className="text-[11px] text-slate-500">Subiendo...</p>}
    </div>
  );
}

export function DocPreviews({
  urls,
  onRemove,
  onAddMore,
  inputId,
  accept,
  multiple,
  uploading,
  labelCount = "documento(s)",
}: {
  urls: string[];
  onRemove: (index: number) => void;
  onAddMore: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputId: string;
  accept: string;
  multiple: boolean;
  uploading?: boolean;
  labelCount?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <label
          htmlFor={inputId}
          className="inline-flex cursor-pointer items-center rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          {urls.length > 0 ? "Agregar más" : "Seleccionar archivos"}
        </label>
        <input
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={onAddMore}
        />
        {urls.length > 0 && (
          <span className="text-xs font-medium text-slate-600">
            {urls.length} {labelCount} cargado{urls.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>
      {urls.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {urls.map((url, i) => {
            const name = url.split("/").pop() || `Documento ${i + 1}`;
            return (
              <div
                key={`${url}-${i}`}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-slate-200 bg-white text-slate-400">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.5L21 7.5V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="max-w-[140px] truncate text-[11px] text-slate-700" title={name}>
                  {name}
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  className="shrink-0 rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white hover:bg-red-600"
                  aria-label="Eliminar"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}
      {uploading && <p className="text-[11px] text-slate-500">Subiendo...</p>}
    </div>
  );
}

export function ReorderableImagePreviews({
  urls,
  onRemove,
  onMove,
}: {
  urls: string[];
  onRemove: (index: number) => void;
  onMove: (fromIndex: number, toIndex: number) => void;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-wrap gap-2">
      {urls.map((url, i) => (
        <div
          key={`${url}-${i}`}
          draggable
          onDragStart={() => setDragIndex(i)}
          onDragEnd={() => setDragIndex(null)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (dragIndex == null || dragIndex === i) return;
            onMove(dragIndex, i);
            setDragIndex(null);
          }}
          className={`relative h-20 w-28 overflow-hidden rounded-lg border bg-slate-100 ${
            dragIndex === i ? "border-sky-400 ring-2 ring-sky-200" : "border-slate-200"
          }`}
          title="Arrastra para reordenar"
        >
          <img src={url} alt="" className="h-full w-full object-cover" />

          {i === 0 && (
            <span className="absolute left-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white">
              Principal
            </span>
          )}

          <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between gap-1">
            <button
              type="button"
              onClick={() => onMove(i, 0)}
              className="rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-semibold text-slate-800 hover:bg-white"
              aria-label="Hacer principal"
              title="Hacer principal"
            >
              Principal
            </button>
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white hover:bg-red-600"
              aria-label="Eliminar"
              title="Eliminar"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
