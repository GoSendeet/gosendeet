import {FranchiseCard} from "@/components/ui/FranchiseCard";
import { CheckCircle } from "lucide-react";

const CompletionsRate = () => {
  return (
    <FranchiseCard
      icon={CheckCircle}
      iconBg="#ECFDF5"
      iconColor="#009966"
      title="Completions Rate"
      value="85%"
      subvalue="This Week"
    />
  );
};

export default CompletionsRate;
