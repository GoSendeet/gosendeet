import { CheckCircle2, Clock3, RadioTower, Rss, ShieldCheck } from "lucide-react";

import Layout from "@/layouts/HomePageLayout";
import { Button } from "@/components/ui/button";

const groups = [
  {
    title: "Platform & Infrastructure",
    uptime: "100.0%",
    services: ["API", "Website", "Webhooks", "Email Notifications"],
  },
  {
    title: "Delivery Operations",
    uptime: "99.8%",
    services: ["Quote Engine", "Booking Flow", "Dispatch Tracking", "Partner Assignment"],
  },
  {
    title: "Payments",
    uptime: "99.9%",
    services: ["Checkout", "Payment Verification", "Receipts", "Refund Requests"],
  },
];

const days = Array.from({ length: 32 }, (_, index) => index);

const StatusPage = () => (
  <Layout>
    <div className="bg-neutral100 px-6 py-10 text-blue100 md:px-20 md:py-14">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-col gap-5 border-b border-neutral300 pb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl bg-green300 text-green700">
                <RadioTower className="size-5" />
              </span>
              <div>
                <p className="text-2xl font-black">Gosendeet Status</p>
                <p className="text-sm text-neutral600">Live platform health and uptime</p>
              </div>
            </div>
            <div className="flex w-fit items-center gap-2 rounded-full bg-green300 px-4 py-2 text-sm font-bold text-green800">
              <CheckCircle2 className="size-4" />
              All systems operational
            </div>
          </div>
          <Button variant="outline" className="w-fit">
            <Rss className="size-4" />
            Get updates
          </Button>
        </header>

        <section className="space-y-5">
          {groups.map((group) => (
            <article key={group.title} className="rounded-2xl border border-neutral300 bg-white p-5 shadow-sm">
              <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-lg font-bold">{group.title}</h1>
                  <p className="text-sm text-neutral600">{group.uptime} uptime over the last 90 days</p>
                </div>
                <span className="flex w-fit items-center gap-2 rounded-full bg-green300 px-3 py-1 text-xs font-bold text-green800">
                  <ShieldCheck className="size-4" />
                  Operational
                </span>
              </div>

              <div className="space-y-4">
                {group.services.map((service, serviceIndex) => (
                  <div key={service} className="rounded-xl border border-neutral200 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{service}</p>
                        <p className="text-xs text-neutral600">100% uptime today</p>
                      </div>
                      <span className="text-sm font-semibold text-green700">Operational</span>
                    </div>
                    <div className="flex h-8 items-end gap-1" aria-hidden="true">
                      {days.map((day) => (
                        <span
                          key={day}
                          className={`flex-1 rounded-sm ${
                            (day + serviceIndex) % 17 === 0
                              ? "h-5 bg-amber-300"
                              : "h-8 bg-green500"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-neutral500">
                      <span>90 days ago</span>
                      <span>Today</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-2xl border border-neutral300 bg-white p-5">
          <div className="flex items-center gap-3">
            <Clock3 className="size-5 text-green500" />
            <h2 className="font-bold">Recent notices</h2>
          </div>
          <p className="mt-3 text-sm text-neutral600">
            No incidents reported. Delivery, payment, tracking, and webhook systems are operating normally.
          </p>
        </section>
      </div>
    </div>
  </Layout>
);

export default StatusPage;
