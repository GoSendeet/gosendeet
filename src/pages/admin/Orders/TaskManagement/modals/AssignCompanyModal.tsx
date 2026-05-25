import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Select, { type SingleValue, type StylesConfig } from "react-select";
import { Button } from "@/components/ui/button";
import { getCompanyList } from "@/services/companies";
import { assignTasks } from "@/services/tasks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

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
  const [selectedCompany, setSelectedCompany] = useState<CompanyOption | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["companies", "assign", search],
    queryFn: () => getCompanyList(1, 50, "", "", search),
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

  const selectStyles: StylesConfig<CompanyOption, false> = {
    control: (base, state) => ({
      ...base,
      minHeight: "48px",
      borderColor: state.isFocused ? "#C4B5FD" : "#D0D5DD",
      borderRadius: "0.5rem",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(196, 181, 253, 0.45)" : "none",
      "&:hover": {
        borderColor: state.isFocused ? "#C4B5FD" : "#98A2B3",
      },
    }),
    menu: (base) => ({
      ...base,
      zIndex: 60,
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 60,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#F2F4F7"
        : state.isFocused
          ? "#F9FAFB"
          : "#FFFFFF",
      color: "#111827",
      cursor: "pointer",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#667085",
    }),
  };

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
      setSelectedCompany(null);
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

  const handleUnassign = () => {
    mutate({ taskIds, companyId: null });
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
              {isLoading && (
                <span className="text-xs text-neutral500">Loading...</span>
              )}
            </div>
            <Select
              value={selectedCompany}
              options={companyOptions}
              onChange={(option: SingleValue<CompanyOption>) =>
                setSelectedCompany(option)
              }
              onInputChange={(value, actionMeta) => {
                if (actionMeta.action === "input-change") {
                  setSearch(value);
                }
              }}
              inputValue={search}
              placeholder="Search by name or email..."
              isClearable
              isDisabled={isLoading}
              isLoading={isLoading}
              autoFocus
              filterOption={null}
              noOptionsMessage={() =>
                search ? "No companies match your search" : "No companies available"
              }
              formatOptionLabel={(option) => (
                <div className="flex flex-col py-1">
                  <span className="font-medium">{option.label}</span>
                  {option.email && (
                    <span className="text-xs text-neutral500">{option.email}</span>
                  )}
                </div>
              )}
              styles={selectStyles}
              menuPortalTarget={document.body}
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-between gap-2 pt-4 border-t border-neutral200">
            <Button
              type="button"
              variant="outline"
              className="border-neutral300 text-neutral800"
              onClick={handleUnassign}
              disabled={taskIds.length === 0 || isPending}
            >
              Remove Assignment
            </Button>
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
