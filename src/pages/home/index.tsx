import Layout from "@/layouts/HomePageLayout";
import "./styles.css";
import Header from "./Header";
import PageMeta from "@/components/PageMeta";
import DirectDiscount from "./DirectDiscount";
import ComparePrices from "./ComparePrices";
import WhatIsGosendeet from "./WhatIsGosendeet";
import WhereWeDeliver from "./WhereWeDeliver";
import Services from "./Services";
import Compare from "./Compare";
import ScrollReveal from "./components/ScrollReveal";
import Visibility from "./Visibility";
import CTA from "./CTA";

const Home = () => {
  return (
    <div className="v3-minimal-theme">
      <PageMeta
        title="GoSendeet | Courier & Delivery Service in Nigeria"
        description="Compare courier prices from DHL, FedEx, Fez, GIG & UPS or book a verified direct pickup across Lagos and Ibadan. Instant quotes, real-time tracking, fully insured deliveries."
        path="/"
      />
      <Layout>
        <ScrollReveal>
          <Header />
        </ScrollReveal>
        <ScrollReveal>
          <DirectDiscount />
        </ScrollReveal>
        <ScrollReveal>
          <WhatIsGosendeet />
        </ScrollReveal>
        <ScrollReveal>
          <Visibility />
        </ScrollReveal>
        <ScrollReveal>
          <WhereWeDeliver />
        </ScrollReveal>
        <ScrollReveal>
          <ComparePrices />
        </ScrollReveal>
        <ScrollReveal>
          <Services />
        </ScrollReveal>
        <ScrollReveal>
          <Compare />
        </ScrollReveal>
         <ScrollReveal>
          <CTA />
         </ScrollReveal>
        {/* <Compare />
        <Logistics />
        <ServicesMinimal />
        <Benefits />
        <TestimonialsV3 />
        <FAQMinimal /> */}
      </Layout>
    </div>
  );
};

export default Home;
