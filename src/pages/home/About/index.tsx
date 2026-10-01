import Layout from "@/layouts/HomePageLayout";
import Header from "./components/Header";
import PageMeta from "@/components/PageMeta";
import Purpose from "./components/Purpose";
import Values from "./components/Values";
import Journey from "./components/Journey";
//import MeetTheBuilders from "./components/MeetTheBuilders";
import CTA from "../CTA";

const About = () => {
  return (
    <Layout>
      <PageMeta
        title="About GoSendeet | Our Mission & Story"
        description="GoSendeet connects senders with verified couriers across Lagos and Nigeria. Learn about our mission to make deliveries faster, smarter, and fully insured."
        path="/about"
      />
      <Header />
      <Purpose />
      <Values />
      <Journey />
      {/* <MeetTheBuilders /> */}
      <CTA/>
    </Layout>
  );
};

export default About;
