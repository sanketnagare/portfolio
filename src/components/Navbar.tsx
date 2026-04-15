"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { label: "Home", href: "/", isHash: false },
  { label: "Experience", href: "#experience", isHash: true },
  { label: "Projects", href: "#projects", isHash: true },
  { label: "Blog", href: "/blog", isHash: false },
  { label: "Resume", href: "/resume.pdf", isHash: false },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ["hero", "about", "experience", "education", "skills", "projects", "contact"];
      for (const section of sections.reverse()) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 200) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  const getHref = (item: typeof navItems[0]) => {
    if (item.isHash && !isHomePage) {
      return `/${item.href}`;
    }
    return item.href;
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileMenuOpen
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-foreground/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          onClick={() => setMobileMenuOpen(false)}
          className="font-heading font-bold text-lg text-foreground hover:text-accent transition-colors"
        >
          SN<span className="text-accent">.</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const sectionId = item.href.replace("#", "");
            const isActive = item.isHash ? activeSection === sectionId : pathname === item.href;
            const isExternal = !item.href.startsWith("#") && !item.href.startsWith("/");

            return (
              <a
                key={item.label}
                href={getHref(item)}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  isActive
                    ? "text-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {isActive && isHomePage && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute inset-0 bg-surface-light rounded-full border border-border/50"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </a>
            );
          })}
        </div>
        
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden p-2 -mr-2 text-foreground flex items-center justify-center focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <div className="w-6 h-5 relative flex flex-col justify-between">
            <span className={`block h-[2px] w-full bg-current rounded-full transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-[9px]' : ''}`} />
            <span className={`block h-[2px] w-full bg-current rounded-full transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-[2px] w-full bg-current rounded-full transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-[9px]' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border/50 overflow-hidden flex flex-col px-6 py-8 pb-32"
          >
            <div className="flex flex-col gap-4">
              {navItems.map((item, i) => {
                const sectionId = item.href.replace("#", "");
                const isActive = item.isHash ? activeSection === sectionId : pathname === item.href;
                const isExternal = !item.href.startsWith("#") && !item.href.startsWith("/");

                return (
                  <motion.a
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                    key={item.label}
                    href={getHref(item)}
                    onClick={() => setMobileMenuOpen(false)}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className={`block py-4 text-2xl font-heading font-semibold border-b border-border/30 transition-colors ${
                      isActive
                        ? "text-accent"
                        : "text-foreground hover:text-accent-light"
                    }`}
                  >
                    {item.label}
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
