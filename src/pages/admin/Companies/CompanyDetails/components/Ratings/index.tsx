import positive from "@/assets/icons/thumbs-up.png";
import negative from "@/assets/icons/thumbs-down.png";
import neutral from "@/assets/icons/hand-peace.png";
import avatar from "@/assets/images/avatar1.png";
import Rating from "@/components/Rating";
import {
  useGetCompanyRatings,
  useGetCompanyRatingStats,
} from "@/queries/admin/useGetAdminCompanies";
import { Spinner } from "@/components/Spinner";
import { formatDate } from "@/lib/utils";
import { usePaginationSync } from "@/hooks/usePaginationSync";
import { useEffect, useState } from "react";
import { PaginationComponent } from "@/components/Pagination";
const Ratings = ({ companyId }: { companyId: string }) => {
  const [lastPage, setLastPage] = useState(1);
  const { currentPage, updatePage } = usePaginationSync(lastPage);

  const {
    data: company_ratings,
    isLoading,
    isSuccess,
    isError,
  } = useGetCompanyRatings(companyId, currentPage);

  const { data: stats, isLoading: statsLoading } =
    useGetCompanyRatingStats(companyId);
  const ratingStats = stats?.data;

  useEffect(() => {
    const totalPages = company_ratings?.data?.page?.totalPages;
    if (totalPages && totalPages !== lastPage) {
      setLastPage(totalPages);
    }
  }, [company_ratings?.data?.page?.totalPages]);
  return (
    <>
      {isLoading && !isSuccess && (
        <div className="h-[80vh] w-full flex items-center justify-center">
          <Spinner />
        </div>
      )}

      {isError && !isLoading && (
        <div className="h-[80vh] w-full flex justify-center flex-col items-center">
          <p className="font-semibold font-inter text-xl text-center">
            There was an error getting the data
          </p>
        </div>
      )}

      {!isLoading &&
        !statsLoading &&
        isSuccess &&
        company_ratings &&
        company_ratings?.data?.content?.length > 0 && (
          <div>
            <div className="bg-white mb-8">
              <div className="grid lg:grid-cols-5 grid-cols-2 md:gap-6 gap-6 md:p-6 p-4">
                <div>
                  <p className="font-medium text-sm mb-2">Total Responses</p>
                  <p className="font-semibold md:text-2xl text-xl font-inter">
                    {ratingStats.totalRatings}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-sm mb-2">Average Ratings</p>
                  <p className="font-semibold md:text-2xl text-xl font-inter">
                    {ratingStats.averageRatingScore}/5
                  </p>
                </div>

                <div className="flex gap-2 items-center">
                  <img src={positive} alt="positive" />
                  <div>
                    <p className="font-medium text-sm mb-2">Positive</p>
                    <p className="font-semibold md:text-2xl text-xl font-inter">
                      {ratingStats.percentagePositiveRatings}%
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <img src={neutral} alt="neutral" />
                  <div>
                    <p className="font-medium text-sm mb-2">Neutral</p>
                    <p className="font-semibold md:text-2xl text-xl font-inter">
                      {ratingStats.percentageNeutralRatings}%
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <img src={negative} alt="negative" />
                  <div>
                    <p className="font-medium text-sm mb-2">Negative</p>
                    <p className="font-semibold md:text-2xl text-xl font-inter">
                      {ratingStats.percentageNegativeRatings}%
                    </p>
                  </div>
                </div>
              </div>

              <hr />
            </div>
            {company_ratings?.data?.content?.map((item: any, index: number) => (
              <div className="bg-white mb-8 md:p-6 p-4" key={index}>
                <div className="flex gap-2 items-center mb-4">
                  <img src={avatar} alt="avatar" />
                  <div>
                    <p className="font-medium">{item.ratedBy}</p>
                    <Rating value={item.score} />
                  </div>
                </div>
                {item.comment && <p className="mb-4">"{item.comment}"</p>}
                <p className="text-sm text-neutral500">
                  {formatDate(item.createdAt)}
                </p>
              </div>
            ))}

            <PaginationComponent
              lastPage={company_ratings?.data?.page?.totalPages}
              currentPage={currentPage}
              handlePageChange={updatePage}
            />
          </div>
        )}

      {company_ratings &&
        company_ratings?.data?.content?.length === 0 &&
        !isLoading &&
        isSuccess && (
          <div className="h-[50vh] w-full flex justify-center flex-col items-center">
            <p className="font-semibold font-inter text-xl text-center">
              There are no results
            </p>
          </div>
        )}
    </>
  );
};

export default Ratings;
