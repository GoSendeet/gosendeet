import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { UpdateProfileModal } from "./UpdateProfileModal";

const PersonalDetails = ({ data }: { data: any }) => {
  const userData = data?.data;
  const [open, setOpen] = useState(false);
  return (
    <div className="flex lg:flex-row flex-col gap-8 mb-8">
      <div className="lg:w-[40%] md:px-4">
        <h2 className="font-clash font-semibold text-[20px] text-brand mb-2">
          Profile Settings
        </h2>
        <p className="text-neutral600 text-sm">Information about yourself</p>
      </div>
      <div className="lg:w-[60%] md:px-4">
        <div className="flex mt-2 gap-4">
          <div className="w-1/2 mb-8">
            <h2 className="font-clash font-semibold text-sm mb-2 text-brand">Username</h2>
            <p className="text-neutral800 text-sm">
              {userData?.username ?? "--"}
            </p>
          </div>
          <div className="w-1/2 mb-8">
            <h2 className="font-clash font-semibold text-sm mb-2 text-brand">
              Email Address
            </h2>
            <p className="text-neutral800 text-sm">{userData?.email ?? "--"}</p>
          </div>
        </div>
        <div className="flex mt-2 gap-4">
          <div className="w-1/2 mb-8">
            <h2 className="font-clash font-semibold text-sm mb-2 text-brand">
              Phone number
            </h2>
            <p className="text-neutral800 text-sm">{userData?.phone ?? "--"}</p>
          </div>
          <div className="w-1/2 mb-8">
            <h2 className="font-clash font-semibold text-sm mb-2 text-brand">
              Postal code
            </h2>
            <p className="text-neutral800 text-sm">
              {userData?.postalCode ?? "--"}
            </p>
          </div>
        </div>
        <div className="flex mt-2 gap-4">
          <div className="w-1/2 mb-8">
            <h2 className="font-clash font-semibold text-sm mb-2 text-brand">State</h2>
            <p className="text-neutral800 text-sm">{userData?.state ?? "--"}</p>
          </div>
          <div className="w-1/2 mb-8">
            <h2 className="font-clash font-semibold text-sm mb-2 text-brand">Country</h2>
            <p className="text-neutral800 text-sm">
              {userData?.country ?? "--"}
            </p>
          </div>
        </div>
        <div className="mb-8 w-1/2">
          <h2 className="font-clash font-semibold text-sm mb-2 text-brand">Address</h2>
          <p className="text-neutral800 text-sm">{userData?.address ?? "--"}</p>
        </div>

        <Button
          className="w-fit bg-brand text-white py-2 px-3"
          variant={"secondary"}
          size={"ghost"}
          onClick={() => setOpen(true)}
        >
          <FiEdit />
          Edit
        </Button>
      </div>

      <UpdateProfileModal open={open} setOpen={setOpen} data={userData} />
    </div>
  );
};

export default PersonalDetails;
