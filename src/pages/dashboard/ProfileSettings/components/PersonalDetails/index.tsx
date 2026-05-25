import { useState } from "react";
import { FiEdit2, FiMail, FiMapPin, FiPhone, FiUser } from "react-icons/fi";
import { UpdateProfileModal } from "./UpdateProfileModal";

const Field = ({ label, value }: { label: string; value?: string }) => (
  <div className="flex flex-col gap-1">
    <p className="text-[11px] uppercase tracking-widest text-neutral500 font-medium">
      {label}
    </p>
    <p className="text-sm font-medium text-neutral800">{value || "—"}</p>
  </div>
);

const PersonalDetails = ({ data }: { data: any }) => {
  const userData = data?.data;
  const [open, setOpen] = useState(false);

  const initials = userData?.username
    ? userData.username.slice(0, 2).toUpperCase()
    : "U";

  return (
    <>
      <div className="bg-white rounded-2xl border border-neutral200 overflow-hidden mb-6">
        {/* Header band */}
        <div className="h-20 bg-gradient-to-r from-brand to-[#065f46]" />

        {/* Avatar + name row */}
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-6">
            <div className="w-20 h-20 rounded-full bg-brand border-4 border-white flex items-center justify-center text-white text-2xl font-bold font-clash shadow-md shrink-0">
              {initials}
            </div>
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-brand text-brand text-sm font-semibold hover:bg-brand hover:text-white transition-colors"
            >
              <FiEdit2 size={14} />
              Edit Profile
            </button>
          </div>

          <h2 className="font-clash font-bold text-xl text-neutral800 mb-0.5">
            {userData?.username || "—"}
          </h2>
          <p className="text-sm text-neutral500">{userData?.email || "—"}</p>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral100 mx-6" />

        {/* Fields grid */}
        <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F0FDF4] text-brand">
              <FiUser size={15} />
            </span>
            <Field label="Username" value={userData?.username} />
          </div>

          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F0FDF4] text-brand">
              <FiMail size={15} />
            </span>
            <Field label="Email Address" value={userData?.email} />
          </div>

          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F0FDF4] text-brand">
              <FiPhone size={15} />
            </span>
            <Field label="Phone Number" value={userData?.phone} />
          </div>

          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F0FDF4] text-brand">
              <FiMapPin size={15} />
            </span>
            <Field label="Address" value={userData?.address} />
          </div>

          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F0FDF4] text-brand">
              <FiMapPin size={15} />
            </span>
            <Field label="State" value={userData?.state} />
          </div>

          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F0FDF4] text-brand">
              <FiMapPin size={15} />
            </span>
            <Field label="Country" value={userData?.country} />
          </div>

          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F0FDF4] text-brand">
              <FiMapPin size={15} />
            </span>
            <Field label="Postal Code" value={userData?.postalCode} />
          </div>
        </div>
      </div>

      <UpdateProfileModal open={open} setOpen={setOpen} data={userData} />
    </>
  );
};

export default PersonalDetails;
