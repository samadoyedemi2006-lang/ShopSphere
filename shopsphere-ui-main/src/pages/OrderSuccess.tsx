import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";

const OrderSuccess = () => {
  const { orderId } = useParams();

  return (
    <div className="container mx-auto max-w-lg px-4 py-16">
      <Card className="text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <CardTitle className="text-2xl">Order Placed Successfully!</CardTitle>
          <CardDescription className="text-base">
            Thank you for your purchase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {orderId && (
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-mono font-semibold text-foreground">{orderId}</p>
            </div>
          )}

          <p className="text-muted-foreground">
            We've sent a confirmation email with your order details. 
            You can track your order status in your order history.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/orders" className="flex-1">
              <Button variant="outline" className="w-full">
                <Package className="mr-2 h-4 w-4" />
                View Orders
              </Button>
            </Link>
            <Link to="/products" className="flex-1">
              <Button className="w-full">
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSuccess;
