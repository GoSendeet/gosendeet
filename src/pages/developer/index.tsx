import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useOutletContext } from "react-router-dom";
import { KeyRound, Plus, Send, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Credentials from "@/pages/admin/Credentials";
import { useGetApprovedClients } from "@/queries/admin/useApprovedClients";
import { createApprovedClient } from "@/services/approvedClients";
import { DeveloperDocumentationContent } from "./Documentation";

interface DeveloperContext {
  activeTab: string;
}

const DeveloperDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { activeTab } = useOutletContext<DeveloperContext>();
  const { data: clients, isLoading } = useGetApprovedClients();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");

  const createClient = useMutation({
    mutationFn: createApprovedClient,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["approved_clients"] });
      setName("");
      setEmail("");
      setDescription("");
      toast.success("Client app submitted");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Unable to submit client app");
    },
  });

  const handleCreateClient = () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Client name and email are required");
      return;
    }
    createClient.mutate({
      name: name.trim(),
      email: email.trim(),
      description: description.trim() || undefined,
    });
  };

  const approvedCount = clients.filter((client) => client.status === "APPROVED").length;
  const pendingCount = clients.filter((client) => client.status === "PENDING").length;

  if (activeTab === "documentation") {
    return <DeveloperDocumentationContent />;
  }

  return (
    <div className="md:px-20 px-6 py-10 bg-neutral100 min-h-screen space-y-6">
      <section className="bg-white border border-neutral200 rounded-xl p-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-2xl font-bold text-brand">Developer Dashboard</p>
          <p className="text-sm text-neutral600 mt-1">
            Manage client apps, generate scoped API keys, and book orders for testing or production workflows.
          </p>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white border border-neutral200 rounded-xl p-5">
          <ShieldCheck className="text-brand mb-3" />
          <p className="font-bold text-neutral900">Client apps</p>
          <p className="text-sm text-neutral600 mt-1">{approvedCount} approved, {pendingCount} pending</p>
        </div>
        <div className="bg-white border border-neutral200 rounded-xl p-5">
          <KeyRound className="text-brand mb-3" />
          <p className="font-bold text-neutral900">Scoped API keys</p>
          <p className="text-sm text-neutral600 mt-1">Use bookings, tasks, and payment scopes.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/cost-calculator")}
          className="bg-white border border-neutral200 rounded-xl p-5 text-left hover:border-brand"
        >
          <Send className="text-brand mb-3" />
          <p className="font-bold text-neutral900">Order booking</p>
          <p className="text-sm text-neutral600 mt-1">Developers can create and pay for orders.</p>
        </button>
      </div>

      <section className="bg-white border border-neutral200 rounded-xl p-5 space-y-4">
        <div>
          <p className="text-lg font-bold text-brand">Register Client App</p>
          <p className="text-sm text-neutral600">
            Create a client app, then generate scoped API credentials after approval.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Client app name" />
          <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Contact email" />
        </div>
        <Textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What will this app use the API for?"
          rows={3}
        />
        <Button onClick={handleCreateClient} loading={createClient.isPending}>
          <Plus className="size-4" />
          Submit client app
        </Button>
      </section>

      <section className="bg-white border border-neutral200 rounded-xl p-5">
        <p className="text-lg font-bold text-brand mb-4">Client Apps</p>
        {isLoading ? (
          <p className="text-sm text-neutral500">Loading client apps...</p>
        ) : clients.length === 0 ? (
          <p className="text-sm text-neutral500">No client apps yet.</p>
        ) : (
          <div className="divide-y divide-neutral200">
            {clients.map((client) => (
              <div key={client.id} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <p className="font-semibold text-neutral900">{client.name}</p>
                  <p className="text-sm text-neutral500">{client.email}</p>
                  {client.description && <p className="text-sm text-neutral600 mt-1">{client.description}</p>}
                </div>
                <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {client.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white border border-neutral200 rounded-xl p-5">
        <Credentials />
      </section>
    </div>
  );
};

export default DeveloperDashboard;
