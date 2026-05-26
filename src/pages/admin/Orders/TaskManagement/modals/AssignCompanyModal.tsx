import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { getCompanyList } from "@/services/companies";
import { assignTasks } from "@/services/tasks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn, getErrorMessage } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";

type CompanyListItem = {
  id: string;
  name: string;
  email?: string;
};

type CompanyOption = {
  value: string;
  label: string;
  email?: string;
};

interface AssignCompanyModalProps {
  taskIds: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AssignCompanyModal = ({
  taskIds,
  open,
  onOpenChange,
  onSuccess,
}: AssignCompanyModalProps) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<CompanyOption | null>(null);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["companies", "assign", debouncedSearch],
    queryFn: () => getCompanyList(1, 50, "", "", debouncedSearch),
    enabled: open,
  });

  const companies = (data?.data?.content ?? []) as CompanyListItem[];
  const companyOptions = useMemo(
    () =>
      companies.map((company) => ({
        value: company.id,
        label: company.name,
        email: company.email,
      })),
    [companies]
  );

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: { taskIds: string[]; companyId?: string | null }) =>
      assignTasks(payload),
    onSuccess: (_, variables) => {
      toast.success(
        variables.companyId
          ? "Tasks assigned successfully"
          : "Tasks were unassigned"
      );
      setSelectedCompany(null);
      onSuccess();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to update assignment"));
    },
  });

  useEffect(() => {
    if (!open) {
      setSearch("");
      setDebouncedSearch("");
      setSelectedCompany(null);
      setCompanyDropdownOpen(false);
    } else {
      refetch();
    }
  }, [open, refetch]);

  const handleAssign = () => {
    if (!selectedCompany) {
      toast.error("Select a company");
      return;
    }
    mutate({ taskIds, companyId: selectedCompany.value });
  };

  const handleSelectCompany = (company: CompanyOption) => {
    setSelectedCompany(company);
    setSearch("");
    setDebouncedSearch("");
    setCompanyDropdownOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign Company</DialogTitle>
          <DialogDescription>
            Assign {taskIds.length} task{taskIds.length === 1 ? "" : "s"} to a dispatch partner
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-medium">{taskIds.length}</span> draft task
              {taskIds.length === 1 ? "" : "s"} will be assigned. These tasks will be ready for dispatch after assignment.
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Select Company</label>
              {isFetching && (
                <span className="text-xs text-neutral500">Loading...</span>
              )}
            </div>
            <Popover open={companyDropdownOpen} onOpenChange={setCompanyDropdownOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex min-h-12 w-full items-center justify-between gap-3 rounded-lg border border-[#D0D5DD] bg-white px-3 py-2 text-left text-sm outline-none transition focus:border-purple300 focus:ring-3 focus:ring-purple200/50"
                >
                  {selectedCompany ? (
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-[#111827]">
                        {selectedCompany.label}
                      </span>
                      {selectedCompany.email && (
                        <span className="block truncate text-xs text-neutral500">
                          {selectedCompany.email}
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="text-[#667085]">Choose a dispatch partner</span>
                  )}
                  <ChevronDown className="h-4 w-4 shrink-0 text-neutral500" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="z-[70] w-[var(--radix-popover-trigger-width)] p-2"
              >
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by name or email..."
                  autoFocus
                  className="h-10"
                />

                <div className="mt-2 max-h-64 overflow-y-auto">
                  {companyOptions.map((company) => (
                    <button
                      type="button"
                      key={company.value}
                      onClick={() => handleSelectCompany(company)}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-[#F9FAFB]",
                        selectedCompany?.value === company.value && "bg-[#F2F4F7]"
                      )}
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-[#111827]">
                          {company.label}
                        </span>
                        {company.email && (
                          <span className="block truncate text-xs text-neutral500">
                            {company.email}
                          </span>
                        )}
                      </span>
                      {selectedCompany?.value === company.value && (
                        <Check className="h-4 w-4 shrink-0 text-green100" />
                      )}
                    </button>
                  ))}

                  {!isFetching && companyOptions.length === 0 && (
                    <p className="px-3 py-4 text-center text-sm text-neutral500">
                      {search ? "No companies match your search" : "No companies available"}
                    </p>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-neutral200">
            <Button
              type="button"
              onClick={handleAssign}
              disabled={!selectedCompany || taskIds.length === 0 || isPending}
              loading={isPending}
              className="sm:min-w-[120px]"
            >
              Assign Tasks
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignCompanyModal;
