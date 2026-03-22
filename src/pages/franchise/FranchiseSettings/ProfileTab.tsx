import { CheckCircle, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

export type ProfileData = {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  partnerId: string;
  status: "Active" | "Inactive";
  avatarInitials: string;
  avatarBg: string;
};

export const MOCK_PROFILE: ProfileData = {
  fullName: "Adewale Kunle",
  phoneNumber: "0801 234 5678",
  email: "adewale.k@email.com",
  address: "15 Admiralty Way, Lekki Phase 1",
  partnerId: "GP-1847",
  status: "Active",
  avatarInitials: "AK",
  avatarBg: "bg-orange-400",
};

type FormFields = Pick<ProfileData, "fullName" | "phoneNumber" | "email">;

type Prop = {
  data?: ProfileData;
};

const ProfileTab = ({ data = MOCK_PROFILE }: Prop) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    defaultValues: {
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      email: data.email,
    },
  });

  const { mutate: updateProfile, isSuccess, isPending } = useMutation({
    mutationFn: async (formData: FormFields) => {
      // TODO: replace with actual API call e.g. return api.patch("/profile", formData)
      console.log("Profile update payload:", formData);
    },
  });

  const fields: { label: string; field: keyof FormFields; placeholder: string; type?: string }[] = [
    { label: "Full Name", field: "fullName", placeholder: "Enter full name" },
    { label: "Phone Number", field: "phoneNumber", placeholder: "Enter phone number" },
    { label: "Email", field: "email", placeholder: "Enter email address", type: "email" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Avatar + identity */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div
            className={`w-14 h-14 rounded-2xl ${data.avatarBg} flex items-center justify-center`}
          >
            <span className="text-white font-bold text-lg tracking-wide">
              {data.avatarInitials}
            </span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
            <CheckCircle size={10} className="text-white" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <p className="font-bold text-gray-800 text-base">{data.fullName}</p>
          <p className="text-xs text-gray-400">Partner ID: {data.partnerId}</p>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 w-fit">
            {data.status}
          </span>
        </div>
      </div>

      {/* Form grid */}
      <form onSubmit={handleSubmit((data) => updateProfile(data))}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(({ label, field, placeholder, type }) => (
            <div key={field} className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500">{label}</label>
              <input
                type={type ?? "text"}
                placeholder={placeholder}
                {...register(field, {
                  required: `${label} is required`,
                  ...(field === "email" && {
                    pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email address" },
                  }),
                })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all placeholder-gray-300"
              />
              {errors[field] && (
                <p className="text-xs text-red-500">{errors[field]?.message}</p>
              )}
            </div>
          ))}

          {/* Address stays as plain read-only display — not part of editable fields */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500">Address</label>
            <input
              type="text"
              value={data.address}
              readOnly
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-400 bg-gray-50 outline-none cursor-not-allowed"
            />
          </div>
        </div>

        {/* Save button */}
        <div className="mt-4">
          <button
            type="submit"
            disabled={isPending}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 ${
              isSuccess
                ? "bg-emerald-400 cursor-default"
                : "bg-emerald-500 hover:bg-emerald-600 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            }`}
          >
            {isSuccess ? <CheckCircle size={15} /> : <Save size={15} />}
            {isPending ? "Saving..." : isSuccess ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileTab;
