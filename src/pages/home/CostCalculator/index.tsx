import Layout from "@/layouts/BookingFlowLayout"
import Calculator from "./components/Calculator"
import PageMeta from "@/components/PageMeta"

const CostCalculator = () => {
  return (
    <Layout>
      <PageMeta
        title="Delivery Price Calculator | Compare Courier Costs – GoSendeet"
        description="Get instant delivery quotes from DHL, FedEx, GIG, UPS, Fez and GoSendeet Direct. Compare courier prices and book your delivery in minutes across Lagos and Nigeria."
        path="/cost-calculator"
      />
      <Calculator/>
    </Layout>
  )
}

export default CostCalculator
