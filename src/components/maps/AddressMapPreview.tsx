import { MapPin } from "lucide-react";

type Props = {
  lat: number;
  lng: number;
  /** Optional label shown in the header bar, e.g. the address that was geocoded. */
  label?: string;
};

/** Half-width of the bounding box in degrees — controls the zoom level. ~900m per side. */
const BBOX_DELTA = 0.008;

/**
 * Embeds an OpenStreetMap tile with a marker at the given coordinates.
 * No API key required — uses OSM's free embed endpoint.
 * Reusable: drop it anywhere you need to confirm a geocoded location.
 */
const AddressMapPreview = ({ lat, lng, label }: Props) => {
  const bbox = [
    lng - BBOX_DELTA,
    lat - BBOX_DELTA,
    lng + BBOX_DELTA,
    lat + BBOX_DELTA,
  ].join(",");

  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <div className="rounded-xl overflow-hidden border border-emerald-100 shadow-sm">
      <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border-b border-emerald-100">
        <MapPin size={12} className="text-emerald-500 shrink-0" />
        <p className="text-[11px] font-medium text-emerald-700 truncate">
          {label ?? "Confirm the pin matches your business location"}
        </p>
      </div>
      <iframe
        title="Address location preview"
        src={src}
        width="100%"
        height="220"
        loading="lazy"
        style={{ border: 0, display: "block" }}
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

export default AddressMapPreview;
