
export const PlaceholderTab = ({ label, icon: Icon }: { label: string; icon: React.ElementType }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
      <Icon size={22} className="text-gray-300" />
    </div>
    <p className="text-sm font-semibold text-gray-400">Welcome to {label}</p>
    <p className="text-xs text-gray-300">This section is coming soon.</p>
  </div>
);