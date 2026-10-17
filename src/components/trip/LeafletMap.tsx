"use client";

import { useEffect, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import { Activity } from "@/types/trip";
import Image from "next/image";
import { Clock, DollarSign, MapPin } from "lucide-react";

interface LeafletMapProps {
  activities: (Activity & { dayNumber?: number; stopIndex: number })[];
  selectedActivityId: string | null;
  onSelectActivity: (id: string) => void;
}

// Helper component to auto-fit map view bounds when activities change
function MapBoundsUpdater({
  activities,
  selectedActivityId,
}: {
  activities: (Activity & { dayNumber?: number; stopIndex: number })[];
  selectedActivityId: string | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!activities || activities.length === 0) return;

    if (selectedActivityId) {
      const selected = activities.find((a) => a.id === selectedActivityId);
      if (selected && selected.lat && selected.lng) {
        map.flyTo([selected.lat, selected.lng], 15, {
          duration: 0.8,
        });
        return;
      }
    }

    const validPoints = activities.filter((a) => a.lat && a.lng);
    if (validPoints.length === 0) return;

    if (validPoints.length === 1) {
      map.setView([validPoints[0].lat, validPoints[0].lng], 14);
      return;
    }

    const bounds = L.latLngBounds(
      validPoints.map((a) => [a.lat, a.lng] as [number, number])
    );
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
  }, [activities, selectedActivityId, map]);

  return null;
}

// Function to generate numbered circular SVG pin
function createNumberedMarkerIcon(
  number: number,
  category: string,
  isSelected: boolean
) {
  const bgColor = isSelected ? "#4d3a28" : "#6e4f32";
  const ringColor = isSelected ? "#dec1a9" : "#ffffff";
  const scale = isSelected ? "1.25" : "1";

  return L.divIcon({
    className: "custom-leaflet-pin",
    html: `
      <div style="
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: ${bgColor};
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 13px;
        font-family: serif;
        box-shadow: 0 4px 12px rgba(0,0,0,0.35);
        border: 2.5px solid ${ringColor};
        transform: scale(${scale});
        transition: transform 0.2s ease;
      ">
        ${number}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
}

export default function LeafletMap({
  activities,
  selectedActivityId,
  onSelectActivity,
}: LeafletMapProps) {
  // Center calculation default: Kyoto coordinates if empty
  const defaultCenter: [number, number] = useMemo(() => {
    if (activities.length > 0 && activities[0].lat && activities[0].lng) {
      return [activities[0].lat, activities[0].lng];
    }
    return [35.0116, 135.7681]; // Kyoto center
  }, [activities]);

  // Route path coordinates
  const polylineCoords: [number, number][] = useMemo(() => {
    return activities
      .filter((a) => a.lat && a.lng)
      .map((a) => [a.lat, a.lng] as [number, number]);
  }, [activities]);

  return (
    <div className="w-full h-full min-h-[500px] rounded-2xl overflow-hidden relative shadow-inner border border-outline-variant/30">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full min-h-[500px] z-10"
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapBoundsUpdater
          activities={activities}
          selectedActivityId={selectedActivityId}
        />

        {/* Route Lines Connecting Stops */}
        {polylineCoords.length > 1 && (
          <Polyline
            positions={polylineCoords}
            pathOptions={{
              color: "#6e4f32",
              weight: 3.5,
              opacity: 0.85,
              dashArray: "6, 8",
            }}
          />
        )}

        {/* Numbered Pins for each stop */}
        {activities.map((act) => {
          if (!act.lat || !act.lng) return null;
          const isSelected = selectedActivityId === act.id;
          const icon = createNumberedMarkerIcon(
            act.stopIndex,
            act.category,
            isSelected
          );

          return (
            <Marker
              key={act.id}
              position={[act.lat, act.lng]}
              icon={icon}
              eventHandlers={{
                click: () => onSelectActivity(act.id),
              }}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-1 max-w-[220px] text-on-surface">
                  {act.imageUrl && (
                    <div className="w-full h-24 relative rounded-lg overflow-hidden mb-2">
                      <Image
                        src={act.imageUrl}
                        alt={act.name}
                        fill
                        className="object-cover"
                        sizes="220px"
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary text-[10px] font-bold">
                      Stop {act.stopIndex}
                    </span>
                    <span className="text-[10px] font-semibold text-secondary uppercase">
                      {act.category}
                    </span>
                  </div>
                  <h4 className="font-serif text-sm font-semibold text-primary leading-tight">
                    {act.name}
                  </h4>
                  <div className="mt-2 pt-2 border-t border-outline-variant/30 flex items-center justify-between text-[11px] text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-secondary" />
                      {act.durationMinutes} min
                    </span>
                    <span className="font-serif font-bold text-primary">
                      {act.estimatedCost > 0
                        ? `$${act.estimatedCost.toLocaleString()}`
                        : "Free Entry"}
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
