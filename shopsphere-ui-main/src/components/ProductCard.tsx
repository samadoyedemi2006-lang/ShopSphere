import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart, Trash2, Package, Loader2, Check } from "lucide-react";
import { Product, CartItem } from "@/types";

interface ProductCardProps {
  product: Product;
  isAdmin: boolean;
  onDelete: (id: string) => Promise<void>;
}

const ProductCard = ({ product, isAdmin, onDelete }: ProductCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    const savedCart = localStorage.getItem("cart");
    let cartItems: CartItem[] = savedCart ? JSON.parse(savedCart) : [];

    const existingItem = cartItems.find((item) => item.product._id === product._id);
    
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        cartItems = cartItems.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
    } else {
      cartItems.push({ product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cartItems));
    window.dispatchEvent(new Event("cartUpdated"));
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await onDelete(product._id);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStockStatus = () => {
    if (product.stock === 0) {
      return { text: "Out of Stock", className: "text-stock-out" };
    }
    if (product.stock <= 5) {
      return { text: `Only ${product.stock} left`, className: "text-stock-low" };
    }
    return { text: "In Stock", className: "text-stock-available" };
  };

  const stockStatus = getStockStatus();

  return (
    <Card className="group flex h-full flex-col overflow-hidden shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-56 w-full overflow-hidden bg-muted">
        <img
          src={product.image || "/placeholder.png"}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.png";
          }}
        />
        <div className={`absolute inset-0 flex items-center justify-center bg-muted ${product.image ? 'hidden' : ''}`}>
          <Package className="h-16 w-16 text-muted-foreground/40" />
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col p-4">
        {/* Title */}
        <h3 className="mb-2 line-clamp-1 text-lg font-semibold text-foreground">
          {product.name}
        </h3>
        
        {/* Description */}
        <p className="mb-4 line-clamp-2 flex-1 text-sm text-muted-foreground">
          {product.description}
        </p>

        {/* Price & Stock */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-price">
            ${product.price.toFixed(2)}
          </span>
          <span className={`text-sm font-medium ${stockStatus.className}`}>
            {stockStatus.text}
          </span>
        </div>
      </CardContent>

      <CardFooter className="border-t border-border p-4">
        {isAdmin ? (
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Product
              </>
            )}
          </Button>
        ) : (
          <Button
            className="w-full"
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAdded}
            variant={isAdded ? "secondary" : "default"}
          >
            {isAdded ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Added to Cart
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
