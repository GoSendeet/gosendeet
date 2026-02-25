import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { BiSolidTrashAlt } from "react-icons/bi";
// import { IoSearchOutline } from "react-icons/io5";
import { CoverageAreaModal } from "./modals/CoverageAreaModal";
import { useGetCoverageArea } from "@/queries/admin/useGetAdminSettings";
import { FiEdit } from "react-icons/fi";
import { Spinner } from "@/components/Spinner";
import { toast } from "sonner";
import { deleteCoverageArea } from "@/services/adminSettings";
import DeleteModal from "@/components/modals/DeleteModal";
import { usePaginationSync } from "@/hooks/usePaginationSync";
import { PaginationComponent } from "@/components/Pagination";

const CoverageArea = () => {
  const [lastPage, setLastPage] = useState(1);
  const { currentPage, updatePage } = usePaginationSync(lastPage);
  const { data, isLoading, isSuccess, isError } = useGetCoverageArea({
    page: currentPage,
  });
  useEffect(() => {
    const totalPages = data?.data?.page?.totalPages;
    if (totalPages && totalPages !== lastPage) {
      setLastPage(totalPages);
    }
  }, [data?.data?.page?.totalPages]);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [type, setType] = useState("");
  const [info, setInfo] = useState<{ id: string; name: string } | null>(null);
  const queryClient = useQueryClient();

  const { mutate: deleteService, isPending: pendingDelete } = useMutation({
    mutationFn: (id: string) => deleteCoverageArea(id), // ✅ call with correct shape

    onSuccess: () => {
      toast.success("Successful");
      setOpenDelete(false);
      queryClient.invalidateQueries({
        queryKey: ["coverage_areas"],
      });
    },

    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  const handleDelete = (id: string) => deleteService(id);
  return (
    <div>
      <div className="flex items-center gap-4 justify-end mb-4">
        {/* <div className="flex items-center gap-2 border-2 rounded-lg h-[40px] px-2 py-2">
          <IoSearchOutline className="text-neutral500" />
          <input
            type="text"
            role="search"
            className="border-0 outline-0 w-[150px] text-sm text-neutral600"
            placeholder="Search"
          />
        </div> */}

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
        <div className="h-[50vh] w-full flex justify-center flex-col items-center">
          <p className="font-semibold font-inter text-xl text-center">
            There was an error getting the data
          </p>
        </div>
      )}

      {!isLoading && isSuccess && data && data?.data?.content?.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <div className="min-w-[700px] w-full relative">
              <div className="flex justify-between text-left px-3 xl:px-4 py-4 text-md font-inter font-semibold bg-purple300 w-full">
                <span className="flex-1">Coverage Areas</span>
                <span className="w-[5%]"></span>
              </div>

              {data?.data?.content?.map((item: any, index: number) => {
                return (
                  <div
                    key={index}
                    className={`relative min-h-[60px] bg-white py-2 px-3 xl:px-4 text-sm flex items-center ${
                      index === 0
                        ? "border-t-0"
                        : "border-t border-t-neutral300"
                    } hover:bg-purple300`}
                  >
                    <div className="flex flex-1">
                      <p>{item?.name}</p>
                      <span className="mx-2">-</span>
                      <p>{item?.code}</p>
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
                );
              })}
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
            There are no results
          </p>
        </div>
      )}

      <CoverageAreaModal
        open={open}
        setOpen={setOpen}
        type={type}
        info={info}
      />

      <DeleteModal
        onOpenChange={setOpenDelete}
        open={openDelete}
        title={"Delete coverage area"}
        data={info?.name ?? ""}
        id={info?.id ?? ""}
        handleDelete={handleDelete}
        loading={pendingDelete}
      />
    </div>
  );
};

export default CoverageArea;
