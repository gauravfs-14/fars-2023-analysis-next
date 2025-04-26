"use client";

import { useState, useEffect } from "react";
import {
  Menu,
  X,
  AlertTriangle,
  BarChart3,
  Map,
  Cloud,
  Clock,
  Database,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#hero", icon: <Home className="h-4 w-4 mr-1" /> },
    {
      name: "Stats",
      href: "#quick-stats",
      icon: <BarChart3 className="h-4 w-4 mr-1" />,
    },
    {
      name: "Insights",
      href: "#crash-insights",
      icon: <AlertTriangle className="h-4 w-4 mr-1" />,
    },
    {
      name: "Cities",
      href: "#city-scorecard",
      icon: <Map className="h-4 w-4 mr-1" />,
    },
    {
      name: "Weather",
      href: "#weather-correlation",
      icon: <Cloud className="h-4 w-4 mr-1" />,
    },
    {
      name: "Timeline",
      href: "#crash-timeline",
      icon: <Clock className="h-4 w-4 mr-1" />,
    },
    {
      name: "Explorer",
      href: "#data-explorer",
      icon: <Database className="h-4 w-4 mr-1" />,
    },
  ];

  // Handle smooth scrolling
  interface NavClickEvent extends React.MouseEvent<HTMLAnchorElement> {}

  interface ScrollIntoViewOptions {
    behavior: ScrollBehavior;
    block: ScrollLogicalPosition;
  }

  const handleNavClick = (e: NavClickEvent, href: string): void => {
    e.preventDefault();

    // Close mobile menu if open
    if (isOpen) {
      setIsOpen(false);
    }

    // Get the target element
    const targetId: string = href.replace("#", "");
    const targetElement: HTMLElement | null = document.getElementById(targetId);

    if (targetElement) {
      // Smooth scroll to the element
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      } as ScrollIntoViewOptions);

      // Update URL without reloading the page
      window.history.pushState(null, "", href);
    }
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <a
              href="#hero"
              className="flex items-center"
              onClick={(e) => handleNavClick(e, "#hero")}
            >
              <AlertTriangle className="h-7 w-7 text-blue-600 mr-2" />
              <span className="text-2xl font-bold gradient-heading">
                FARS Dashboard
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <a
                  href={link.href}
                  className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.icon}
                  {link.name}
                </a>
              </motion.div>
            ))}
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white shadow-lg"
        >
          <div className="container mx-auto px-4 py-3 space-y-1">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <a
                  href={link.href}
                  className="flex items-center py-2 text-base font-medium text-gray-700 hover:text-blue-600"
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.icon}
                  <span className="ml-2">{link.name}</span>
                </a>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
