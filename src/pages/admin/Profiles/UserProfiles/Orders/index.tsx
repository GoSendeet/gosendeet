import { OrdersPanel } from "@/pages/admin/Orders/components/OrdersPanel";

const Orders = ({ userId }: { userId: string }) => (
  <OrdersPanel senderId={userId} variant="profile" />
);

export default Orders;
