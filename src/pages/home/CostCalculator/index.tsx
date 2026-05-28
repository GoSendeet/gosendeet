import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "@/layouts/BookingFlowLayout"
import Calculator from "./components/Calculator"

const CostCalculator = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const userId = sessionStorage.getItem("userId")
    const isUnauthenticated = sessionStorage.getItem("unauthenticated") === "true"
    if (userId && isUnauthenticated) {
      navigate("/dashboard", { replace: true })
    }
  }, [navigate])

  return (
    <Layout>
        <Calculator/>
    </Layout>
  )
}

export default CostCalculator
