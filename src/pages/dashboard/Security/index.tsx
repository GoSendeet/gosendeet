import { FiKey, FiShield, FiTrash2, FiUserCheck, FiUserX } from "react-icons/fi";
import { ChangePassword } from "./modals/ChangePassword";
import { DeactivateAccount } from "./modals/DeactivateAccount";
import { DeleteAccount } from "./modals/DeleteAccount";
import { ReactivateAccount } from "./modals/ReactivateAccount";

const Security = ({ data }: { data: any }) => {
  const userStatus = data?.data?.status ?? "";

  return (
    <div className="max-w-2xl space-y-4">
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <FiShield className="text-brand" size={20} />
          <h2 className="font-clash font-bold text-[22px] text-brand">Security</h2>
        </div>
        <p className="text-sm text-neutral500">
          Manage your password and account access settings.
        </p>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl border border-neutral200 p-5 flex flex-col lg:flex-row gap-4">
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0FDF4] text-brand">
            <FiKey size={18} />
          </span>
          <div>
            <p className="font-semibold text-neutral800 font-clash">Password</p>
            <p className="text-sm text-neutral500 mt-0.5">
              Keep your account secure with a strong, unique password.
            </p>
          </div>
        </div>
        <div className="shrink-0 flex items-center justify-center">
          <ChangePassword />
        </div>
      </div>

      {/* Deactivate or Reactivate */}
      {userStatus === "active" && (
        <div className="bg-white rounded-2xl border border-neutral200 p-5 flex flex-col lg:flex-row gap-4">
          <div className="flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <FiUserX size={18} />
            </span>
            <div>
              <p className="font-semibold text-neutral800 font-clash">
                Deactivate Account
              </p>
              <p className="text-sm text-neutral500 mt-0.5">
                Temporarily disable your account. You can reactivate it at any time.
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center justify-center">
            <DeactivateAccount />
          </div>
        </div>
      )}

      {userStatus === "inactive" && (
        <div className="bg-white rounded-2xl border border-neutral200 p-5 flex flex-col lg:flex-row gap-4">
          <div className="flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0FDF4] text-brand">
              <FiUserCheck size={18} />
            </span>
            <div>
              <p className="font-semibold text-neutral800 font-clash">
                Reactivate Account
              </p>
              <p className="text-sm text-neutral500 mt-0.5">
                Restore full access to your account and all platform features.
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <ReactivateAccount />
          </div>
        </div>
      )}

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl border border-red-200 p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-4">
          Danger Zone
        </p>
        <div className="flex  flex-col lg:flex-row gap-4">
          <div className="flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <FiTrash2 size={18} />
            </span>
            <div>
              <p className="font-semibold text-neutral800 font-clash">
                Delete Account
              </p>
              <p className="text-sm text-neutral500 mt-0.5">
                Permanently remove your account and all data. This cannot be undone.
              </p>
            </div>
          </div>
          <div className="shrink-0 flex justify-center items-center">
            <DeleteAccount />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;
