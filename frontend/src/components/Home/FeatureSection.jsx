import { Truck, Shield, Headphones, CreditCard } from 'lucide-react';

const FeatureSection = () => {
  const features = [
    {
      icon: Truck,
      title: 'Fast & Free Shipping',
      description: 'Complimentary worldwide shipping on orders over $50, delivered quickly to your door.'
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Shop with confidence — all transactions are fully encrypted for your peace of mind.'
    },
    {
      icon: Headphones,
      title: '24/7 Customer Support',
      description: 'Our expert team is available around the clock to assist you whenever needed.'
    },
    {
      icon: CreditCard,
      title: 'Easy & Hassle-Free Returns',
      description: 'Return items within 30 days with no stress for a smooth shopping experience.'
    }
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 px-4 sm:px-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="relative p-6 sm:p-8 text-center bg-white dark:bg-gray-800 rounded-3xl shadow-md dark:shadow-lg hover:shadow-xl dark:hover:shadow-2xl transition-shadow duration-500"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 flex items-center justify-center bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full text-white text-2xl sm:text-3xl">
              <feature.icon className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">
              {feature.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;