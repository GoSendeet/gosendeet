import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  // DialogTrigger,
} from "@/components/ui/dialog";
import { getQuotes } from "@/services/user";
import { useMutation } from "@tanstack/react-query";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { allowOnlyNumbers } from "@/lib/utils";
import { useState } from "react";

export function SpecsModal({
  open,
  setOpen,
  inputData,
  setData,
}: {
  open: boolean;
  setOpen: any;
  inputData: any;
  setData: any;
}) {
  // const [inputData, setInputData] = useState({});

  const [count, setCount] = useState(1);
  const plus = () => {
    const newCount = count + 1;
    setCount(newCount);
    setValue("itemQuantity", newCount.toString());
  };
  const minus = () => {
    if (count === 1) {
      return;
    }
    const newCount = count - 1;
    setCount(newCount);
    setValue("itemQuantity", newCount.toString());
  };

  const schema = z.object({
    itemValue: z.string().optional(),
    itemQuantity: z.string().min(1, "Quantity is required"),
    isFragile: z.boolean(),
    isPerishable: z.boolean(),
    isExclusive: z.boolean(),
    isHazardous: z.boolean(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      itemValue: "",
      itemQuantity: "1",
      isFragile: false,
      isPerishable: false,
      isExclusive: false,
      isHazardous: false,
    },
  });

  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) => getQuotes(data),
    onSuccess: (data: any) => {
      if (data?.data?.length > 0) {
        toast.success("Successful");
        setOpen(false);

        navigate("/cost-calculator", {
          state: {
            inputData: inputData,
            results: data,
          },
        });

        if (
          window.location.pathname === "/cost-calculator" &&
          typeof setData === "function"
        ) {
          setData(data);
        }
      }
    },
    onError: (data: any) => {
      toast.error(data?.message);
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    mutate([
      {
        ...inputData,
        itemValue: data.itemValue,
        quantity: data.itemQuantity || 1,
        packageDescription: {
          isFragile: data?.isFragile,
          isPerishable: data?.isPerishable,
          isExclusive: data?.isExclusive,
          isHazardous: data?.isHazardous,
        },
      },
    ]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="">
        <DialogTitle className="hidden"></DialogTitle>
        <DialogDescription className="hidden"></DialogDescription>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* <div className="grid md:grid-cols-2 gap-8 py-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="quantity"
                className="font-clash font-semibold text-sm"
              >
                Item Quantity
              </label>
              <div className="border border-neutral200 rounded-xl h-[40px] px-3 flex items-center justify-between w-[100px]">
                <p
                  className="text-neutral500 text-2xl cursor-pointer"
                  onClick={minus}
                >
                  -
                </p>
                <input
                  className="text-neutral600 border-0 outline-0 w-[40px] px-1 text-center"
                  value={count}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const regex = /^\d*$/; // only digits, empty string allowed
                    if (regex.test(inputValue)) {
                      setCount(Number(inputValue));
                    }
                  }}
                />
                <p
                  className="text-neutral500 text-2xl cursor-pointer"
                  onClick={plus}
                >
                  +
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="description"
                className="font-clash font-semibold text-sm"
              >
                Package Description
              </label>
              <select
                name=""
                id=""
                className="border border-neutral200 text-sm rounded-xl h-[40px] px-3"
              >
                <option value="">is fragile</option>
                <option value="">is fragile</option>
                <option value="">is fragile</option>
                <option value="">is fragile</option>
              </select>
            </div>
          </div> */}

          <div className="grid gap-8 py-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="itemValue"
                className="font-clash font-semibold text-sm"
              >
                Item Value
              </label>
              <div className="border border-neutral200  rounded-xl h-[40px] flex items-center justify-between w-full">
                <p className="p-4">₦</p>
                <input
                  type="text"
                  {...register("itemValue")}
                  onKeyDown={allowOnlyNumbers}
                  className="w-[90%] outline-0 text-sm px-4 py-2 border-l-2 border-l-neutral200"
                />
              </div>

              {errors.itemValue && (
                <p className="error text-xs text-[#FF0000] my-1">
                  {errors.itemValue.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="itemQuantity"
                className="font-clash font-semibold text-sm"
              >
                Item Quantity
              </label>
              <div className="border border-neutral200 rounded-xl h-[40px] px-3 flex items-center justify-between w-[100px]">
                <p
                  className="text-neutral500 text-2xl cursor-pointer"
                  onClick={minus}
                >
                  -
                </p>
                <input
                  {...register("itemQuantity")}
                  className="text-neutral600 border-0 outline-0 w-[40px] px-1 text-center"
                  value={count}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const regex = /^\d*$/;
                    if (regex.test(inputValue) && inputValue !== "0") {
                      setCount(Number(inputValue) || 1);
                      setValue("itemQuantity", inputValue || "1");
                    }
                  }}
                />
                <p
                  className="text-neutral500 text-2xl cursor-pointer"
                  onClick={plus}
                >
                  +
                </p>
              </div>
              {errors.itemQuantity && (
                <p className="error text-xs text-[#FF0000] my-1">
                  {errors.itemQuantity.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="dimension"
                className="font-clash font-semibold text-sm"
              >
                Package Description
              </label>

              <div>
                {/* Checkboxes */}
                <div className="grid gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={watch("isFragile")}
                      onCheckedChange={(val) =>
                        setValue("isFragile", Boolean(val))
                      }
                      id="fragile"
                    />
                    <label htmlFor="fragile" className="text-sm font-medium">
                      Fragile
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={watch("isPerishable")}
                      onCheckedChange={(val) =>
                        setValue("isPerishable", Boolean(val))
                      }
                      id="perishable"
                    />
                    <label htmlFor="perishable" className="text-sm font-medium">
                      Perishable
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={watch("isExclusive")}
                      onCheckedChange={(val) =>
                        setValue("isExclusive", Boolean(val))
                      }
                      id="exclusive"
                    />
                    <label htmlFor="exclusive" className="text-sm font-medium">
                      Exclusive
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={watch("isHazardous")}
                      onCheckedChange={(val) =>
                        setValue("isHazardous", Boolean(val))
                      }
                      id="hazardous"
                    />
                    <label htmlFor="hazardous" className="text-sm font-medium">
                      Hazardous
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <p className="flex items-center gap-2 my-4 text-purple500 font-clash font-semibold text-sm">
            Advanced <IoIosArrowDown size={18} />
          </p> */}

          {/* <div className="grid md:grid-cols-2 gap-8 py-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="category"
                className="font-clash font-semibold text-sm"
              >
                Item Category
              </label>
              <select
                name=""
                id=""
                className="border border-neutral200 text-sm rounded-xl h-[40px] px-3"
              >
                <option value="">is fragile</option>
                <option value="">is fragile</option>
                <option value="">is fragile</option>
                <option value="">is fragile</option>
              </select>
            </div>
          </div> */}

          {/* <button className="bg-black text-white rounded-full px-8 py-3 outline-black my-6">
            Add selection
          </button> */}
          <Button
            className="flex items-center gap-3 bg-black hover:bg-black rounded-full px-8 py-3 outline-black mt-4"
            loading={isPending}
          >
            <FiSearch className="text-white text-xl" />
            <span className="text-white">Get Quote</span>
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
