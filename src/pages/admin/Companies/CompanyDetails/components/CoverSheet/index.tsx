import { Button } from "@/components/ui/button";
import { BiEditAlt } from "react-icons/bi";
import { UpdateCompanyModal } from "../../../modals/UpdateCompanyModal";
import { useState } from "react";

const CoverSheet = ({ data }: { data: any }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="py-4">
      <div className="flex justify-between items-center gap-4 mb-6">
        <p className="text-neutral800 md:text-[20px] font-inter font-semibold">
          Basic Details
        </p>

        <Button
          variant={"secondary"}
          className="md:text-base text-sm bg-brand"
          onClick={() => setOpen(true)}
        >
          <BiEditAlt />
          Update Info
        </Button>
      </div>

      <div className="bg-white mb-8">
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 md:gap-6 gap-6 md:p-6 p-4">
          <div>
            <p className="font-medium text-sm mb-2">Phone</p>
            <p className="text-sm">{data?.phone ?? ""}</p>
          </div>

          <div>
            <p className="font-medium text-sm mb-2">Email</p>
            <p className="text-sm">{data?.email ?? ""}</p>
          </div>

          <div>
            <p className="font-medium text-sm mb-2">Website</p>
            <p className="text-sm">{data?.website ?? ""}</p>
          </div>
        </div>

        <hr />

        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 md:gap-6 gap-6 md:p-6 p-4">
          <div>
            <p className="font-medium text-sm mb-2">Branch Address</p>
            <p className="text-sm">{data?.address ?? ""}</p>
          </div>

          <div>
            <p className="font-medium text-sm mb-2">City</p>
            <p className="text-sm">{data?.city ?? ""}</p>
          </div>

          <div>
            <p className="font-medium text-sm mb-2">State</p>
            <p className="text-sm">{data?.state ?? ""}</p>
          </div>

          <div>
            <p className="font-medium text-sm mb-2">Country</p>
            <p className="text-sm">{data?.country ?? ""}</p>
          </div>
        </div>

        <hr />
      </div>

      <UpdateCompanyModal open={open} setOpen={setOpen} data={data}/>
    </div>
  );
};

export default CoverSheet;
