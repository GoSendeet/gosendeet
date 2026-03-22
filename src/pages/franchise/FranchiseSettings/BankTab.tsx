import { zodResolver } from "@hookform/resolvers/zod";
import { acceptedBanks } from "@/constants";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { bankAccountSchema } from "@/schema/franchise/settings";
import { BankAccountFormData } from "@/schema/franchise/settings/type";
import { Save, CheckCircle, Shield } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BankTab = () => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<BankAccountFormData>({
    resolver: zodResolver(bankAccountSchema),
  });

  const {
    mutate: saveBankAccount,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: async (data: BankAccountFormData) => {
      // TODO: later we will replace with actual API call
      console.log("Bank account payload:", data);
    },
    onSuccess: () => reset(),
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-700">Bank Account</h3>
        <div className="flex items-center gap-1">
          <span>
            {" "}
            <Shield size={12} className="text-emerald-400" />{" "}
          </span>
          <p className="text-xs text-gray-400 mt-0.5">
            Your bank details are securely stored
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit((data) => saveBankAccount(data))}
        className="flex flex-col gap-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Bank Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500">
              Bank Name
            </label>
            <Controller
              name="bankName"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full rounded-xl border border-gray-200 text-sm text-gray-700 bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50">
                    <SelectValue placeholder="Select a bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {acceptedBanks.map((bank) => (
                      <SelectItem key={bank.id} value={bank.bankname}>
                        {bank.bankname}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.bankName && (
              <p className="text-xs text-red-500">{errors.bankName.message}</p>
            )}
          </div>

          {/* Account Number */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500">
              Account Number
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={10}
              placeholder="Enter 10-digit account number"
              {...register("accountNumber")}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all placeholder-gray-300"
            />
            {errors.accountNumber && (
              <p className="text-xs text-red-500">
                {errors.accountNumber.message}
              </p>
            )}
          </div>
        </div>
        
        <div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500">
              Account Name
            </label>
            <input
              type="text"
              inputMode="numeric"
              {...register("accountName")}
              readOnly
              value="KUNLE ADEWALE"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-400 bg-gray-100 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-al"
            />
            {errors.accountName && (
              <p className="text-xs text-red-500">
                {errors.accountName.message}
              </p>
            )}
          </div>
        </div>

        <div>
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

export default BankTab;
