import Layout from "@/layouts/HomePageLayout";
import PageMeta from "@/components/PageMeta";
import Header from "./components/Header";
import Questions from "./components/Questions";
import Answers from "./components/Answers";

const FAQ = () => {
  return (
    <Layout>
      <PageMeta
        title="FAQ | Delivery & Logistics Questions – GoSendeet"
        description="Got questions about delivery pricing, booking or tracking? Find answers to the most common GoSendeet questions for Lagos and Nigeria deliveries."
        path="/faq"
      />
      <Header />
      <Questions />
      <Answers />
    </Layout>
  );
};

export default FAQ;
