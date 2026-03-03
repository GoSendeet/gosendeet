import DeleteModal from "@/components/modals/DeleteModal";
import { useEffect, useRef, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCompanyPricing } from "@/services/companies";
import { toast } from "sonner";
import { AddPricingModal } from "../../../AddCompany/modals/AddPricingModal";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import MobileCard from "@/components/MobileCard";

const Pricing = ({
  companyId,
  companyPricing,
  companyServices,
}: {
  companyId: string;
  companyPricing: any;
  companyServices: any;
}) => {
  const [pricingInfo, setPricingInfo] = useState({});
  const [type, setType] = useState("");

  // const [openDeletePricingModal, setOpenDeletePricingModal] = useState<
  //   number | null
  // >(null);

  const [selectedDeleteIndex, setSelectedDeleteIndex] = useState<number | null>(
    null,
  );
  const handleDeletePricingModal = () => setSelectedDeleteIndex(null);

  const [openPricing, setOpenPricing] = useState(false);

  const [activeModalId, setActiveModalId] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Close modal on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      // if (isDialogOpen) return; // Skip if dialog is open

      const target = event.target as Node;
      if (modalRef.current && !modalRef.current.contains(target)) {
        setActiveModalId(null); // Close parent modal
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const queryClient = useQueryClient();

  const { mutate: deletePricing, isPending: pendingDeletePricing } =
    useMutation({
      mutationFn: deleteCompanyPricing,
      onSuccess: () => {
        toast.success("Successful");
        handleDeletePricingModal();
        queryClient.invalidateQueries({
          queryKey: ["company_pricing"],
        });
      },

      onError: (error: any) => {
        toast.error(error?.message || "Something went wrong");
      },
    });

  const handleDeletePricing = (id: string) =>
    deletePricing({
      ids: [id],
    });

  return (
    <div className="py-4">
      <div className="flex justify-between items-center gap-4 mb-6">
        <p className="text-brand lg:text-[20px] font-inter font-semibold">
          Delivery Pricing
        </p>

        <Button
          variant={"secondary"}
          onClick={() => {
            setType("create");
            setOpenPricing(true);
          }}
          disabled={companyId === "" || companyServices?.length === 0}
          className="lg:text-base text-sm bg-brand"
        >
          <FiEdit /> Add <span className="md:block hidden">New Custom</span>{" "}
          Pricing
        </Button>
      </div>
      {companyPricing && companyPricing?.content?.length > 0 && (
        <>
          <div className="lg:hidden">
            {companyPricing?.content?.map((item: any, index: number) => (
              <MobileCard key={index}>
                <div className="flex justify-end mb-2">
                  <Popover
                    onOpenChange={(open) => open && setPricingInfo(item)}
                  >
                    <PopoverTrigger asChild>
                      <button className="border p-1 rounded-md border-neutral200">
                        <BsThreeDotsVertical
                          size={20}
                          className="p-1 cursor-pointer"
                        />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit p-1">
                      <p
                        className="flex items-center gap-2 py-2 px-4 hover:bg-brand-light rounded-md cursor-pointer"
                        onClick={() => {
                          setPricingInfo(item);
                          setOpenPricing(true);
                          setType("edit");
                        }}
                      >
                        Edit pricing
                      </p>
                      <p
                        className="flex items-center gap-2 py-2 px-4 hover:bg-brand-light rounded-md cursor-pointer"
                        onClick={() => {
                          setSelectedDeleteIndex(index);
                        }}
                      >
                        Delete pricing
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-brand text-sm">
                    Service Level
                  </span>
                  <span className="truncate ml-2 text-sm">
                    {item?.serviceLevel?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-brand text-sm">
                    Base Price
                  </span>
                  <span className="truncate ml-2 text-sm">
                    # {item?.basePrice}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-brand text-sm">
                    Weight Multiplier
                  </span>
                  <span className="truncate ml-2 text-sm">
                    {item?.weightMultiplier}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-brand text-sm">
                    Zone Multiplier
                  </span>
                  <span className="truncate ml-2 text-sm">
                    {item?.zoneMultiplier}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-brand text-sm">
                    % Discount
                  </span>
                  <span className="truncate ml-2 text-sm">
                    {item?.discountPercent}
                  </span>
                </div>
              </MobileCard>
            ))}
          </div>

          <div className="hidden lg:block overflow-auto mb-4">
            <div className="min-w-[1000px] w-full">
              <div className="flex justify-between text-brand text-left px-3 xl:px-4 py-4 lg:text-md font-inter font-semibold bg-brand-light w-full">
                <span className="w-[1%] mr-4">
                  <input type="checkbox" name="" id="" className="mt-[2px]" />
                </span>
                <span className="flex-1">Service level</span>
                <span className="flex-1">Base Price</span>
                <span className="flex-1">Weight Multiplier</span>
                <span className="flex-1">Zone Multiplier</span>
                <span className="flex-1">% Discount </span>
                <span className="w-[2%]"></span>
              </div>

              {companyPricing?.content?.map((item: any, index: number) => {
                return (
                  <div
                    key={index}
                    className={`relative min-h-[60px] gap-2 bg-white py-2 px-3 xl:px-4 text-sm flex items-center ${
                      index === 0
                        ? "border-t-0"
                        : "border-t border-t-neutral300"
                    } hover:bg-brand-light`}
                  >
                    <span className="w-[1%] mr-4">
                      <input
                        type="checkbox"
                        name=""
                        id=""
                        className="mt-[2px]"
                      />
                    </span>
                    <div className="flex-1">
                      <p>{item?.serviceLevel?.name}</p>
                    </div>
                    <div className="flex-1">
                      <p># {item?.basePrice}</p>
                    </div>
                    <div className="flex-1">
                      <p>{item?.weightMultiplier}</p>
                    </div>
                    <div className="flex-1">
                      <p>{item?.zoneMultiplier}</p>
                    </div>
                    <div className="flex-1">
                      <p>{item?.discountPercent}</p>
                    </div>

                    <div className="w-[2%]">
                      <Popover
                        open={activeModalId === index}
                        onOpenChange={(open) =>
                          setActiveModalId(open ? index : null)
                        }
                      >
                        <PopoverTrigger asChild>
                          <button className="border p-1 rounded-md border-neutral200">
                            <BsThreeDotsVertical
                              size={20}
                              className="p-1 cursor-pointer"
                              onClick={() => {
                                setActiveModalId(index);
                              }}
                            />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-fit p-1">
                          <p
                            className="flex items-center gap-2 py-2 px-4 hover:bg-brand-light rounded-md cursor-pointer"
                            onClick={() => {
                              setPricingInfo(item);
                              setOpenPricing(true);
                              setType("edit");
                            }}
                          >
                            Edit pricing
                          </p>
                          <p
                            className="flex items-center gap-2 py-2 px-4 hover:bg-brand-light rounded-md cursor-pointer"
                            onClick={() => {
                              setSelectedDeleteIndex(index);
                            }}
                          >
                            Delete pricing
                          </p>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* render centralized delete modal */}
      {selectedDeleteIndex !== null && (
        <DeleteModal
          open={true}
          onOpenChange={(open) => {
            if (!open) handleDeletePricingModal();
          }}
          title={"Delete company pricing"}
          data={
            companyServices?.content?.[selectedDeleteIndex]?.companyServiceLevel
              ?.name ?? ""
          }
          id={companyServices?.content?.[selectedDeleteIndex]?.id ?? ""}
          handleDelete={() => {
            handleDeletePricing(
              companyServices?.content?.[selectedDeleteIndex]?.id ?? "",
            );
          }}
          loading={pendingDeletePricing}
        />
      )}

      {companyPricing && companyPricing?.content?.length === 0 && (
        <div className="h-[50vh] w-full flex justify-center flex-col items-center">
          <p className="font-semibold font-inter text-xl text-center">
            There are no results
          </p>
        </div>
      )}

      <AddPricingModal
        companyId={companyId}
        openPricing={openPricing}
        setOpenPricing={setOpenPricing}
        type={type}
        info={pricingInfo}
        setPricingInfo={setPricingInfo}
        // companyServiceId={serviceId}
      />
    </div>
  );
};

export default Pricing;
