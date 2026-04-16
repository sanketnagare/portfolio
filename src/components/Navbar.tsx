"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { label: "Home", href: "/", isHash: false },
  { label: "Experience", href: "#experience", isHash: true },
  { label: "Projects", href: "#projects", isHash: true },
  { label: "Blog", href: "/blog", isHash: false },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      if (isHomePage) {
        const sections = ["hero", "about", "experience", "education", "skills", "projects", "contact"];
        for (const section of sections.reverse()) {
          const el = document.getElementById(section);
          if (el && window.scrollY >= el.offsetTop - 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    handleScroll(); // Initialize on mount
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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled || mobileMenuOpen || !isHomePage
          ? "bg-background/95 backdrop-blur-sm border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          onClick={() => setMobileMenuOpen(false)}
          className="font-heading font-semibold text-sm text-accent hover:text-accent-light transition-colors"
        >
          Sanket Nagare
        </Link>

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
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  isActive && isHomePage
                    ? "text-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {item.label}
                {isExternal && (
                  <svg className="w-2.5 h-2.5 ml-0.5 inline opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                )}
              </a>
            );
          })}
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            className="p-2 -mr-2 text-foreground focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <div className="w-5 h-4 relative flex flex-col justify-between">
              <span className={`block h-[1.5px] w-full bg-current rounded-full transition-all duration-200 ${mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block h-[1.5px] w-full bg-current rounded-full transition-all duration-200 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-[1.5px] w-full bg-current rounded-full transition-all duration-200 ${mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border/50 px-6 py-6 pb-12">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => {
              const sectionId = item.href.replace("#", "");
              const isActive = item.isHash ? activeSection === sectionId : pathname === item.href;
              const isExternal = !item.href.startsWith("#") && !item.href.startsWith("/");

              return (
                <a
                  key={item.label}
                  href={getHref(item)}
                  onClick={() => setMobileMenuOpen(false)}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className={`block py-2 text-lg font-heading font-medium transition-colors ${
                    isActive
                      ? "text-accent"
                      : "text-foreground hover:text-accent-light"
                  }`}
                >
                  {item.label}
                  {isExternal && (
                    <svg className="w-2.5 h-2.5 ml-1 inline opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  )}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
