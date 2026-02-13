import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">MyEcom</h2>
          <p className="text-gray-400">
            Your one-stop shop for quality products at unbeatable prices.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white transition">
              <Facebook size={20} />
            </a>
            <a href="#" className="hover:text-white transition">
              <Twitter size={20} />
            </a>
            <a href="#" className="hover:text-white transition">
              <Instagram size={20} />
            </a>
            <a href="#" className="hover:text-white transition">
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-2">
          <h3 className="font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href="/shop" className="hover:text-white transition">
                Shop
              </a>
            </li>
            <li>
              <a href="/categories" className="hover:text-white transition">
                Categories
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-white transition">
                About Us
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-white transition">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div className="space-y-2">
          <h3 className="font-semibold text-white mb-3">Customer Service</h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href="/faq" className="hover:text-white transition">
                FAQ
              </a>
            </li>
            <li>
              <a href="/returns" className="hover:text-white transition">
                Returns
              </a>
            </li>
            <li>
              <a href="/shipping" className="hover:text-white transition">
                Shipping
              </a>
            </li>
            <li>
              <a href="/support" className="hover:text-white transition">
                Support
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-3">
          <h3 className="font-semibold text-white mb-3">Subscribe</h3>
          <p className="text-gray-400 text-sm">
            Get the latest updates and offers.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="w-full rounded-l-xl px-4 py-2 text-gray-900 focus:outline-none"
            />
            <button className="bg-black text-white px-4 py-2 rounded-r-xl hover:bg-gray-800 transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800 text-center py-6 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} MyEcom. All rights reserved.
      </div>
    </footer>
  );
}
