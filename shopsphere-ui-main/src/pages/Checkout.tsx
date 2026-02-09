import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MapPin, ShieldCheck, Building2, Copy, Check } from "lucide-react";
import { CartItem, ShippingAddress } from "@/types";

const API_BASE = "http://localhost:5000";

const BANK_DETAILS = {
  bankName: "First National Bank",
  accountName: "Your Store Name Ltd",
  accountNumber: "1234567890",
  routingNumber: "021000021",
  swiftCode: "FNBAUS33",
};

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"shipping" | "payment">("shipping");
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const savedCart = localStorage.getItem("cart");
    if (!savedCart || JSON.parse(savedCart).length === 0) {
      navigate("/cart");
      return;
    }
    setCartItems(JSON.parse(savedCart));
  }, [navigate]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + shipping;

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const token = localStorage.getItem("token");
    const bankReference = `ORD-${Date.now()}`;

    try {
      // Create order with pending status (awaiting admin confirmation)
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image,
        })),
        shippingAddress,
        totalAmount: total,
        paymentMethod: "transfer",
        bankReference,
      };

      const response = await fetch(`${API_BASE}/api/orders/my-orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
       let errorMessage = "Failed to place order";

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // backend returned empty or non-JSON response
        }

        throw new Error(errorMessage);

      }

      const orderResult = await response.json();

      // Clear cart
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));

      // Navigate to success page with order ID
      navigate(`/order-success/${orderResult._id || orderResult.orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header with Steps */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Checkout</h1>
            <p className="text-muted-foreground">Complete your order</p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
            step === "shipping" ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
          }`}>
            <MapPin className="h-4 w-4" />
            <span>Shipping</span>
          </div>
          <div className="h-px w-8 bg-border" />
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
            step === "payment" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}>
            <Building2 className="h-4 w-4" />
            <span>Payment</span>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Forms */}
        <div>
          {step === "shipping" ? (
            <form onSubmit={handleShippingSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                  <CardDescription>Where should we deliver your order?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={shippingAddress.fullName}
                      onChange={handleShippingChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={shippingAddress.address}
                      onChange={handleShippingChange}
                      placeholder="123 Main Street"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleShippingChange}
                        placeholder="New York"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={shippingAddress.postalCode}
                        onChange={handleShippingChange}
                        placeholder="10001"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleShippingChange}
                      placeholder="United States"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={handleShippingChange}
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Continue to Payment
                  </Button>
                </CardContent>
              </Card>
            </form>
          ) : (
            <form onSubmit={handlePaymentSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Bank Transfer
                  </CardTitle>
                  <CardDescription>
                    Transfer the exact amount to complete your order
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {error && (
                    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                      {error}
                    </div>
                  )}

                  {/* Bank Transfer Details */}
                  <div className="space-y-4">
                    <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                      <p className="text-sm font-medium text-foreground">Transfer to the following account:</p>
                      
                      {[
                        { label: "Bank Name", value: BANK_DETAILS.bankName, key: "bankName" },
                        { label: "Account Name", value: BANK_DETAILS.accountName, key: "accountName" },
                        { label: "Account Number", value: BANK_DETAILS.accountNumber, key: "accountNumber" },
                        { label: "Routing Number", value: BANK_DETAILS.routingNumber, key: "routingNumber" },
                        { label: "SWIFT Code", value: BANK_DETAILS.swiftCode, key: "swiftCode" },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground">{item.label}</p>
                            <p className="font-mono text-sm font-medium">{item.value}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(item.value, item.key)}
                            className="h-8 w-8 p-0"
                          >
                            {copiedField === item.key ? (
                              <Check className="h-4 w-4 text-primary" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-lg border border-primary/50 bg-primary/10 p-3 text-sm text-foreground">
                      <p className="font-medium">Important:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1 text-xs">
                        <li>Use the exact amount: <strong>${total.toFixed(2)}</strong></li>
                        <li>Include your email as payment reference</li>
                        <li>Order will be pending until admin confirms payment</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span>Your payment is protected by 256-bit SSL encryption</span>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setStep("shipping")}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Confirm Payment
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          )}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>{cartItems.length} item(s)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.product._id} className="flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-lg bg-muted flex-shrink-0">
                    <img
                      src={item.product.image || "/placeholder.svg"}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-foreground">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Summary (shown on payment step) */}
          {step === "payment" && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Shipping To
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground">{shippingAddress.fullName}</p>
                <p className="text-sm text-muted-foreground">{shippingAddress.address}</p>
                <p className="text-sm text-muted-foreground">
                  {shippingAddress.city}, {shippingAddress.postalCode}
                </p>
                <p className="text-sm text-muted-foreground">{shippingAddress.country}</p>
                <p className="text-sm text-muted-foreground mt-1">{shippingAddress.phone}</p>
              </CardContent>
            </Card>
          )}

          <p className="text-center text-xs text-muted-foreground">
            By placing this order, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;


