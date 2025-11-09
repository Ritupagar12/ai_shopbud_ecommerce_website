import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";

const Footer = () => {
  const footerLinks = {
    company: [
      { name: "About Us", path: "/about" },
      { name: "Careers", path: "#" },
      { name: "Press", path: "#" },
      { name: "Blog", path: "#" },
    ],
    customer: [
      { name: "Contact Us", path: "/contact" },
      { name: "FAQ", path: "/faq" },
      { name: "Shipping Info", path: "#" },
      { name: "Returns", path: "#" },
    ],
    legal: [
      { name: "Privacy Policy", path: "#" },
      { name: "Terms of Service", path: "#" },
      { name: "Cookie Policy", path: "#" },
      { name: "Security", path: "#" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand & Contact */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 mb-4">
              ShopMate
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Your trusted partner for online shopping. Discover amazing products with exceptional quality and service.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400">
                <Mail className="w-5 h-5 text-indigo-500" />
                <span>support@shopmate.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400">
                <Phone className="w-5 h-5 text-indigo-500" />
                <span>+64 (021) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400">
                <MapPin className="w-5 h-5 text-indigo-500" />
                <span>New Zealand, NZ</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-500 dark:text-gray-400 hover:text-indigo-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              {footerLinks.customer.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-500 dark:text-gray-400 hover:text-indigo-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-500 dark:text-gray-400 hover:text-indigo-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-12 shadow-md dark:shadow-lg text-center">
          <h3 className="text-xl font-semibold mb-2">Stay Connected</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Subscribe to our newsletter for exclusive offers and updates
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:scale-105 transition-transform duration-300 font-semibold"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Social Links & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <social.icon className="w-5 h-5 text-indigo-500" />
              </a>
            ))}
          </div>
          <div className="text-center md:text-right text-gray-500 dark:text-gray-400 text-sm">
            <p>© 2024 ShopMate. All rights reserved.</p>
            <p className="text-xs mt-1">Developed By Ritu Pagar</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;