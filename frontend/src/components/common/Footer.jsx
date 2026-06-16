import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Company: [
      { label: 'About Us', to: '/about' },
      { label: 'Careers', to: '/careers' },
      { label: 'Blog', to: '/blog' },
      { label: 'Press', to: '/press' },
    ],
    Support: [
      { label: 'Help Center', to: '/help' },
      { label: 'Safety', to: '/safety' },
      { label: 'Terms of Service', to: '/terms' },
      { label: 'Privacy Policy', to: '/privacy' },
    ],
    Services: [
      { label: 'Become a Partner', to: '/partner' },
      { label: 'Become a Delivery Partner', to: '/delivery-partner' },
      { label: 'Azlaan for Work', to: '/business' },
      { label: 'Gift Cards', to: '/gift-cards' },
    ],
  };

  const socialLinks = [
    { icon: FiFacebook, href: '#', label: 'Facebook' },
    { icon: FiTwitter, href: '#', label: 'Twitter' },
    { icon: FiInstagram, href: '#', label: 'Instagram' },
    { icon: FiYoutube, href: '#', label: 'Youtube' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🍕</span>
              <span className="text-xl font-bold bg-gradient-to-r from-brand-400 to-brand-500 bg-clip-text text-transparent">
                Azlaan
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm mb-6">
              Order your favorite food from the best local restaurants with easy tracking and fast delivery.
              Your cravings, delivered!
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <FiPhone size={14} className="text-brand-400 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FiMail size={14} className="text-brand-400 shrink-0" />
                <span>support@azlaan.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FiMapPin size={14} className="text-brand-400 shrink-0" />
                <span>123 Food Street, Gourmet City, FC 10001</span>
              </div>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} Azlaan Food Delivery. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 bg-gray-800 hover:bg-brand-500 text-gray-400 hover:text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
