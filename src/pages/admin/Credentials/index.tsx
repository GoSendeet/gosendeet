import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { KeyRound, Plus, RefreshCw, ShieldCheck } from "lucide-react";
import { IoSearchOutline } from "react-icons/io5";
import { toast } from "sonner";

import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { BaseModal } from "@/components/ui/base-modal";
import { MultiSelect } from "@/components/ui/multi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetApprovedClients } from "@/queries/admin/useApprovedClients";
import { useGetClientCredentials } from "@/queries/admin/useClientCredentials";
import { type ApprovedClient } from "@/services/approvedClients";
import {
  createClientCredential,
  getClientCredentialStats,
  revokeClientCredential,
  type ClientCredential,
  updateClientCredentialScopes,
} from "@/services/clientCredentials";

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

const AVAILABLE_SCOPES = [
  "bookings:read",
  "bookings:write",
  "tasks:read",
  "tasks:write",
  "payments:read",
  "payments:write",
] as const;

const SCOPE_OPTIONS = AVAILABLE_SCOPES.map((scope) => ({
  label: scope,
  value: scope,
}));

const normalizeSelectedScopes = (scopes: string[]) =>
  AVAILABLE_SCOPES.filter((scope) => scopes.includes(scope));

const isApprovedClient = (client: ApprovedClient) => client.status === "APPROVED";

