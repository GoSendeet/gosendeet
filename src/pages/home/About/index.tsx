import Layout from "@/layouts/HomePageLayout";
import Header from "./components/Header";
import Purpose from "./components/Purpose";
import Values from "./components/Values";
import Journey from "./components/Journey";
import MeetTheBuilders from "./components/MeetTheBuilders";
import CTA from "../CTA";

const About = () => {
  return (
    <Layout>
      <Header />
      <Purpose />
      <Values />
      <Journey />
      <MeetTheBuilders />
      <CTA/>
    </Layout>
  );
};

export default About;
