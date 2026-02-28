import { ChangePassword } from "./modals/ChangePassword";
import { DeactivateAccount } from "./modals/DeactivateAccount";
import { DeleteAccount } from "./modals/DeleteAccount";
import { ReactivateAccount } from "./modals/ReactivateAccount";

const Security = ({ data }: { data: any }) => {
  const userStatus = data?.data?.status ?? "";
  return (
    <div className="md:px-4">
      <div className="mb-8">
        <h2 className="font-clash font-semibold text-[20px] mb-2 text-brand">Security</h2>
        <p className="text-sm text-neutral600">Protect your account here </p>
      </div>
      <div className="flex lg:flex-row flex-col lg:items-center mb-8 gap-4">
        <div className="xl:w-[40%] lg:w-[50%]">
          <h2 className="font-clash font-semibold text-[20px] mb-2 text-brand">
            Password
          </h2>
          <p className="text-sm text-neutral600">
            Unique password to protect your account
          </p>
        </div>
        <div>
          <ChangePassword />
        </div>
      </div>

      {userStatus === "active" && (
        <div className="flex lg:flex-row flex-col lg:items-center mb-8 gap-4">
          <div className="xl:w-[40%] lg:w-[50%]">
            <h2 className="font-clash font-semibold text-[20px] mb-2 text-brand">
              Deactivate Account
            </h2>
            <p className="text-sm text-neutral600">
              Your account will be in active but you can reactivate it anytime{" "}
            </p>
          </div>
          <div>
            <DeactivateAccount />
          </div>
        </div>
      )}

      {userStatus === "inactive" && (
        <div className="flex lg:flex-row flex-col lg:items-center mb-8 gap-4">
          <div className="xl:w-[40%] lg:w-[50%]">
            <h2 className="font-clash font-semibold text-[20px] mb-2 text-brand">
              Reactivate Account
            </h2>
            <p className="text-sm text-neutral600">
              Your account will be active once you reactivate it anytime
            </p>
          </div>
          <div>
            <ReactivateAccount />
          </div>
        </div>
      )}
      <div className="flex lg:flex-row flex-col lg:items-center mb-8 gap-4">
        <div className="xl:w-[40%] lg:w-[50%]">
          <h2 className="font-clash font-semibold text-[20px] mb-2 text-brand">
            Delete Account
          </h2>
          <p className="text-sm text-neutral600">
            Your account will be permanently removed from GoSendeet{" "}
          </p>
        </div>
        <div>
          <DeleteAccount />
        </div>
      </div>
    </div>
  );
};

export default Security;
