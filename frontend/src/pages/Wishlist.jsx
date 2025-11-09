import { useEffect } from "react";
import { useSelector } from "react-redux";
import ProductCard from "../components/Products/ProductCard";

const WishlistPage = () => {
  const wishlist = useSelector((state) => state.wishlist.items);

  // Scroll to top whenever this page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!wishlist.length) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-background">
        <p className="text-center text-lg text-muted-foreground">
          Your wishlist is empty.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-background container mx-auto px-4">
      <h1 className="text-2xl font-bold text-foreground mb-6">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;