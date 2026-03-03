import React from "react";

interface MobileCardProps {
  children: React.ReactNode;
}

const MobileCard: React.FC<MobileCardProps> = ({ children }) => {
  return (
    <div className="bg-white px-4 py-3 mb-3 text-sm rounded-lg shadow-sm border border-neutral200">
      {children}
    </div>
  );
};

export default MobileCard;
