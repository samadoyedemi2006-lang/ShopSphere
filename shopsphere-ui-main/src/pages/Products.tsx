import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { Loader2, Package, AlertCircle } from "lucide-react";
import { Product } from "@/types";

const API_BASE = "http://localhost:5000";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setIsAdmin(role === "admin");
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/products`);
      if (!res.ok) throw new Error("Failed to load products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE}/api/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      alert("Delete failed");
      return;
    }

    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center py-20">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.length === 0 ? (
        <div className="col-span-full text-center">
          <Package className="mx-auto h-12 w-12 text-muted-foreground" />
          <p>No products yet</p>
        </div>
      ) : (
        products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            isAdmin={isAdmin}
            onDelete={handleDeleteProduct}
          />
        ))
      )}
    </div>
  );
};

export default Products;
