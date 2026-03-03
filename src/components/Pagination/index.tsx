import { cn } from "../../lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

const PaginationComponent = ({
  lastPage,
  handlePageChange,
  currentPage,
}: {
  lastPage: number;
  handlePageChange: (newPage: number) => void;
  currentPage: number;
}) => {
  return (
    <section className=" py-3">
      <div className=" md:hidden flex justify-center text-sm text-brand">
        <p>
          Showing page {currentPage} of {lastPage}
        </p>
      </div>

      <Pagination className=" md:py-5 ">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
              aria-disabled={currentPage <= 1}
              tabIndex={currentPage <= 1 ? -1 : 0}
              className={cn(
                "cursor-pointer border border-brand md:border-transparent md:mt-0 text-brand mt-2",
                currentPage <= 1 && "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>

          {/* First page */}
          <PaginationItem>
            <PaginationLink
              isActive={currentPage === 1}
              onClick={() => handlePageChange(1)}
              className=" hidden md:flex cursor-pointer  text-brand"
            >
              1
            </PaginationLink>
          </PaginationItem>

          {/* Ellipsis if necessary */}
          {lastPage > 3 && currentPage > 3 && (
            <PaginationItem>
              <PaginationEllipsis className=" hidden md:flex" />
            </PaginationItem>
          )}

          {/* Pages around current page */}
          {[...Array(lastPage)]
            .map((_, index) => index + 1)
            .filter(
              (page) =>
                page !== 1 &&
                page !== lastPage &&
                page >= currentPage - 1 &&
                page <= currentPage + 1
            )
            .map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === currentPage}
                  onClick={() => handlePageChange(page)}
                  className={cn(
                    "hidden md:flex cursor-pointer",
                    page >= 1000 && "px-[30px] mx-[1px] "
                  )}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

          {/* Ellipsis if necessary */}
          {lastPage > 3 && currentPage < lastPage - 2 && (
            <PaginationItem>
              <PaginationEllipsis className=" hidden md:flex" />
            </PaginationItem>
          )}

          {/* Last page */}
          {lastPage > 1 && (
            <PaginationItem>
              <PaginationLink
                isActive={currentPage === lastPage}
                onClick={() => handlePageChange(lastPage)}
                className=" hidden md:flex cursor-pointer text-brand"
              >
                {lastPage}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(currentPage + 1)}
              aria-disabled={lastPage === currentPage}
              tabIndex={currentPage === lastPage ? -1 : 0}
              className={cn(
                "cursor-pointer border border-brand md:border-transparent md:mt-0 text-brand mt-2",
                currentPage === lastPage && "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </section>
  );
};

export { PaginationComponent };
