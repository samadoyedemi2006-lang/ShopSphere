import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Loader2,
  AlertCircle,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import { Order, OrderStatus } from "@/types";

const API_BASE = "https://backend-02ix.onrender.com";

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  processing: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  shipped: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  delivered: "bg-green-500/10 text-green-600 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
};

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/api/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load orders");
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- LOADING ---------------- */
  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  /* ---------------- ERROR ---------------- */
  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold">Failed to load orders</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={fetchOrders}>Try again</Button>
        </div>
      </div>
    );
  }

  /* ---------------- EMPTY ---------------- */
  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="flex flex-col items-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="mt-6 text-2xl font-bold">No orders yet</h2>
          <p className="mt-2 text-muted-foreground">
            Once you place an order, it will appear here
          </p>
          <Link to="/products">
            <Button className="mt-6">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  /* ---------------- ORDERS LIST ---------------- */
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Package className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">My Orders</h1>
          <p className="text-muted-foreground">{orders.length} order(s)</p>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card
            key={order._id}
            className="overflow-hidden transition-shadow hover:shadow-md"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-base">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </CardTitle>
                  <CardDescription>
                    Placed on{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>

                <Badge className={statusColors[order.status]}>
                  {statusLabels[order.status]}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap items-center gap-4">
                {/* Product preview */}
                <div className="flex -space-x-2">
                  {order.orderItems.slice(0, 3).map((item, index) => (
                    <div
                      key={index}
                      className="h-12 w-12 overflow-hidden rounded-lg border bg-muted"
                    >
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                    </div>
                  ))}

                  {order.orderItems.length > 3 && (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-muted text-sm">
                      +{order.orderItems.length - 3}
                    </div>
                  )}
                </div>

                <p className="text-sm text-muted-foreground">
                  {order.orderItems.length} item
                  {order.orderItems.length !== 1 ? "s" : ""}
                </p>

                <div className="ml-auto text-right">
                  <p className="text-lg font-bold text-primary">
                    ${order.totalAmount.toFixed(2)}
                  </p>
                </div>

                <Link to={`/orders/${order._id}`}>
                  <Button variant="ghost" size="sm">
                    View Details
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Orders;
