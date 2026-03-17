import DeleteModal from "@/components/modals/DeleteModal";
import { useEffect, useRef, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCompanyServices, updateRouteStatus } from "@/services/companies";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AddRoutesModal } from "../../../AddCompany/modals/AddRoutesModal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import MobileCard from "@/components/MobileCard";

const Routes = ({
  companyId,
  companyServices,
}: {
  companyId: string;
  companyServices: any;
}) => {
  const [openRoutesModal, setOpenRoutesModal] = useState(false);
  const [serviceInfo, setServiceInfo] = useState({});
  const [type, setType] = useState("");
  const [selectedDeleteIndex, setSelectedDeleteIndex] = useState<number | null>(null);
  const [activeModalId, setActiveModalId] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (modalRef.current && !modalRef.current.contains(target)) {
        setActiveModalId(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const queryClient = useQueryClient();

  const { mutate: deleteService, isPending: pendingDeleteService } = useMutation({
    mutationFn: (id: string) => deleteCompanyServices(id),
    onSuccess: () => {
      toast.success("Successful");
      setSelectedDeleteIndex(null);
      queryClient.invalidateQueries({ queryKey: ["company_services"] });
    },
    onError: (error: any) => toast.error(error?.message || "Something went wrong"),
  });

  const { mutate: toggleRouteStatus } = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updateRouteStatus(id, isActive),
    onSuccess: () => {
      toast.success("Route status updated");
      queryClient.invalidateQueries({ queryKey: ["company_services"] });
    },
    onError: (error: any) => toast.error(error?.message || "Something went wrong"),
  });

  const items: any[] = Array.isArray(companyServices?.content)
    ? companyServices.content
    : Array.isArray(companyServices)
    ? companyServices
    : [];

  return (
    <div className="py-4">
      <div className="flex justify-between items-center gap-4 mb-6">
        <p className="text-brand md:text-[20px] font-inter font-semibold">Company Routes</p>
        <Button
          variant="secondary"
          onClick={() => { setType("create"); setOpenRoutesModal(true); }}
          className="lg:text-base text-sm bg-brand"
        >
          <FiEdit /> Add <span className="md:block hidden">New</span> Route
        </Button>
      </div>

      {items.length > 0 && (
        <>
          {/* Mobile */}
          <div className="lg:hidden">
            {items.map((item: any, index: number) => (
              <MobileCard key={index}>
                <div className="flex justify-end mb-2">
                  <Popover onOpenChange={(open) => open && setServiceInfo(item)}>
                    <PopoverTrigger asChild>
                      <button className="border p-1 rounded-md border-neutral200">
                        <BsThreeDotsVertical size={20} className="p-1 cursor-pointer" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit p-1">
                      <p
                        className="flex items-center gap-2 py-2 px-4 hover:bg-brand-light rounded-md cursor-pointer"
                        onClick={() => { setServiceInfo(item); setOpenRoutesModal(true); setType("edit"); }}
                      >
                        Edit route
                      </p>
                      <p
                        className="flex items-center gap-2 py-2 px-4 hover:bg-brand-light rounded-md cursor-pointer"
                        onClick={() => toggleRouteStatus({ id: item?.id, isActive: !item?.isActive })}
                      >
                        {item?.isActive === false ? "Enable route" : "Disable route"}
                      </p>
                      <p
                        className="flex items-center gap-2 py-2 px-4 hover:bg-brand-light rounded-md cursor-pointer"
                        onClick={() => setSelectedDeleteIndex(index)}
                      >
                        Delete route
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-brand text-sm">Route</span>
                  <span className="truncate ml-2 text-sm">
                    {item?.crossAreaRoute ? `${item.crossAreaRoute.areaA} - ${item.crossAreaRoute.areaB}` : "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-brand text-sm">Base Price</span>
                  <span className="truncate ml-2 text-sm">₦ {item?.basePrice ?? "-"}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-brand text-sm">Cost/Kg</span>
                  <span className="truncate ml-2 text-sm">₦ {item?.costPerKg ?? "-"}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-brand text-sm">Cost/Km</span>
                  <span className="truncate ml-2 text-sm">₦ {item?.costPerKm ?? "-"}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-brand text-sm">SLAs</span>
                  <span className="truncate ml-2 text-sm">
                    {item?.slaConfigs?.map((s: any) => s.serviceLevelName).join(", ") || "-"}
                  </span>
                </div>
              </MobileCard>
            ))}
          </div>

          {/* Desktop */}
          <div className="hidden lg:block overflow-auto mb-8">
            <div className="min-w-[900px] w-full">
              <div className="flex justify-between text-brand text-left px-3 xl:px-4 py-4 font-inter font-semibold bg-brand-light w-full">
                <span className="flex-[2]">Route</span>
                <span className="flex-1">Base Price</span>
                <span className="flex-1">Cost/Kg</span>
                <span className="flex-1">Cost/Km</span>
                <span className="flex-1">Doorstep Fee</span>
                <span className="flex-[2]">SLAs</span>
                <span className="flex-1">Status</span>
                <span className="w-[2%]"></span>
              </div>

              {items.map((item: any, index: number) => (
                <div
                  key={index}
                  className={`relative min-h-[60px] gap-2 bg-white py-2 px-3 xl:px-4 text-sm flex items-center ${
                    index === 0 ? "border-t-0" : "border-t border-t-neutral300"
                  } hover:bg-brand-light`}
                >
                  <div className="flex-[2]">
                    {item?.crossAreaRoute
                      ? `${item.crossAreaRoute.areaA} - ${item.crossAreaRoute.areaB}`
                      : "-"}
                  </div>
                  <div className="flex-1">₦ {item?.basePrice ?? "-"}</div>
                  <div className="flex-1">₦ {item?.costPerKg ?? "-"}</div>
                  <div className="flex-1">₦ {item?.costPerKm ?? "-"}</div>
                  <div className="flex-1">₦ {item?.doorstepPickupFee ?? "-"}</div>
                  <div className="flex-[2] text-xs text-neutral600">
                    {item?.slaConfigs?.map((s: any) => s.serviceLevelName).join(", ") || "-"}
                  </div>
                  <div className="flex-1">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${item?.isActive === false ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}>
                      {item?.isActive === false ? "Disabled" : "Active"}
                    </span>
                  </div>

                  <div className="w-[2%]">
                    <Popover
                      open={activeModalId === index}
                      onOpenChange={(open) => setActiveModalId(open ? index : null)}
                    >
                      <PopoverTrigger asChild>
                        <button
                          className="border p-1 rounded-md border-neutral200"
                          onClick={(e) => { e.stopPropagation(); setActiveModalId(index); }}
                        >
                          <BsThreeDotsVertical size={20} className="p-1 cursor-pointer" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-fit p-1" onClick={(e) => e.stopPropagation()}>
                        <p
                          className="flex items-center gap-2 py-2 px-4 hover:bg-brand-light rounded-md cursor-pointer"
                          onClick={(e) => { e.stopPropagation(); setServiceInfo(item); setOpenRoutesModal(true); setType("edit"); }}
                        >
                          Edit route
                        </p>
                        <p
                          className="flex items-center gap-2 py-2 px-4 hover:bg-brand-light rounded-md cursor-pointer"
                          onClick={(e) => { e.stopPropagation(); toggleRouteStatus({ id: item?.id, isActive: !item?.isActive }); setActiveModalId(null); }}
                        >
                          {item?.isActive === false ? "Enable route" : "Disable route"}
                        </p>
                        <p
                          className="flex items-center gap-2 py-2 px-4 hover:bg-brand-light rounded-md cursor-pointer"
                          onClick={(e) => { e.stopPropagation(); setSelectedDeleteIndex(index); }}
                        >
                          Delete route
                        </p>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {selectedDeleteIndex !== null && (
        <DeleteModal
          open={true}
          onOpenChange={(open) => { if (!open) setSelectedDeleteIndex(null); }}
          title="Delete route config"
          data={items[selectedDeleteIndex]?.crossAreaRoute
            ? `${items[selectedDeleteIndex].crossAreaRoute.areaA} - ${items[selectedDeleteIndex].crossAreaRoute.areaB}`
            : ""}
          id={items[selectedDeleteIndex]?.id ?? ""}
          handleDelete={() => deleteService(items[selectedDeleteIndex]?.id ?? "")}
          loading={pendingDeleteService}
        />
      )}

      {items.length === 0 && (
        <div className="h-[50vh] w-full flex justify-center flex-col items-center">
          <p className="font-semibold font-inter text-xl text-center">There are no results</p>
        </div>
      )}

      <AddRoutesModal
        companyId={companyId}
        openRoutesModal={openRoutesModal}
        setOpenRoutesModal={setOpenRoutesModal}
        info={serviceInfo}
        setInfo={setServiceInfo}
        type={type}
      />
    </div>
  );
};

export default Routes;