const Credentials = () => {
  const queryClient = useQueryClient();
  const { data: credentials, isLoading, isError } = useGetClientCredentials();
  const {
    data: clients,
    isLoading: clientsLoading,
    isError: clientsError,
  } = useGetApprovedClients();
  const approvedClients = clients.filter(isApprovedClient);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "revoked">(
    "all",
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [scopesOpen, setScopesOpen] = useState(false);
  const [secretOpen, setSecretOpen] = useState(false);
  const [selectedCredential, setSelectedCredential] =
    useState<ClientCredential | null>(null);
  const [newClientId, setNewClientId] = useState("");
  const [newScopes, setNewScopes] = useState<string[]>([]);
  const [scopesEditorValue, setScopesEditorValue] = useState<string[]>([]);
  const [createdSecret, setCreatedSecret] = useState("");
  const [createdClientId, setCreatedClientId] = useState("");
  const selectedCreateClient = approvedClients.find(
    (client) => client.id === newClientId,
  );

  const stats = getClientCredentialStats(credentials);

  const filteredCredentials = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return credentials.filter((credential) => {
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
            ? !credential.isRevoked
            : credential.isRevoked;

      if (!matchesStatus) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return [
        credential.clientName,
        credential.clientId,
        credential.id,
        credential.keyPrefix,
        credential.scopes.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [credentials, searchTerm, statusFilter]);

  const refreshCredentials = () =>
    queryClient.invalidateQueries({ queryKey: ["client_credentials"] });

  const createMutation = useMutation({
    mutationFn: createClientCredential,
    onSuccess: async (result) => {
      await refreshCredentials();
      setCreateOpen(false);
      setNewClientId("");
      setNewScopes([]);
      setCreatedSecret(result.rawSecret);
      setCreatedClientId(result.credential.clientId || newClientId);
      setSecretOpen(true);
      toast.success("Credential created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Unable to create credential");
    },
  });

  const revokeMutation = useMutation({
    mutationFn: revokeClientCredential,
    onSuccess: async () => {
      await refreshCredentials();
      toast.success("Credential revoked successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Unable to revoke credential");
    },
  });

  const updateScopesMutation = useMutation({
    mutationFn: ({ id, scopes }: { id: string; scopes: string[] }) =>
      updateClientCredentialScopes(id, scopes),
    onSuccess: async () => {
      await refreshCredentials();
      setScopesOpen(false);
      setSelectedCredential(null);
      setScopesEditorValue([]);
      toast.success("Credential permissions updated");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Unable to update credential permissions");
    },
  });

  const handleCreateCredential = () => {
    const clientId = newClientId.trim();
    const clientName =
      selectedCreateClient?.name ||
      selectedCreateClient?.email ||
      selectedCreateClient?.id ||
      "";
    const scopes = normalizeSelectedScopes(newScopes);

    if (!clientId) {
      toast.error("Client ID is required");
      return;
    }

    if (!clientName) {
      toast.error("Approved client name is required");
      return;
    }

    createMutation.mutate({ clientId, name: clientName, scopes });
  };

  const handleOpenScopesModal = (credential: ClientCredential) => {
    setSelectedCredential(credential);
    setScopesEditorValue(normalizeSelectedScopes(credential.scopes));
    setScopesOpen(true);
  };

  const handleUpdateScopes = () => {
    if (!selectedCredential) {
      return;
    }

    updateScopesMutation.mutate({
      id: selectedCredential.id,
      scopes: normalizeSelectedScopes(scopesEditorValue),
    });
  };

  const handleRevoke = (credential: ClientCredential) => {
    const confirmed = window.confirm(
      `Revoke credential for ${credential.clientName || credential.clientId}? This action disables the key immediately.`,
    );

    if (!confirmed) {
      return;
    }

    revokeMutation.mutate(credential.id);
  };

  const copySecret = async () => {
    try {
      await navigator.clipboard.writeText(createdSecret);
      toast.success("Secret copied to clipboard");
    } catch {
      toast.error("Unable to copy secret");
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-inter font-semibold text-[20px] mb-2 text-brand">
            Credentials & Permissions
          </h2>
          <p className="text-sm text-neutral600">
            Manage approved client API keys, revoke access, and adjust scopes
            from one place.
          </p>
        </div>

        <Button onClick={() => setCreateOpen(true)}>
          <Plus size={16} />
          Create credential
        </Button>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-neutral200 p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-neutral500">Total keys</p>
            <KeyRound className="text-brand" size={18} />
          </div>
          <p className="font-inter text-2xl font-semibold text-brand">
            {stats.total}
          </p>
        </div>

        <div className="rounded-2xl bg-neutral200 p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-neutral500">Active keys</p>
            <ShieldCheck className="text-green-700" size={18} />
          </div>
          <p className="font-inter text-2xl font-semibold text-brand">
            {stats.active}
          </p>
        </div>

        <div className="rounded-2xl bg-neutral200 p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-neutral500">Revoked keys</p>
            <RefreshCw className="text-amber-700" size={18} />
          </div>
          <p className="font-inter text-2xl font-semibold text-brand">
            {stats.revoked}
          </p>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-3">
          {[
            { key: "all", label: "All" },
            { key: "active", label: "Active" },
            { key: "revoked", label: "Revoked" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() =>
                setStatusFilter(tab.key as "all" | "active" | "revoked")
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
              placeholder="Search client or scope"
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refreshCredentials()}
          >
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
            We couldn&apos;t load client credentials right now.
          </div>
        ) : filteredCredentials.length === 0 ? (
          <div className="p-10 text-center text-sm text-neutral500">
            No credentials match the current filters.
          </div>
        ) : (
          <>
            <div className="hidden grid-cols-[1.4fr_1fr_1.4fr_1fr_1fr] gap-4 border-b border-neutral200 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-neutral500 lg:grid">
              <p>Client</p>
              <p>Key</p>
              <p>Scopes</p>
              <p>Created</p>
              <p>Actions</p>
            </div>

            <div className="divide-y divide-neutral200">
              {filteredCredentials.map((credential) => (
                <div
                  key={credential.id}
                  className="grid gap-4 px-6 py-5 lg:grid-cols-[1.4fr_1fr_1.4fr_1fr_1fr] lg:items-center"
                >
                  <div>
                    <p className="font-medium text-brand">
                      {credential.clientName || "Approved client"}
                    </p>
                    <p className="mt-1 break-all text-sm text-neutral500">
                      {credential.clientId}
                    </p>
                    <span
                      className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        credential.isRevoked
                          ? "bg-red-50 text-red-700"
                          : "bg-green-50 text-green-700"
                      }`}
                    >
                      {credential.isRevoked ? "Revoked" : "Active"}
                    </span>
                  </div>

                  <div className="text-sm text-neutral600">
                    <p className="font-medium text-brand">
                      {credential.keyPrefix || "Hidden"}
                    </p>
                    <p className="mt-1 break-all text-xs text-neutral500">
                      ID: {credential.id}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {credential.scopes.length > 0 ? (
                      credential.scopes.map((scope) => (
                        <span
                          key={`${credential.id}-${scope}`}
                          className="rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-brand"
                        >
                          {scope}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-neutral500">
                        No scopes assigned
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-neutral600">
                    <p>{formatDateTime(credential.createdAt)}</p>
                    <p className="mt-1 text-xs text-neutral500">
                      Last used: {formatDateTime(credential.lastUsedAt)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenScopesModal(credential)}
                      disabled={credential.isRevoked}
                    >
                      Update scopes
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRevoke(credential)}
                      disabled={credential.isRevoked || revokeMutation.isPending}
                    >
                      Revoke
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
        title="Create client credential"
        description="Create a new API key for an already approved client. The raw secret is shown only once."
        footer={
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setCreateOpen(false)}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateCredential} loading={createMutation.isPending}>
              Create key
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-brand">
              Approved client
            </label>
            <Select value={newClientId} onValueChange={setNewClientId}>
              <SelectTrigger className="w-full rounded-xl border border-neutral300 px-4 py-3 text-sm focus-visible:border-brand focus-visible:ring-0">
                <SelectValue
                  placeholder={
                    clientsLoading
                      ? "Loading approved clients..."
                      : approvedClients.length > 0
                        ? "Select an approved client"
                        : "No approved clients available"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {approvedClients.length > 0 ? (
                  approvedClients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name || client.email || client.id}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="__no_approved_clients" disabled>
                    No approved clients available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <p className="mt-2 text-xs text-neutral500">
              Only approved clients can receive credentials.
              {clientsError ? " Client list could not be loaded." : ""}
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-brand">
              Scopes
            </label>
            <div className="rounded-xl border border-neutral300 px-4 py-3">
              <MultiSelect
                options={SCOPE_OPTIONS}
                value={newScopes}
                onChange={(value) => setNewScopes(normalizeSelectedScopes(value))}
                placeholder="Select one or more scopes"
              />
            </div>
            <p className="mt-2 text-xs text-neutral500">
              Choose one or more permissions for this key.
            </p>
          </div>
        </div>
      </BaseModal>

      <BaseModal
        open={scopesOpen}
        onOpenChange={(open) => {
          setScopesOpen(open);
          if (!open) {
            setSelectedCredential(null);
            setScopesEditorValue([]);
          }
        }}
        title="Update credential permissions"
        description={`Adjust the scopes for ${
          selectedCredential?.clientName || selectedCredential?.clientId || "this client"
        }.`}
        footer={
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setScopesOpen(false)}
              disabled={updateScopesMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateScopes}
              loading={updateScopesMutation.isPending}
            >
              Save scopes
            </Button>
          </div>
        }
      >
        <div>
          <label className="mb-2 block text-sm font-medium text-brand">
            Allowed scopes
          </label>
          <div className="rounded-xl border border-neutral300 px-4 py-3">
            <MultiSelect
              options={SCOPE_OPTIONS}
              value={scopesEditorValue}
              onChange={(value) =>
                setScopesEditorValue(normalizeSelectedScopes(value))
              }
              placeholder="Select allowed scopes"
            />
          </div>
          <p className="mt-2 text-xs text-neutral500">
            Update one or more permissions for this key.
          </p>
        </div>
      </BaseModal>

      <BaseModal
        open={secretOpen}
        onOpenChange={setSecretOpen}
        title="Copy this secret now"
        description="For security reasons, the raw secret will not be shown again after you close this dialog."
        helpText={
          <p className="text-sm text-amber-900">
            Store this value in the client&apos;s secret manager before leaving this
            screen.
          </p>
        }
        footer={
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={copySecret}>
              Copy secret
            </Button>
            <Button onClick={() => setSecretOpen(false)}>Done</Button>
          </div>
        }
      >
        <div className="rounded-2xl border border-neutral200 bg-neutral100 p-4">
          <p className="mb-2 text-sm text-neutral500">Client ID</p>
          <p className="mb-4 break-all text-sm font-medium text-brand">
            {createdClientId || "N/A"}
          </p>
          <p className="mb-2 text-sm text-neutral500">Raw secret</p>
          <code className="block break-all rounded-xl bg-white p-4 text-xs text-brand">
            {createdSecret || "No secret was returned by the API."}
          </code>
        </div>
      </BaseModal>
    </div>
  );
};

export default Credentials;
