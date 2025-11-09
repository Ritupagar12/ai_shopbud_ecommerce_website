import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openItems, setOpenItems] = useState({});

  const faqs = [
    {
      question: 'How can I place an order?',
      answer: 'Browse through our collection, add your favorite items to the cart, and follow the checkout steps to complete your order quickly and securely.'
    },
    {
      question: 'Which payment options do you accept?',
      answer: 'We accept all major credit and debit cards, PayPal, and other secure payment methods for your convenience.'
    },
    {
      question: 'How long will delivery take?',
      answer: 'Standard delivery typically takes 3-5 business days. You can also choose express shipping at checkout for faster delivery.'
    },
    {
      question: 'What is your return or exchange policy?',
      answer: 'We offer a 30-day return or exchange policy on most items. Products should be in their original condition with all tags intact.'
    },
    {
      question: 'Can I track my order?',
      answer: 'Yes! Once your order is shipped, you will receive a tracking number via email to monitor its progress.'
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Currently, we ship to select countries. Please check the shipping options at checkout to see if we deliver to your location.'
    }
  ];

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-3xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground">Everything you need to know about ShopMate</p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-lg overflow-hidden">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-primary/10 transition-colors"
              >
                <h3 className="font-semibold text-foreground">{faq.question}</h3>
                {openItems[index] ? (
                  <ChevronUp className="w-5 h-5 text-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-foreground" />
                )}
              </button>
              {openItems[index] && (
                <div className="px-6 pb-4">
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;