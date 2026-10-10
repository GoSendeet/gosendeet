export interface RoutePageConfig {
  slug: string;
  from: string;
  to: string;
  // Values passed as routePreset to the calculator
  pickupPreset: string;
  destinationPreset: string;
  title: string;
  description: string;
  h1: string;
  h1Accent: string;
  pill: string;
  subtitle: string;
  stats: { label: string; value: string }[];
  about: string;
  useCases: string[];
  relatedSlugs: string[];
}

const ROUTE_CONFIGS: Record<string, RoutePageConfig> = {
  "lagos-to-ibadan": {
    slug: "lagos-to-ibadan",
    from: "Lagos",
    to: "Ibadan",
    pickupPreset: "Lagos",
    destinationPreset: "Ibadan",
    title: "Lagos to Ibadan Delivery | Courier Prices & Booking – GoSendeet",
    description:
      "Compare courier prices for Lagos to Ibadan delivery. Book same-day or next-day pickup from DHL, GIG, FEZ and more. Instant quotes, no account needed.",
    h1: "Lagos to Ibadan",
    h1Accent: "Delivery",
    pill: "Lagos → Ibadan",
    subtitle:
      "Compare courier prices, book a pickup and track your parcel from Lagos to Ibadan in minutes. No contracts, no hidden fees.",
    stats: [
      { label: "Typical distance", value: "~130 km" },
      { label: "Estimated delivery", value: "3 to 6 hrs" },
      { label: "Couriers available", value: "6+" },
    ],
    about:
      "The Lagos to Ibadan corridor is one of the busiest freight routes in Nigeria. GoSendeet lets you compare live prices from multiple couriers on this route so you always get the best rate. Whether you are sending a small parcel, business documents or a larger package, our verified courier partners offer same-day collection and delivery on most days of the week.",
    useCases: [
      "Personal parcels and gifts between family",
      "Business documents and contracts",
      "E-commerce orders for Ibadan buyers",
      "Product samples and trade shipments",
    ],
    relatedSlugs: ["lagos-to-oyo"],
  },

  "lagos-to-oyo": {
    slug: "lagos-to-oyo",
    from: "Lagos",
    to: "Oyo State",
    pickupPreset: "Lagos",
    destinationPreset: "Ibadan",
    title: "Lagos to Oyo State Delivery | Courier Prices – GoSendeet",
    description:
      "Book delivery from Lagos to Oyo State with GoSendeet. Compare same-day and next-day courier prices to Ibadan and surrounding areas. Instant quotes, no account needed.",
    h1: "Lagos to Oyo State",
    h1Accent: "Delivery",
    pill: "Lagos → Oyo State",
    subtitle:
      "Send parcels from Lagos to Oyo State with verified courier partners. Compare live prices and book a doorstep pickup in minutes.",
    stats: [
      { label: "Typical distance", value: "~135 km" },
      { label: "Estimated delivery", value: "3 to 6 hrs" },
      { label: "Coverage in Oyo", value: "Ibadan" },
    ],
    about:
      "GoSendeet currently supports deliveries to Ibadan, the commercial capital of Oyo State and one of the largest cities in West Africa. The Lagos to Oyo State route is served by multiple verified courier partners who offer same-day and next-day collection from your location in Lagos. Use our price calculator to compare options before you book.",
    useCases: [
      "Personal deliveries to family in Ibadan",
      "Business shipments between Lagos and Oyo State",
      "E-commerce orders dispatched to Ibadan addresses",
      "Documents and legal paperwork",
    ],
    relatedSlugs: ["lagos-to-ibadan"],
  },
};

export default ROUTE_CONFIGS;
