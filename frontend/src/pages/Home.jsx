import React from "react";
import HeroSlider from "../components/Home/HeroSlider";
import CategoryGrid from "../components/Home/CategoryGrid";
import ProductSlider from "../components/Home/ProductSlider";
import FeatureSection from "../components/Home/FeatureSection";
import NewsletterSection from "../components/Home/NewsletterSection";
import { useSelector } from "react-redux";

const Index = () => {
  const { topRatedProducts, newProducts } = useSelector(
    (state) => state.product
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSlider />

      <div className="max-w-7xl mx-auto px-4 pt-6 space-y-6 md:space-y-8">
        {/* Category Section */}
        <CategoryGrid />

        {/* New Arrivals */}
        {newProducts.length > 0 && (
          <section>
            <ProductSlider title="New Arrivals" products={newProducts} />
          </section>
        )}

        {/* Top Rated Products */}
        {topRatedProducts.length > 0 && (
          <section>
            <ProductSlider title="Top Rated Products" products={topRatedProducts} />
          </section>
        )}

        {/* Features / Benefits Section */}
        <FeatureSection />

        {/* Newsletter Subscription */}
        <NewsletterSection />
      </div>
    </div>
  );
};

export default Index;