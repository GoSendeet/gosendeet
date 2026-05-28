const CompareCardSkeleton = () => (
  <div className="bg-white rounded-xl overflow-hidden border-2 border-gray-200 shadow-md animate-pulse">
    <div className="flex flex-col md:flex-row md:items-center justify-between p-5 lg:p-8 gap-6">
      {/* Left — logo + name + rating + verified */}
      <div className="xl:w-1/4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="shrink-0 w-14 h-14 rounded-lg bg-gray-200" />
          <div className="flex flex-col gap-2">
            <div className="h-4 w-28 bg-gray-200 rounded" />
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-3 w-3 rounded-full bg-gray-200" />
              ))}
              <div className="h-3 w-8 bg-gray-200 rounded ml-1" />
            </div>
          </div>
        </div>
        <div className="h-6 w-20 bg-gray-200 rounded-sm" />
      </div>

      {/* Center — pickup / delivery timeline */}
      <div className="xl:w-1/2 flex items-center justify-center gap-8">
        <div className="flex flex-col gap-2 text-center lg:text-left">
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-4 w-28 bg-gray-200 rounded" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-1 w-24 bg-gray-200 rounded-full" />
          <div className="h-3 w-8 bg-gray-200 rounded" />
        </div>
        <div className="hidden lg:flex flex-col gap-2">
          <div className="h-3 w-20 bg-gray-200 rounded" />
          <div className="h-4 w-24 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Right — price + button */}
      <div className="flex flex-col md:items-end items-center gap-4 xl:w-1/4">
        <div className="h-9 w-32 bg-gray-200 rounded" />
        <div className="h-10 w-40 bg-gray-200 rounded-2xl" />
      </div>
    </div>
  </div>
);

export default CompareCardSkeleton;
