import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Menu, X, Shield, LogOut, User, ShoppingCart, Package } from "lucide-react";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    setIsLoggedIn(!!token);
    setIsAdmin(role === "admin");
    updateCartCount();
  }, [location]);

  useEffect(() => {
    const handleCartUpdate = () => updateCartCount();
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  const updateCartCount = () => {
    const cart = localStorage.getItem("cart");
    if (cart) {
      const items = JSON.parse(cart);
      const count = items.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0);
      setCartCount(count);
    } else {
      setCartCount(0);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setIsAdmin(false);
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            to="/products" 
            className="flex items-center gap-2 text-xl font-bold text-foreground transition-colors hover:text-primary"
            onClick={closeMobileMenu}
          >
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span>ShopHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            <Link to="/products">
              <Button 
                variant={isActive("/products") ? "secondary" : "ghost"}
                className="font-medium"
              >
                Products
              </Button>
            </Link>

            {isLoggedIn && (
              <Link to="/orders">
                <Button 
                  variant={isActive("/orders") ? "secondary" : "ghost"}
                  className="font-medium"
                >
                  <Package className="mr-2 h-4 w-4" />
                  My Orders
                </Button>
              </Link>
            )}
            
            {isAdmin && (
              <Link to="/admin">
                <Button 
                  variant={isActive("/admin") ? "secondary" : "ghost"}
                  className="font-medium"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Admin
                </Button>
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative">
              <Button 
                variant={isActive("/cart") ? "secondary" : "ghost"}
                size="icon"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">
                    {cartCount > 99 ? "99+" : cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <div className="ml-4 flex items-center gap-2">
              {isLoggedIn ? (
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="font-medium"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="font-medium">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="font-medium">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Cart */}
            <Link to="/cart" className="relative" onClick={closeMobileMenu}>
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">
                    {cartCount > 99 ? "99+" : cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="animate-fade-in border-t border-border py-4 md:hidden">
            <div className="flex flex-col gap-2">
              <Link to="/products" onClick={closeMobileMenu}>
                <Button 
                  variant={isActive("/products") ? "secondary" : "ghost"}
                  className="w-full justify-start font-medium"
                >
                  Products
                </Button>
              </Link>

              {isLoggedIn && (
                <Link to="/orders" onClick={closeMobileMenu}>
                  <Button 
                    variant={isActive("/orders") ? "secondary" : "ghost"}
                    className="w-full justify-start font-medium"
                  >
                    <Package className="mr-2 h-4 w-4" />
                    My Orders
                  </Button>
                </Link>
              )}
              
              {isAdmin && (
                <Link to="/admin" onClick={closeMobileMenu}>
                  <Button 
                    variant={isActive("/admin") ? "secondary" : "ghost"}
                    className="w-full justify-start font-medium"
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Admin
                  </Button>
                </Link>
              )}

              <div className="mt-2 border-t border-border pt-2">
                {isLoggedIn ? (
                  <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    className="w-full justify-start font-medium"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                ) : (
                  <>
                    <Link to="/login" onClick={closeMobileMenu}>
                      <Button variant="ghost" className="w-full justify-start font-medium">
                        <User className="mr-2 h-4 w-4" />
                        Login
                      </Button>
                    </Link>
                    <Link to="/register" onClick={closeMobileMenu}>
                      <Button className="mt-2 w-full font-medium">
                        Register
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
