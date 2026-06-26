import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { BiSolidTrashAlt } from "react-icons/bi";
import { IoSearchOutline } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { useGetPromoCodes } from "@/queries/admin/useGetAdminSettings";
import { Spinner } from "@/components/Spinner";
import { deletePromoCode, updatePromoCodeStatus } from "@/services/adminSettings";
import { toast } from "sonner";
import DeleteModal from "@/components/modals/DeleteModal";
import { usePaginationSync } from "@/hooks/usePaginationSync";
import { PaginationComponent } from "@/components/Pagination";
import MobileCard from "@/components/MobileCard";
import { PromoCodeModal } from "./modals/PromoCodeModal";
import { formatDate } from "@/lib/utils";

const PromoCodes = () => {
  const [lastPage, setLastPage] = useState(1);
  const { currentPage, updatePage } = usePaginationSync(lastPage);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const { data, isLoading, isSuccess, isError } = useGetPromoCodes({
    page: currentPage,
    search: debouncedSearchTerm,
  });

  useEffect(() => {
    updatePage(1);
  }, [debouncedSearchTerm, updatePage]);

  useEffect(() => {
    const totalPages = data?.data?.page?.totalPages;
    if (totalPages && totalPages !== lastPage) {
      setLastPage(totalPages);
    }
  }, [data?.data?.page?.totalPages,lastPage]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [type, setType] = useState("");
  const [info, setInfo] = useState<{ id: string; code: string } | null>(null);
  const queryClient = useQueryClient();

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updatePromoCodeStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promo_codes"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  const { mutate: deleteCode, isPending: pendingDelete } = useMutation({
    mutationFn: (id: string) => deletePromoCode(id),
    onSuccess: () => {
      toast.success("Successful");
      setOpenDelete(false);
      queryClient.invalidateQueries({ queryKey: ["promo_codes"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  const handleDelete = (id: string) => deleteCode(id);

  return (
    <div>
      <div className="flex items-center gap-4 justify-end mb-4">
        <div className="flex items-center gap-2 border-2 rounded-lg h-10 px-2 py-2">
          <IoSearchOutline className="text-neutral500" />
          <input
            type="text"
            role="search"
            className="border-0 outline-0 w-37.5 text-sm text-neutral600"
            placeholder="Search codes"
            onChange={(e: any) => setSearchTerm(e.target.value)}
          />
        </div>

        <Button
          variant={"secondary"}
          className="h-[42px] bg-brand"
          onClick={() => {
            setOpen(true);
            setType("create");
          }}
        >
          <Plus /> Add new
        </Button>
      </div>

      {isLoading && !isSuccess && (
        <div className="h-[50vh] w-full flex items-center justify-center">
          <Spinner />
        </div>
      )}

      {isError && !isLoading && (
        <div className="h-[50vh] w-full flex justify-center flex-col items-center gap-2">
          <p className="font-semibold font-inter text-xl text-center">
            No promo codes yet
          </p>
          <p className="text-sm text-neutral500 text-center">
            Click "Add new" to create your first promo code.
          </p>
        </div>
      )}

      {!isLoading && isSuccess && data && data?.data?.content?.length > 0 && (
        <>
          {/* Mobile cards */}
          <div className="lg:hidden flex flex-col gap-4 mb-8">
            {data?.data?.content?.map((item: any, idx: number) => (
              <MobileCard key={idx}>
                <div className="flex justify-end mb-2">
                  <FiEdit
                    size={20}
                    className="cursor-pointer text-brand mr-2"
                    onClick={() => {
                      setOpen(true);
                      setType("edit");
                      setInfo(item);
                    }}
                  />
                  <BiSolidTrashAlt
                    size={20}
                    className="cursor-pointer text-[#F56630]"
                    onClick={() => {
                      setOpenDelete(true);
                      setInfo(item);
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="font-medium text-brand">Code</p>
                    <p className="truncate font-mono font-semibold">{item.code}</p>
                  </div>
                  <div>
                    <p className="font-medium text-brand">Discount</p>
                    <p className="truncate">
                      {item.discountType === "PERCENTAGE"
                        ? `${item.discount}%`
                        : `₦ ${item.discount}`}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-brand">Max Uses</p>
                    <p className="truncate">{item.maxUsage}</p>
                  </div>
                  <div>
                    <p className="font-medium text-brand">Used</p>
                    <p className="truncate">{item.usageCount ?? 0}</p>
                  </div>
                  <div>
                    <p className="font-medium text-brand">Expires</p>
                    <p className="truncate">{item.expiresAt ? formatDate(item.expiresAt) : "—"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-brand">Status</p>
                    <Switch
                      checked={item.active}
                      onCheckedChange={() =>
                        updateStatus({ id: item?.id, isActive: !item?.active })
                      }
                    />
                  </div>
                </div>
              </MobileCard>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden lg:block overflow-x-auto">
            <div className="min-w-[900px] w-full relative">
              <div className="flex justify-between text-brand text-left px-3 xl:px-4 py-4 text-sm font-inter font-semibold bg-brand-light w-full">
                <span className="w-[18%]">Code</span>
                <span className="flex-1">Discount</span>
                <span className="flex-1">Max Uses</span>
                <span className="flex-1">Used</span>
                <span className="flex-1">Expires</span>
                <span className="flex-1">Status</span>
                <span className="w-[5%]"></span>
              </div>

              {data?.data?.content?.map((item: any, index: number) => (
                <div
                  key={index}
                  className={`relative min-h-[60px] bg-white py-2 px-3 xl:px-4 text-sm flex items-center ${
                    index === 0 ? "border-t-0" : "border-t border-t-neutral300"
                  } hover:bg-brand-light`}
                >
                  <div className="w-[18%] font-mono font-semibold">{item.code}</div>
                  <div className="flex-1">
                    {item.discountType === "PERCENTAGE"
                      ? `${item.discount}%`
                      : `₦ ${item.discount}`}
                  </div>
                  <div className="flex-1">{item.maxUsage}</div>
                  <div className="flex-1">{item.usageCount ?? 0}</div>
                  <div className="flex-1">
                    {item.expiresAt ? formatDate(item.expiresAt) : "—"}
                  </div>
                  <div className="flex-1">
                    <Switch
                      checked={item.active}
                      onCheckedChange={() =>
                        updateStatus({ id: item?.id, isActive: !item?.active })
                      }
                    />
                  </div>
                  <div className="w-[5%] flex items-center gap-4">
                    <FiEdit
                      size={20}
                      className="cursor-pointer text-brand"
                      onClick={() => {
                        setOpen(true);
                        setType("edit");
                        setInfo(item);
                      }}
                    />
                    <BiSolidTrashAlt
                      size={20}
                      className="cursor-pointer text-[#F56630]"
                      onClick={() => {
                        setOpenDelete(true);
                        setInfo(item);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <PaginationComponent
            lastPage={data?.data?.page?.totalPages}
            currentPage={currentPage}
            handlePageChange={updatePage}
          />
        </>
      )}

      {data && data?.data?.content?.length === 0 && !isLoading && isSuccess && (
        <div className="h-[50vh] w-full flex justify-center flex-col items-center">
          <p className="font-semibold font-inter text-xl text-center">
            There are no promo codes yet
          </p>
        </div>
      )}

      <PromoCodeModal open={open} setOpen={setOpen} type={type} info={info} />

      <DeleteModal
        onOpenChange={setOpenDelete}
        open={openDelete}
        title={"Delete promo code"}
        data={info?.code ?? ""}
        id={info?.id ?? ""}
        handleDelete={handleDelete}
        loading={pendingDelete}
      />
    </div>
  );
};

export default PromoCodes;
