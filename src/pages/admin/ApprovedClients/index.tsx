import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Building2, CheckCircle2, Clock3, Plus, XCircle } from "lucide-react";
import { IoSearchOutline } from "react-icons/io5";
import { toast } from "sonner";

import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { BaseModal } from "@/components/ui/base-modal";
import { useGetApprovedClients } from "@/queries/admin/useApprovedClients";
import {
  approveClient,
  createApprovedClient,
  rejectClient,
  type ApprovedClient,
} from "@/services/approvedClients";

const formatDateTime = (value: string) => {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const isApprovedStatus = (status: string) => status === "APPROVED";
const isRejectedStatus = (status: string) => status === "REJECTED";
const isPendingStatus = (status: string) =>
  !isApprovedStatus(status) && !isRejectedStatus(status);

const ApprovedClients = () => {
  const queryClient = useQueryClient();
  const { data: clients, isLoading, isError } = useGetApprovedClients();

  const [createOpen, setCreateOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");

  const refreshClients = () =>
    queryClient.invalidateQueries({ queryKey: ["approved_clients"] });

  const stats = {
    total: clients.length,
    pending: clients.filter((client) => isPendingStatus(client.status)).length,
    approved: clients.filter((client) => isApprovedStatus(client.status)).length,
    rejected: clients.filter((client) => isRejectedStatus(client.status)).length,
  };

  const filteredClients = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return clients.filter((client) => {
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "approved"
            ? isApprovedStatus(client.status)
            : statusFilter === "rejected"
              ? isRejectedStatus(client.status)
              : isPendingStatus(client.status);

      if (!matchesStatus) {
        return false;
      }

      if (!search) {
        return true;
      }

      return [client.name, client.email, client.id, client.description]
        .join(" ")
        .toLowerCase()
        .includes(search);
    });
  }, [clients, searchTerm, statusFilter]);

  const createMutation = useMutation({
    mutationFn: createApprovedClient,
    onSuccess: async () => {
      await refreshClients();
      setCreateOpen(false);
      setName("");
      setEmail("");
      setDescription("");
      toast.success("Client created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Unable to create client");
    },
  });

  const approveMutation = useMutation({
    mutationFn: approveClient,
    onSuccess: async () => {
      await refreshClients();
      toast.success("Client approved successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Unable to approve client");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectClient,
    onSuccess: async () => {
      await refreshClients();
      toast.success("Client rejected successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Unable to reject client");
    },
  });

  const handleCreate = () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      toast.error("Client name is required");
      return;
    }

    if (!trimmedEmail) {
      toast.error("Client email is required");
      return;
    }

    createMutation.mutate({
      name: trimmedName,
      email: trimmedEmail,
      description: trimmedDescription,
    });
  };

  const handleApprove = (client: ApprovedClient) => {
    approveMutation.mutate(client.id);
  };

  const handleReject = (client: ApprovedClient) => {
    const confirmed = window.confirm(
      `Reject ${client.name || client.email}? This client will no longer be available for credential creation.`,
    );

    if (!confirmed) {
      return;
    }

    rejectMutation.mutate(client.id);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="mb-2 font-inter text-[20px] font-semibold text-brand">
            Approved Clients
          </h2>
          <p className="text-sm text-neutral600">
            Create integration clients, review their status, and approve them
            before issuing API credentials.
          </p>
        </div>

        <Button onClick={() => setCreateOpen(true)}>
          <Plus size={16} />
          Create client
        </Button>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-neutral200 p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-neutral500">Total clients</p>
            <Building2 className="text-brand" size={18} />
          </div>
          <p className="font-inter text-2xl font-semibold text-brand">
            {stats.total}
          </p>
        </div>

        <div className="rounded-2xl bg-neutral200 p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-neutral500">Pending review</p>
            <Clock3 className="text-amber-700" size={18} />
          </div>
          <p className="font-inter text-2xl font-semibold text-brand">
            {stats.pending}
          </p>
        </div>

        <div className="rounded-2xl bg-neutral200 p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-neutral500">Approved</p>
            <CheckCircle2 className="text-green-700" size={18} />
          </div>
          <p className="font-inter text-2xl font-semibold text-brand">
            {stats.approved}
          </p>
        </div>

        <div className="rounded-2xl bg-neutral200 p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-neutral500">Rejected</p>
            <XCircle className="text-red-700" size={18} />
          </div>
          <p className="font-inter text-2xl font-semibold text-brand">
            {stats.rejected}
          </p>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-3">
          {[
            { key: "all", label: "All" },
            { key: "pending", label: "Pending" },
            { key: "approved", label: "Approved" },
            { key: "rejected", label: "Rejected" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() =>
                setStatusFilter(
                  tab.key as "all" | "pending" | "approved" | "rejected",
                )
              }
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                statusFilter === tab.key
                  ? "bg-neutral300 text-neutral800"
                  : "bg-neutral200 text-neutral500"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-[40px] items-center gap-2 rounded-lg border-2 px-2 py-2">
            <IoSearchOutline className="text-neutral500" />
            <input
              type="text"
              value={searchTerm}
              role="search"
              className="w-[220px] border-0 text-sm text-neutral600 outline-0"
              placeholder="Search client"
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <Button variant="outline" size="sm" onClick={() => refreshClients()}>
            Refresh
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {isLoading ? (
          <div className="p-10">
            <Spinner />
          </div>
        ) : isError ? (
          <div className="p-10 text-center text-sm text-red-600">
            We couldn&apos;t load clients right now.
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="p-10 text-center text-sm text-neutral500">
            No clients match the current filters.
          </div>
        ) : (
          <>
            <div className="hidden grid-cols-[1.4fr_1fr_1.2fr_1fr_1fr] gap-4 border-b border-neutral200 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-neutral500 lg:grid">
              <p>Client</p>
              <p>Status</p>
              <p>Created</p>
              <p>Approved</p>
              <p>Actions</p>
            </div>

            <div className="divide-y divide-neutral200">
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  className="grid gap-4 px-6 py-5 lg:grid-cols-[1.4fr_1fr_1.2fr_1fr_1fr] lg:items-center"
                >
                  <div>
                    <p className="font-medium text-brand">{client.name || "Client"}</p>
                    <p className="mt-1 text-sm text-neutral500">
                      {client.email || "No email"}
                    </p>
                    <p className="mt-2 break-all text-xs text-neutral500">
                      ID: {client.id}
                    </p>
                    {client.description && (
                      <p className="mt-2 text-sm text-neutral600">
                        {client.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        isApprovedStatus(client.status)
                          ? "bg-green-50 text-green-700"
                          : isRejectedStatus(client.status)
                            ? "bg-red-50 text-red-700"
                            : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {isApprovedStatus(client.status)
                        ? "Approved"
                        : isRejectedStatus(client.status)
                          ? "Rejected"
                          : "Pending"}
                    </span>
                  </div>

                  <div className="text-sm text-neutral600">
                    {formatDateTime(client.createdAt)}
                  </div>

                  <div className="text-sm text-neutral600">
                    {formatDateTime(client.approvedAt)}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleApprove(client)}
                      disabled={
                        isApprovedStatus(client.status) || approveMutation.isPending
                      }
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleReject(client)}
                      disabled={
                        isRejectedStatus(client.status) || rejectMutation.isPending
                      }
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <BaseModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Create approved client"
        description="Register a client integration first, then approve it before generating credentials."
        footer={
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setCreateOpen(false)}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleCreate} loading={createMutation.isPending}>
              Create client
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-brand">
              Client name
            </label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Acme Logistics"
              className="w-full rounded-xl border border-neutral300 px-4 py-3 text-sm outline-none transition focus:border-brand"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-brand">
              Contact email
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="ops@acme.com"
              className="w-full rounded-xl border border-neutral300 px-4 py-3 text-sm outline-none transition focus:border-brand"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-brand">
              Description
            </label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              placeholder="Short description of the client integration"
              className="w-full rounded-xl border border-neutral300 px-4 py-3 text-sm outline-none transition focus:border-brand"
            />
          </div>
        </div>
      </BaseModal>
    </div>
  );
};

export default ApprovedClients;
