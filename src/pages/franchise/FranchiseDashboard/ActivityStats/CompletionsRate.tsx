import {FranchiseCard} from "@/components/ui/FranchiseCard";
import { CheckCircle } from "lucide-react";

const CompletionsRate = ({
  value,
  subvalue,
}: {
  value: string;
  subvalue: string;
}) => {
  return (
    <FranchiseCard
      icon={CheckCircle}
      iconBg="#ECFDF5"
      iconColor="#009966"
      title="Completions Rate"
      value={value}
      subvalue={subvalue}
    />
  );
};

export default CompletionsRate;
