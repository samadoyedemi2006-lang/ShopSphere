import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package } from "lucide-react";
import { CartItem } from "@/types";

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    loadCart();
  }, []);

 const loadCart = () => {
  try {
    const savedCart = localStorage.getItem("cart");
    if (!savedCart) {
      setCartItems([]);
      return;
    }

    const parsed = JSON.parse(savedCart);

    // Validate structure
    if (!Array.isArray(parsed)) {
      localStorage.removeItem("cart");
      setCartItems([]);
      return;
    }

    setCartItems(parsed);
  } catch (error) {
    console.error("Cart parse error:", error);
    localStorage.removeItem("cart");
    setCartItems([]);
  }
};


  const saveCart = (items: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(items));
    setCartItems(items);
    // Dispatch event to notify navbar of cart update
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map((item) =>
      item.product._id === productId
        ? { ...item, quantity: Math.min(newQuantity, item.product.stock) }
        : item
    );
    saveCart(updatedCart);
  };

  const removeItem = (productId: string) => {
    const updatedCart = cartItems.filter((item) => item.product._id !== productId);
    saveCart(updatedCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-foreground">Your cart is empty</h2>
          <p className="mt-2 text-muted-foreground">
            Looks like you haven't added any products yet
          </p>
          <Link to="/products">
            <Button className="mt-6">
              <Package className="mr-2 h-4 w-4" />
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <ShoppingCart className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Shopping Cart</h1>
            <p className="text-muted-foreground">
              {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your cart
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={clearCart}>
          Clear Cart
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cartItems.map((item) => {
                if (!item.product || !item.product._id) return null;
              return (
              <Card key={item.product._id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  {/* Product Image */}
                  <div className="h-32 w-full sm:h-auto sm:w-32 flex-shrink-0">
                    <img
                      src={item.product.image || "/placeholder.svg"}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </div>

                  {/* Product Details */}
                  <CardContent className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{item.product.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {item.product.description}
                      </p>
                      <p className="mt-2 text-lg font-bold text-primary">
                        ${item.product.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.product._id, parseInt(e.target.value) || 1)
                          }
                          className="h-8 w-16 text-center"
                          min={1}
                          max={item.product.stock}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => removeItem(item.product._id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            )})}
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? (
                    <span className="text-success">Free</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              {subtotal < 100 && (
                <p className="text-xs text-muted-foreground">
                  Add ${(100 - subtotal).toFixed(2)} more for free shipping
                </p>
              )}
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg" onClick={handleCheckout}>
                {isLoggedIn ? (
                  <>
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  "Login to Checkout"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
