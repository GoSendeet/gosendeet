import { useEffect } from "react";
import { createPortal } from "react-dom";
import { MapPin, Navigation2, Store, X } from "lucide-react";
import { GoogleMap, Marker } from "@react-google-maps/api";

export interface DropOffStation {
  stationId: string;
  stationName: string;
  address: string;
  state: string;
  latitude?: number;
  longitude?: number;
}

interface Props {
  open: boolean;
  station: DropOffStation | null;
  onClose: () => void;
}

const mapStyles: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#f8fafc" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#475569" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f8fafc" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#e2e8f0" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#cbd5e1" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#bae6fd" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#dcfce7" }] },
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
];

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  scrollwheel: false,
  gestureHandling: "cooperative",
  styles: mapStyles,
};

const MARKER_SVG = encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="52" viewBox="0 0 40 52">
    <ellipse cx="20" cy="49" rx="7" ry="3" fill="rgba(0,107,79,0.2)"/>
    <path d="M20 1C10.059 1 2 9.059 2 19c0 14 18 32 18 32S38 33 38 19C38 9.059 29.941 1 20 1z" fill="#006B4F" stroke="white" stroke-width="2"/>
    <circle cx="20" cy="19" r="8" fill="white"/>
    <circle cx="20" cy="19" r="4" fill="#006B4F"/>
  </svg>
`);

export default function DropOffStationDrawer({ open, station, onClose }: Props) {
  const hasCoords =
    station != null &&
    typeof station.latitude === "number" &&
    typeof station.longitude === "number" &&
    (station.latitude !== 0 || station.longitude !== 0);

  const center = hasCoords
    ? { lat: station!.latitude!, lng: station!.longitude! }
    : null;

  const directionsUrl = station
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        center ? `${center.lat},${center.lng}` : (station.address || station.stationName)
      )}`
    : "#";

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-[420px] flex-col overflow-hidden bg-white shadow-2xl transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
            {/* Header */}
            <div className="bg-gradient-to-br from-[#006B4F] via-[#007A5A] to-[#009966] px-6 pb-6 pt-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white/90">
                    <Store className="h-2.5 w-2.5" />
                    Drop-off Location
                  </span>
                  <h2 className="mt-2 text-xl font-extrabold leading-tight text-white">
                    {station?.stationName || "Nearest Station"}
                  </h2>
                  {station?.state && (
                    <p className="mt-0.5 text-sm font-medium text-white/75">
                      {station.state} Station
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="ml-4 mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Map */}
            <div className="relative w-full shrink-0" style={{ height: 260 }}>
              {center ? (
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={center}
                  zoom={16}
                  options={mapOptions}
                >
                  <Marker
                    position={center}
                    icon={{
                      url: `data:image/svg+xml;charset=utf-8,${MARKER_SVG}`,
                      scaledSize: new window.google.maps.Size(40, 52),
                      anchor: new window.google.maps.Point(20, 52),
                    }}
                  />
                </GoogleMap>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#F0FDF4]">
                  <MapPin className="h-10 w-10 text-brand/25" />
                  <p className="text-sm font-medium text-gray-400">Map unavailable</p>
                </div>
              )}
              {/* soft fade at the bottom so the map bleeds into the content */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent" />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {/* Address card */}
              <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#DCFCE7]">
                    <MapPin className="h-5 w-5 text-brand" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-[#0F172A] leading-snug">
                      {station?.stationName}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
                      {station?.address || "Address unavailable"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Info tip */}
              <div className="mt-3 rounded-2xl border border-[#D1FAE5] bg-[#F0FDF4] px-4 py-3.5">
                <p className="text-xs font-bold text-brand">What to do at this location</p>
                <p className="mt-1 text-xs leading-relaxed text-[#475569]">
                  Bring your sealed and labelled package to this GIG service centre. Staff will
                  issue a waybill and confirm your shipment is booked.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-[#E2E8F0] bg-white px-5 py-4">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-4 text-sm font-extrabold text-white shadow-[0_8px_24px_rgba(0,107,79,0.22)] transition-all hover:bg-[#005C43] hover:shadow-[0_12px_28px_rgba(0,107,79,0.28)] active:scale-[0.98]"
              >
                <Navigation2 className="h-4 w-4" />
                Get Directions
              </a>
            </div>
      </div>
    </>,
    document.body,
  );
}
