import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Next-Gen Electronics",
      subtitle: "Innovation at your fingertips",
      description: "Discover cutting-edge headphones, smartwatches, and gadgets with up to 50% off",
      image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1801",
      cta: "Shop Electronics",
      url: "/products?category=Electronics",
    },
    {
      id: 2,
      title: "Chic & Comfortable Fashion",
      subtitle: "Style that speaks",
      description: "Elevate your wardrobe with our latest designer arrivals and statement pieces",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740",
      cta: "Explore Fashion",
      url: "/products?category=Fashion",
    },
    {
      id: 3,
      title: "Home Essentials & Decor",
      subtitle: "Transform your living space",
      description: "Beautiful furniture and decor to make every corner of your home stunning",
      image: "https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=627",
      cta: "Shop Home",
      url: "/products?category=Home & Garden",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const slide = slides[currentSlide];

  return (
    <div className="relative h-[75vh] sm:h-[65vh] md:h-[70vh] overflow-hidden rounded-3xl shadow-xl">
      {/* Slide Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url(${slide.image})` }}
      />
      <div className="absolute inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm" />

      {/* Slide Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8">
        <div className="max-w-3xl animate-fade-in-up">
          <h3 className="text-md sm:text-lg md:text-xl font-medium text-indigo-300 mb-2">
            {slide.subtitle}
          </h3>
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white dark:text-gray-100 mb-4 drop-shadow-lg">
            {slide.title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            {slide.description}
          </p>
          <Link
            to={slide.url}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold text-lg hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            {slide.cta}
          </Link>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="hidden sm:flex absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 p-3 bg-white/20 dark:bg-gray-800/40 backdrop-blur-md rounded-full hover:bg-white/40 dark:hover:bg-gray-700/50 transition-all duration-300"
      >
        <ChevronLeft className="w-6 h-6 text-white dark:text-gray-100" />
      </button>
      <button
        onClick={nextSlide}
        className="hidden sm:flex absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2 p-3 bg-white/20 dark:bg-gray-800/40 backdrop-blur-md rounded-full hover:bg-white/40 dark:hover:bg-gray-700/50 transition-all duration-300"
      >
        <ChevronRight className="w-6 h-6 text-white dark:text-gray-100" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-indigo-500 shadow-lg"
                : "bg-white/40 dark:bg-gray-400/40 hover:bg-white/60 dark:hover:bg-gray-500/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;