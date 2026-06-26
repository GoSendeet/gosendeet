import { OrdersPanel } from "./components/OrdersPanel";

const Orders = () => (
  <div>
    <div className="mb-4">
      <h2 className="mb-2 font-inter text-[20px] font-semibold text-brand">
        Orders
      </h2>
      <p className="text-sm text-neutral600">This contains all placed orders</p>
    </div>

    <OrdersPanel variant="admin" persistStatus />
  </div>
);

export default Orders;
