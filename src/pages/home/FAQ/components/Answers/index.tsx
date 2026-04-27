import account from "@/assets/icons/circle-user.png";
import files from "@/assets/icons/file-circle-question.png";
import team from "@/assets/icons/user-group.png";
import billing from "@/assets/icons/credit-card.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useState } from "react";
import { faqData } from "@/constants";
import Suitable from "../Suitable";
const Answers = () => {
  const options = [
    { value: "account", title: "Account", icon: account },
    { value: "shipment", title: "Shipment Options", icon: files },
    { value: "tracking", title: "Tracking my shipment", icon: team },
    { value: "billing", title: "Billing and payment", icon: billing },
    { value: "bulk", title: "Bulk Shipping", icon: account },
    { value: "pickup", title: "Pickup", icon: files },
    { value: "complaints", title: "Complaints", icon: team },
    { value: "general", title: "General Enquiries", icon: billing },
  ];

  const [selectedTitle, setSelectedTitle] = useState("Account");

  const selectedFAQ = Object.values(faqData).find(
    (item) => item.title === selectedTitle
  );

  return (
    <div className="md:px-20 px-6 pb-10 bg-neutral400">
      <div className="lg:flex lg:flex-row flex-col lg:justify-between mb-8">
        {/* Sidebar Options */}
        <div className="lg:w-[25%] hidden lg:flex flex-col gap-2">
          {options.map(({ title }) => (
            <p
              key={title}
              className={`flex items-center gap-4 font-clash font-semibold px-4 py-2 text-[18px] leading-[140%] cursor-pointer transition-all 
              ${
                selectedTitle === title
                  ? "bg-brand-light rounded"
                  : "hover:bg-brand-light hover:rounded"
              }`}
              onClick={() => setSelectedTitle(title)}
            >
              {/* <img src={icon} alt={title} className="w-[18px] h-[18px]" /> */}
              <span>{title}</span>
            </p>
          ))}
        </div>

        {/* Select options */}
        <Select onValueChange={(value)=>setSelectedTitle(value)} >
          <SelectTrigger className="w-full lg:hidden shadow-scheduleShadow h-16 mb-6 bg-white">
            <SelectValue placeholder="Choose category" />
          </SelectTrigger>
          <SelectContent>
            {options?.map((item, index) => (
              <SelectItem value={item.title} key={index} className="focus:bg-purple200">
                {item.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Content Section */}
        <div className="lg:w-[70%] w-full p-8 bg-white shadow-faqShadow rounded-sm">
          <p className="title font-clash font-semibold lg:text-[40px] md:text-[30px] text-2xl leading-[130%] mb-4">
            {selectedTitle}
          </p>
          <Accordion type="single" collapsible className="w-full">
            {selectedFAQ?.items?.map((item, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="last:border-b-0"
              >
                <AccordionTrigger showArrowIcon={true}>
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-0">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      <Suitable />
    </div>
  );
};

export default Answers;
