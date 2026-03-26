"use client";

import { useEffect, useMemo, useRef } from "react";
import mapboxgl, { type GeoJSONSource, type Map } from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";

import type { Property } from "@/lib/properties";

type Props = {
  properties: Property[];
  heightClassName?: string;
  styleId?: string;
};

function formatCOP(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function PropertyMap({
  properties,
  heightClassName = "h-[520px]",
  styleId = "light-v11",
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const geojson = useMemo(() => {
    return {
      type: "FeatureCollection" as const,
      features: properties.map((p) => ({
        type: "Feature" as const,
        properties: {
          id: p.remoteId ?? String(p.id),
          slug: p.slug,
          titulo: p.titulo,
          ciudad: p.ciudad,
          precio: p.precio,
          imagen: p.imagenes[0],
        },
        geometry: {
          type: "Point" as const,
          coordinates: [p.coords.lng, p.coords.lat],
        },
      })),
    };
  }, [properties]);

  useEffect(() => {
    if (!token) return;
    if (!containerRef.current) return;
    if (mapRef.current) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: `mapbox://styles/mapbox/${styleId ?? "light-v11"}`,
      center: [-74.08175, 4.60971],
      zoom: 4.2,
      pitch: 55,
      bearing: -20,
      antialias: true,
    });

    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }));

    map.on("load", () => {
      map.addSource("propiedades", {
        type: "geojson",
        data: geojson,
        cluster: true,
        clusterRadius: 50,
        clusterMaxZoom: 13,
      });

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "propiedades",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "rgba(56,189,248,0.65)",
            10,
            "rgba(59,130,246,0.65)",
            30,
            "rgba(37,99,235,0.75)",
          ],
          "circle-radius": ["step", ["get", "point_count"], 16, 10, 22, 30, 28],
          "circle-stroke-width": 2,
          "circle-stroke-color": "rgba(255,255,255,0.35)",
        },
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "propiedades",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
        paint: { "text-color": "rgba(255,255,255,0.92)" },
      });

      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "propiedades",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "rgba(255,255,255,0.92)",
          "circle-radius": 7,
          "circle-stroke-width": 2,
          "circle-stroke-color": "rgba(10,37,64,0.95)",
        },
      });

      const layers = map.getStyle().layers;
      const labelLayerId = layers?.find(
        (l) => l.type === "symbol" && (l.layout as any)?.["text-field"],
      )?.id;

      if (labelLayerId) {
        map.addLayer(
          {
            id: "3d-buildings",
            source: "composite",
            "source-layer": "building",
            filter: ["==", "extrude", "true"],
            type: "fill-extrusion",
            minzoom: 15,
            paint: {
              "fill-extrusion-color": "rgba(148,163,184,0.55)",
              "fill-extrusion-height": ["get", "height"],
              "fill-extrusion-base": ["get", "min_height"],
              "fill-extrusion-opacity": 0.75,
            },
          },
          labelLayerId,
        );
      }

      if (!map.getSource("mapbox-dem")) {
        map.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          tileSize: 512,
          maxzoom: 14,
        });
        map.setTerrain({ source: "mapbox-dem", exaggeration: 1.1 });
      }

      if (properties.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        properties.forEach((p) => {
          bounds.extend([p.coords.lng, p.coords.lat]);
        });
        map.fitBounds(bounds, {
          padding: 80,
          maxZoom: 13,
          duration: 800,
        });
      }
    });

    const popup = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: true,
      maxWidth: "320px",
      className: "forez-map-popup",
    });

    function openPopup(feature: any) {
      const coords = feature.geometry.coordinates.slice();
      const titulo = String(feature.properties.titulo ?? "");
      const ciudad = String(feature.properties.ciudad ?? "");
      const precio = Number(feature.properties.precio ?? 0);
      const imagen = String(feature.properties.imagen ?? "");
      const propPath = String(feature.properties.slug ?? feature.properties.id ?? "");

      const html = `
        <div style="display:flex; gap:12px; align-items:flex-start; background:#020617; border-radius:14px; padding:10px 12px; color:#e5e7eb; box-shadow:0 14px 38px rgba(15,23,42,0.7);">
          <img src="${imagen}" alt="${titulo}" style="width:92px; height:64px; object-fit:cover; border-radius:10px; border:1px solid rgba(148,163,184,0.35);" />
          <div style="min-width:0;">
            <div style="font-size:12px; font-weight:700; color:#f9fafb; line-height:1.2; margin-bottom:4px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${titulo}</div>
            <div style="font-size:11px; color:rgba(148,163,184,0.95); margin-bottom:6px;">${ciudad}</div>
            <div style="font-size:12px; font-weight:700; color:#38bdf8; margin-bottom:8px;">${formatCOP(
              precio,
            )}</div>
            <a href="/propiedades/${propPath}" style="display:inline-block; font-size:12px; font-weight:700; color:#0f172a; background:#e5f3ff; padding:7px 10px; border-radius:999px; text-decoration:none;">Ver detalles</a>
          </div>
        </div>
      `;

      popup.setLngLat(coords).setHTML(html).addTo(map);
    }

    map.on("click", "clusters", (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["clusters"],
      });
      const clusterId = features[0]?.properties?.cluster_id;
      const source = map.getSource("propiedades") as GeoJSONSource | undefined;
      if (!source || clusterId == null) return;

      source.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        if (typeof zoom !== "number") return;
        const c = (features[0].geometry as any).coordinates;
        map.easeTo({ center: c, zoom });
      });
    });

    map.on("click", "unclustered-point", (e) => {
      const feature = e.features?.[0];
      if (!feature) return;
      openPopup(feature);
    });

    map.on("mouseenter", "clusters", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "clusters", () => {
      map.getCanvas().style.cursor = "";
    });
    map.on("mouseenter", "unclustered-point", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "unclustered-point", () => {
      map.getCanvas().style.cursor = "";
    });

    return () => {
      popup.remove();
      map.remove();
      mapRef.current = null;
    };
  }, [geojson, token]);

  if (!token) {
    return (
      <div
        className={`${heightClassName} w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm`}
      >
        <p className="text-sm font-semibold text-slate-900">
          Configura Mapbox para ver el mapa 3D
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Agrega <span className="font-mono">NEXT_PUBLIC_MAPBOX_TOKEN</span> en{" "}
          <span className="font-mono">.env.local</span> y reinicia el servidor.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className={`${heightClassName} w-full overflow-hidden rounded-2xl border border-slate-200 shadow-sm`}
      />
    </div>
  );
}

