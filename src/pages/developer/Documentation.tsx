import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Box,
  Code2,
  KeyRound,
  ShieldCheck,
  Truck,
  Webhook,
} from "lucide-react";

import Layout from "@/layouts/HomePageLayout";
import { Button } from "@/components/ui/button";
import { hasAuthSession } from "@/lib/authSession";

const guides = [
  {
    title: "Authentication",
    description: "Use scoped API keys to authorize requests from server-side integrations.",
    icon: KeyRound,
  },
  {
    title: "Create a delivery",
    description: "Quote, book, and pay for deliveries across verified logistics partners.",
    icon: Truck,
  },
  {
    title: "Track shipments",
    description: "Read delivery progress, task events, and recipient status updates.",
    icon: Box,
  },
  {
    title: "Webhooks",
    description: "Receive booking, payment, and delivery lifecycle events in your app.",
    icon: Webhook,
  },
];

const endpoints = [
  {
    method: "POST",
    path: "/api/v1/bookings",
    label: "Create a booking",
    description: "Create a shipment request with pickup, delivery, package, and courier details.",
    request: `{
  "pickupAddress": "12 Admiralty Way, Lekki Phase 1, Lagos",
  "deliveryAddress": "8 Allen Avenue, Ikeja, Lagos",
  "packageType": "Parcel",
  "packageWeight": 2.5,
  "serviceLevel": "STANDARD",
  "recipientName": "Ada Okafor",
  "recipientPhone": "+2348012345678"
}`,
    response: `{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": "booking_01J8ZK4N2Q5Y8W7P6T3R9A0B1C",
    "trackingId": "GSD-849302",
    "status": "PENDING_PAYMENT",
    "amount": 4500,
    "currency": "NGN"
  }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/bookings/{id}",
    label: "Retrieve booking details",
    description: "Fetch a booking by its internal booking ID after creation.",
    request: `GET /api/v1/bookings/booking_01J8ZK4N2Q5Y8W7P6T3R9A0B1C
Authorization: Bearer \${GOSENDEET_API_KEY}`,
    response: `{
  "success": true,
  "data": {
    "id": "booking_01J8ZK4N2Q5Y8W7P6T3R9A0B1C",
    "trackingId": "GSD-849302",
    "status": "DISPATCHED",
    "pickupAddress": "12 Admiralty Way, Lekki Phase 1, Lagos",
    "deliveryAddress": "8 Allen Avenue, Ikeja, Lagos",
    "createdAt": "2026-07-14T09:30:00Z"
  }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/tasks/{trackingId}",
    label: "Track public dispatch state",
    description: "Read task-level movement for a shipment using the customer-facing tracking ID.",
    request: `GET /api/v1/tasks/GSD-849302
Authorization: Bearer \${GOSENDEET_API_KEY}`,
    response: `{
  "success": true,
  "data": {
    "trackingId": "GSD-849302",
    "status": "IN_TRANSIT",
    "tasks": [
      {
        "id": "task_pickup_01",
        "taskType": "PICKUP",
        "status": "COMPLETED",
        "completedAt": "2026-07-14T10:15:00Z"
      },
      {
        "id": "task_dropoff_01",
        "taskType": "DROPOFF",
        "status": "STARTED",
        "eta": "2026-07-14T13:00:00Z"
      }
    ]
  }
}`,
  },
  {
    method: "POST",
    path: "/api/v1/payments/initialize",
    label: "Initialize payment",
    description: "Start payment collection for a booking and return the hosted authorization URL.",
    request: `{
  "bookingId": "booking_01J8ZK4N2Q5Y8W7P6T3R9A0B1C",
  "email": "buyer@example.com",
  "amount": 4500,
  "callbackUrl": "https://yourapp.com/payments/callback"
}`,
    response: `{
  "success": true,
  "message": "Payment initialized",
  "data": {
    "reference": "pay_GSD_849302_001",
    "authorizationUrl": "https://checkout.paystack.com/example",
    "status": "PENDING"
  }
}`,
  },
];

type DeveloperDocumentationContentProps = {
  showHero?: boolean;
};

const CodeBlock = ({ value }: { value: string }) => (
  <pre className="overflow-x-auto rounded-xl bg-[#061B16] p-4 text-xs leading-6 text-green-50 md:text-sm">
    <code>{value}</code>
  </pre>
);

export const DeveloperDocumentationContent = ({
  showHero = !hasAuthSession(),
}: DeveloperDocumentationContentProps) => (
  <div className="bg-neutral100 text-blue100">
    {showHero && (
      <section className="bg-white px-6 py-14 md:px-20 md:py-18">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 flex w-fit items-center gap-2 rounded-full border border-green600 bg-green300 px-4 py-2 text-xs font-bold uppercase text-green800">
            <BookOpen className="size-4" />
            Developer Documentation
          </p>
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
                Build logistics workflows on Gosendeet.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-neutral600 md:text-lg">
                Integrate bookings, dispatch tracking, payments, and delivery events with a secure API surface built for Nigerian logistics operations.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link to="/domain/auth">
                  <Button className="bg-green100 hover:bg-green800">
                    Get API access
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
                <Link to="/status">
                  <Button variant="outline">View platform status</Button>
                </Link>
              </div>
            </div>
            <div className="rounded-2xl border border-neutral300 bg-[#061B16] p-5 font-mono text-sm text-green-50 shadow-lg">
              <div className="mb-4 flex items-center gap-2 text-xs text-green-200">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-2">booking-request.ts</span>
              </div>
              <pre className="overflow-x-auto whitespace-pre-wrap leading-7">
{`const response = await fetch("/api/v1/bookings", {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${GOSENDEET_API_KEY}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    pickupAddress,
    deliveryAddress,
    packageType: "Parcel",
  }),
});`}
              </pre>
            </div>
          </div>
        </div>
      </section>
    )}

    <section className="px-6 py-12 md:px-20">
      <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-4">
        {guides.map((guide) => {
          const Icon = guide.icon;
          return (
            <article key={guide.title} className="rounded-xl border border-neutral300 bg-white p-5">
              <Icon className="mb-4 size-6 text-green500" />
              <h2 className="font-bold">{guide.title}</h2>
              <p className="mt-2 text-sm leading-6 text-neutral600">{guide.description}</p>
            </article>
          );
        })}
      </div>
    </section>

    <section className="px-6 pb-12 md:px-20">
      <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-neutral300 bg-white p-5 md:p-7">
          <div className="mb-4 flex items-center gap-3">
            <ShieldCheck className="size-5 text-green500" />
            <h2 className="text-xl font-bold">Client apps</h2>
          </div>
          <p className="text-sm leading-6 text-neutral600">
            A client app represents the product, website, backend service, or internal tool that will use the GoSendeet API. Registering a client app gives your team one reviewed integration record, so API credentials can be issued, scoped, audited, and revoked without affecting unrelated apps.
          </p>
          <div className="mt-5 rounded-xl bg-green300 p-4 text-sm leading-6 text-green900">
            Create a client app first. After it is approved, generate API credentials for that specific app from the developer dashboard.
          </div>
        </article>

        <article className="rounded-2xl border border-neutral300 bg-white p-5 md:p-7">
          <div className="mb-4 flex items-center gap-3">
            <KeyRound className="size-5 text-green500" />
            <h2 className="text-xl font-bold">API credentials</h2>
          </div>
          <p className="text-sm leading-6 text-neutral600">
            API credentials are bearer keys tied to an approved client app. Each credential can be limited to scopes such as bookings, tasks, payments, and webhooks. Store the secret only on your server, never in browser code or mobile apps.
          </p>
          <CodeBlock
            value={`Authorization: Bearer \${GOSENDEET_API_KEY}
Content-Type: application/json`}
          />
        </article>
      </div>
    </section>

    <section className="px-6 pb-16 md:px-20">
      <div className="mx-auto max-w-6xl rounded-2xl border border-neutral300 bg-white p-5 md:p-7">
        <div className="mb-5 flex items-center gap-3">
          <Code2 className="size-5 text-green500" />
          <h2 className="text-xl font-bold">Core endpoints</h2>
        </div>
        <p className="mb-5 max-w-3xl text-sm leading-6 text-neutral600">
          All protected API calls should include your scoped bearer credential. The examples below show the expected request format and the shape of a successful response.
        </p>
        <div className="space-y-5">
          {endpoints.map((endpoint) => (
            <article key={endpoint.path} className="rounded-xl border border-neutral300 p-4 md:p-5">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="w-fit rounded-full bg-green300 px-3 py-1 text-xs font-bold text-green800">
                    {endpoint.method}
                  </span>
                  <code className="text-sm font-semibold text-blue100">{endpoint.path}</code>
                </div>
                <span className="text-sm font-semibold text-neutral600">{endpoint.label}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-neutral600">{endpoint.description}</p>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase text-neutral500">Request format</p>
                  <CodeBlock value={endpoint.request} />
                </div>
                <div>
                  <p className="mb-2 text-xs font-bold uppercase text-neutral500">Successful response</p>
                  <CodeBlock value={endpoint.response} />
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-6 flex items-start gap-3 rounded-xl bg-green300 p-4 text-sm text-green900">
          <ShieldCheck className="mt-0.5 size-5 shrink-0" />
          <p>
            Keep API keys on your server and rotate credentials from the developer dashboard when team access changes.
          </p>
        </div>
      </div>
    </section>
  </div>
);

const DeveloperDocumentation = () => (
  <Layout>
    <DeveloperDocumentationContent />
  </Layout>
);

export default DeveloperDocumentation;
