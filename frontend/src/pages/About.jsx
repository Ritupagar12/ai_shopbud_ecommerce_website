import { Users, Target, Award, Heart } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Our customers are at the center of everything we do. Your satisfaction drives us.'
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Every product meets our high standards to ensure excellence and reliability.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'We build lasting relationships and foster a strong, supportive community.'
    },
    {
      icon: Target,
      title: 'Innovation',
      description: 'Constantly evolving our platform to provide a seamless and modern shopping experience.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
            About ShopMate
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your go-to e-commerce platform for top-quality products and an exceptional shopping experience.
          </p>
        </div>

        {/* Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-md dark:shadow-lg hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <value.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{value.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
            </div>
          ))}
        </div>

        {/* Our Story */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 shadow-md dark:shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Our Story
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
            Founded with a vision to make online shopping effortless and enjoyable, ShopMate has grown into a trusted platform for thousands of customers worldwide. We believe everyone deserves access to high-quality products at fair prices, supported by outstanding customer service that truly cares.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;