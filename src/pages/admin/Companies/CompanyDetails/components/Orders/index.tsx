import { OrdersPanel } from "@/pages/admin/Orders/components/OrdersPanel";

const Orders = ({ companyId }: { companyId: string }) => (
  <OrdersPanel companyId={companyId} variant="company" />
);

export default Orders;
