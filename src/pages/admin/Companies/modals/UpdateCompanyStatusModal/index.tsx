import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateCompanyStatus } from "@/services/companies";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const UpdateCompanyStatusModal = ({
  openStatus,
  setOpenStatus,
  companyName,
  companyId,
  companyStatus,
}: {
  openStatus: boolean;
  setOpenStatus: any;
  companyName: string;
  companyId: string;
  companyStatus: string;
}) => {
  const schema = z.object({
    status: z
      .string({ required_error: "Status is required" })
      .min(1, { message: "Please enter status" }),
  });

  const { handleSubmit, reset, setValue } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: "",
    },
  });

  useEffect(() => {
    if (companyId && openStatus) {
      reset({
        status: companyStatus ?? "",
      });
    }
  }, [companyStatus, open, reset]);

  const queryClient = useQueryClient();

  const { mutate: updateCompany, isPending: pendingUpdate } = useMutation({
    mutationFn: ({ status, data }: { status: string; data: any }) =>
      updateCompanyStatus(status, data), // ✅ call with correct shape

    onSuccess: () => {
      toast.success("Successful");
      setOpenStatus(false);
      queryClient.invalidateQueries({
        queryKey: ["companies"],
      });
      queryClient.invalidateQueries({
        queryKey: ["single_company"],
      });
    },

    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  const onSubmit = (data: any) => {
    updateCompany({
      status: data.status,
      data: {
        ids: [companyId],
      },
    });
  };

  return (
    <Dialog open={openStatus} onOpenChange={setOpenStatus}>
      <DialogContent className="gap-0">
        <DialogTitle className="text-[20px] text-brand font-semibold font-inter mb-4">
          Update company status
        </DialogTitle>
        <DialogDescription className="font-medium text-base text-neutral600 mb-4">
          Are you sure you want to update the live status of{" "}
          <b className="text-brand">{companyName}</b> ?
        </DialogDescription>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex justify-between items-center gap-2 border-b">
              <Select
                onValueChange={(val) => setValue("status", val)}
                defaultValue={companyStatus}
              >
                <SelectTrigger className="outline-0 focus-visible:border-transparent focus-visible:ring-transparent border-0 w-full py-2 px-0 mt-0">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {/* on hover change the bg in the select */}
                  <SelectItem
                    value="published"
                    className="focus:bg-brand-light"
                  >
                    Published
                  </SelectItem>
                  <SelectItem value="draft" className="focus:bg-brand-light">
                    Draft
                  </SelectItem>
                  <SelectItem value="archived" className="focus:bg-brand-light">
                    Archived
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="py-4 text-sm mt-4 flex items-center gap-4">
            <Button
              variant={"secondary"}
              // onClick={onSubmit}
              loading={pendingUpdate}
              className="bg-brand text-white"
            >
              Yes, Update
            </Button>
            <Button
              variant={"outline"}
              type="button"
              onClick={() => setOpenStatus(false)}
              className="border-brand text-brand"
            >
              No, Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCompanyStatusModal;
