import Layout from "@/layouts/HomePageLayout";
// import Hero from "./Hero";
// import ProcessFlow from "./ProcessFlow";
// import ServicesMinimal from "./ServicesMinimal";
// import Benefits from "./Benefits";
// import TestimonialsV3 from "./TestimonialsV3";
// import FAQMinimal from "./FAQMinimal";
import "./styles.css";
import Header from "./Header";
import Services from "./Services";
import Compare from "./Compare";
import Logistics from "./Logistics";
import Visibility from "./Visibility";

const Home = () => {
  return (
    <div className="v3-minimal-theme">
      <Layout>
        <Header />
        <Services />
        <Compare />
        <Logistics />
        <Visibility />
        {/* <ProcessFlow />
        <ServicesMinimal />
        <Benefits />
        <TestimonialsV3 />
        <FAQMinimal /> */}
      </Layout>
    </div>
  );
};

export default Home;
