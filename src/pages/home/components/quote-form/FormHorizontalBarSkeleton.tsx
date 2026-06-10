interface FormHorizontalBarSkeletonProps {
  containerClassName: string;
}

export const FormHorizontalBarSkeleton = ({
  containerClassName,
}: FormHorizontalBarSkeletonProps) => {
  return (
    <div className={containerClassName}>
      <div>
        <div className="hidden lg:grid lg:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-6">
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-12 bg-gray-200 rounded" />
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-12 bg-gray-200 rounded" />
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-12 bg-gray-200 rounded" />
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-12 bg-gray-200 rounded" />
          </div>
          <div className="flex gap-3 items-end min-w-[280px]">
            <div className="h-14 bg-gray-300 rounded flex-[2]" />
            <div className="h-14 bg-gray-200 rounded flex-[1]" />
          </div>
        </div>

        <div className="lg:hidden space-y-4">
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-12 bg-gray-200 rounded" />
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-12 bg-gray-200 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-12 bg-gray-200 rounded" />
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-12 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="h-14 bg-gray-300 rounded" />
          <div className="h-14 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
};
