const DirectQuoteCardSkeleton = () => (
  <div className="max-w-3xl mx-auto my-8 animate-pulse">
    {/* Header row — logo + title + share button */}
    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
      <div className="flex items-center gap-6 mb-4">
        <div className="h-10 w-32 bg-gray-200 rounded" />
        <div className="h-6 w-28 bg-gray-200 rounded" />
      </div>
      <div className="h-9 w-32 bg-gray-200 rounded-lg mb-4" />
    </div>

    {/* Service-level option tabs */}
    <div className="flex gap-2 mb-4">
      {[1, 2].map((i) => (
        <div key={i} className="flex-1 h-16 bg-gray-200 rounded-xl" />
      ))}
    </div>

    {/* Main card */}
    <div className="bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
      <div className="px-4 lg:px-5 py-6 space-y-6">
        {/* Route info */}
        <div className="flex gap-4">
          <div className="shrink-0 w-10 h-10 rounded-lg bg-gray-200" />
          <div className="flex flex-col gap-6 flex-1">
            {[0, 1].map((i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-5 h-5 rounded-full bg-gray-200 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1.5 flex-1">
                  <div className="h-3 w-12 bg-gray-200 rounded" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery time row */}
        <div className="flex items-center justify-between p-4 bg-gray-100 rounded-xl">
          <div className="flex flex-col gap-1.5">
            <div className="h-3 w-40 bg-gray-200 rounded" />
            <div className="h-5 w-28 bg-gray-200 rounded" />
          </div>
          <div className="h-6 w-20 bg-gray-200 rounded-full" />
        </div>

        {/* Cost breakdown rows */}
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
        ))}

        {/* Book Now button */}
        <div className="h-12 w-full bg-gray-200 rounded-xl" />
      </div>
    </div>
  </div>
);

export default DirectQuoteCardSkeleton;
