import { FaCircleQuestion } from "react-icons/fa6";
import { Link } from "react-router-dom";

export const faqs = [
  {
    question: "How Does GoSendeet Work?",
    answer:
      "We’re your one-stop delivery marketplace. Simply input your pickup and drop-off locations, describe your package, and we instantly pull live quotes from dozens of reliable Nigerian couriers. You compare prices and delivery times side-by-side, book your favourite, pay securely, and we coordinate pickup while you track everything from a single, easy dashboard.",
  },
  {
    question: "What Happens If My Package Doesn’t Get Delivered?",
    answer:
      "Your money is safe with us. In the rare event of a failed delivery, you receive a full, automatic refund straight to your GoSendeet wallet or bank card within hours. Contact our customer service team if you do not receive your parcel at the stipulated time.",
  },
  {
    question: "How Do I Book and Send a Package?",
    answer:
      "Booking takes under two minutes. Head to the homepage or app, enter pickup and delivery addresses, add package details (weight, size, value), view all available options with prices and estimated arrival times, choose one, complete secure payment, and select your preferred pickup time. Riders come to your door, or you can drop off at nearby hubs.",
  },
  {
    question: "What Items Am I Allowed to Send?",
    answer:
      "GoSendeet supports a wide range of items including clothing, electronics, documents, beauty products, non-perishable food, gifts, books, and small household goods. We do not permit hazardous materials, live animals, illegal items, leaking liquids, perishables, or high-value goods without extra insurance. For full details, please review our Terms of Service.",
  },
  {
    question: "How Much Will My Delivery Cost?",
    answer:
      "Pricing depends on the carrier, package weight or size, distance, and service type (such as same-day or standard delivery). GoSendeet shows real-time quotes from multiple trusted partners with no markups or hidden fees. You pay only the carrier’s rate. Use our free instant quote tool on the homepage to compare and get the cheapest option.",
  },
  {
    question: "Can I Track My Parcel?",
    answer: "If you're waiting for a parcel, you can track",
    link: {
      label: "here",
      href: "/track",
    },
  },
];

const Questions = () => {
  return (
    <div className="md:px-20 px-6 py-20 bg-neutral400">
      <h2 className="lg:text-[40px] text-[30px] font-clash font-semibold leading-[130%] mb-12">
        Most Asked{" "}
        <span className="font-tiempos font-normal italic">Questions</span>{" "}
      </h2>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-x-6 md:gap-y-12 gap-y-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-brand-light flex flex-col gap-2 md:p-8 p-4"
          >
            <FaCircleQuestion size={25} className="text-brand" />

            <h3 className="font-clash font-semibold leading-[140%]">
              {faq.question}
            </h3>
            <p className="text-neutral600 leading-[140%]">
              {faq.answer}{" "}
              {faq.link && (
                <Link to={faq.link.href} className="underline">
                  {faq.link.label}
                </Link>
              )}{" "}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Questions;
