import DeleteModal from "@/components/modals/DeleteModal";
import { useEffect, useRef, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCompanyServices } from "@/services/companies";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AddServiceModal } from "../../../AddCompany/modals/AddServiceModal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import MobileCard from "@/components/MobileCard";

const Services = ({
  companyId,
  companyServices,
}: {
  companyId: string;
  companyServices: any;
}) => {
  const [openService, setOpenService] = useState(false);
  const [serviceInfo, setServiceInfo] = useState({});
  const [type, setType] = useState("");

  const [selectedDeleteIndex, setSelectedDeleteIndex] = useState<number | null>(null);
  const handleDeleteModal = () => setSelectedDeleteIndex(null);

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

  const { mutate: deleteService, isPending: pendingDeleteService } =
    useMutation({
      mutationFn: (id: string) => deleteCompanyServices(id), // ✅ call with correct shape

      onSuccess: () => {
        toast.success("Successful");
        handleDeleteModal();
        queryClient.invalidateQueries({
          queryKey: ["company_services"],
        });
      },

      onError: (error: any) => {
        toast.error(error?.message || "Something went wrong");
      },
    });

  const handleDeleteService = (id: string) => deleteService(id);
  return (
    <div className="py-4">
      <div className="flex justify-between items-center gap-4 mb-6">
        <p className="text-brand md:text-[20px] font-inter font-semibold">
          Company Services
        </p>

        <Button
          variant={"secondary"}
          onClick={() => {
            setType("create");
            setOpenService(true);
          }}
          className="lg:text-base text-sm bg-brand"
        >
          <FiEdit /> Add <span className="md:block hidden">New</span> Service
        </Button>
      </div>
      {companyServices && companyServices?.content?.length > 0 && (
        <>
        {/* Card for mobiel screen sizes */}
          <div className="lg:hidden">
            {companyServices?.content?.map((item: any, index: number) => (
              
              <MobileCard key={index}>
                <div className="flex justify-end mb-2">
                  <Popover onOpenChange={(open) => open && setServiceInfo(item)}>
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
                          setServiceInfo(item);
                          setOpenService(true);
                          setType("edit");
                        }}
                      >
                        Edit service
                      </p>
                      <p
                        className="flex items-center gap-2 py-2 px-4 hover:bg-brand-light rounded-md cursor-pointer"
                        onClick={() => {
                          setSelectedDeleteIndex(index);
                        }}
                      >
                        Delete service
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-brand text-sm">
                    Service Level
                  </span>
                  <span className="truncate ml-2 text-sm">
                    {item?.companyServiceLevel?.name}
                  </span>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-brand text-sm">
                    Weight Limit
                  </span>
                  <span className="truncate ml-2 text-sm">
                    {item?.weightLimit}
                  </span>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-brand text-sm">Pickup</span>
                  <span className="truncate ml-2 text-sm">
                    {item?.numberOfDaysForPickup} days
                  </span>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-brand text-sm">
                    Delivery
                  </span>
                  <span className="truncate ml-2 text-sm">
                    {item?.numberOfDaysForDelivery} days
                  </span>
                </div>
              </MobileCard>
            ))}
          </div>

            {/* table for large screen */}
          <div className="hidden lg:block overflow-auto mb-8">
            <div className="min-w-[1000px] w-full">
              <div className="flex justify-between text-brand text-left px-3 xl:px-4 py-4 lg:text-md font-inter font-semibold bg-brand-light w-full">
                <span className="w-[1%] mr-4">
                  <input type="checkbox" name="" id="" className="mt-[2px]" />
                </span>
                <span className="flex-1">Service level</span>
                {/* <span className="flex-1">Coverage Area</span> */}
                <span className="flex-1">Weight Limit</span>
                <span className="flex-1">Pickup</span>
                <span className="flex-1">Delivery</span>
                <span className="w-[2%]"></span>
              </div>

              {companyServices?.content?.map((item: any, index: number) => {
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
                      <p>{item?.companyServiceLevel?.name}</p>
                    </div>

                    <div className="flex-1">
                      <p>{item?.weightLimit}</p>
                    </div>
                    <div className="flex-1">
                      <p>{item?.numberOfDaysForPickup} days</p>
                    </div>
                    <div className="flex-1">
                      <p>{item?.numberOfDaysForDelivery} days</p>
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
                              setServiceInfo(item);
                              setOpenService(true);
                              setType("edit");
                            }}
                          >
                            Edit service
                          </p>
                          <p
                            className="flex items-center gap-2 py-2 px-4 hover:bg-brand-light rounded-md cursor-pointer"
                            onClick={() => {
                              setSelectedDeleteIndex(index);
                            }}
                          >
                            Delete service
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
            if (!open) handleDeleteModal();
          }}
          title={"Delete company service"}
          data={
            companyServices?.content?.[selectedDeleteIndex]
              ?.companyServiceLevel?.name ??
            ""
          }
          id={companyServices?.content?.[selectedDeleteIndex]?.id ?? ""}
          handleDelete={() => {
            handleDeleteService(
              companyServices?.content?.[selectedDeleteIndex]?.id ?? ""
            );
          }}
          loading={pendingDeleteService}
        />
      )}
      {companyServices && companyServices?.content?.length === 0 && (
        <div className="h-[50vh] w-full flex justify-center flex-col items-center">
          <p className="font-semibold font-inter text-xl text-center">
            There are no results
          </p>
        </div>
      )}

      <AddServiceModal
        companyId={companyId}
        openService={openService}
        setOpenService={setOpenService}
        info={serviceInfo}
        setInfo={setServiceInfo}
        type={type}
      />
    </div>
  );
};

export default Services;
