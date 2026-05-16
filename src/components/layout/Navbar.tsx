"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Menu, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/CartContext";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  Music,
  Package,
  FileText,
  Mail,
} from "lucide-react";

export default function Navbar({
  onCartClick,
}: {
  onCartClick?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const { cart } = useCart();
  const [showSearch, setShowSearch] = useState(false);
  const router = useRouter();
const [query, setQuery] = useState("");
const pathname = usePathname();
const handleSearch = (e: React.FormEvent) => {
  e.preventDefault();

  if (!query.trim()) return;

  router.push(`/beats?search=${encodeURIComponent(query)}`);
};

const [scrolled, setScrolled] = useState(false);
const [hidden, setHidden] = useState(false);
const [lastScrollY, setLastScrollY] = useState(0);

useEffect(() => {
  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    // Shrink effect
    setScrolled(currentScrollY > 20);

    // Hide on scroll down, show on scroll up
    if (currentScrollY > lastScrollY && currentScrollY > 80) {
      setHidden(true); // scrolling down
    } else {
      setHidden(false); // scrolling up
    }

    setLastScrollY(currentScrollY);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [lastScrollY]);

const NavLink = ({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: any;
  label: string;
}) => {
  const isActive = pathname === href;

  return (
    <motion.div
  whileHover={{ y: -2 }}
  className="relative group"
>
      <Link
        href={href}
        className={`
          flex items-center gap-2 px-2 py-1
          transition-all duration-300
          ${isActive ? "text-purple-400" : "text-zinc-300 hover:text-white"}
        `}
      >
        {/* ICON (MAGNETIC EFFECT) */}
        <motion.span
          whileHover={{ x: 2, y: -1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Icon size={16} />
        </motion.span>

        {label}
      </Link>

      {/* 🔥 ACTIVE GLOW LINE */}
      {isActive && (
        <motion.div
          layoutId="nav-underline"
          className="absolute -bottom-1 left-0 right-0 h-[2px] bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]"
        />
      )}

      {/* ✨ HOVER UNDERLINE */}
      <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-purple-400 transition-all duration-300 group-hover:w-full" />
    </motion.div>
  );
};

  return (
    <nav
  className={`
    fixed top-0 w-full z-50
    transition-all duration-300 ease-out

    ${hidden ? "-translate-y-full" : "translate-y-0"}

    ${
      scrolled
        ? "backdrop-blur-2xl bg-black/50 border-b border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.4)] py-2"
        : "backdrop-blur-md bg-black/70 border-b border-zinc-800 py-4"
    }
  `}
>
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          NAKAMIRAH
        </Link>

        {/* Desktop Menu */}
       <div className="hidden md:flex flex-1 justify-center items-center gap-12">

  <NavLink href="/beats" icon={Music} label="Beats" />
  <NavLink href="/kits" icon={Package} label="Sample Kits" />
  <NavLink href="/licenses" icon={FileText} label="Licenses" />
  <NavLink href="/contact" icon={Mail} label="Contact" />

</div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
  
  {/* Search Icon */}
  <form onSubmit={handleSearch} className="relative">
  <input
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    placeholder="Search beats..."
    className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm w-48 focus:w-64 transition"
  />

  <button
    type="submit"
    className="absolute right-2 top-2 text-zinc-400 hover:text-white"
  >
    <Search size={18} />
  </button>
</form>

  {/* Cart (keep your existing code here) */}
  <div
  onClick={onCartClick}
  className="relative cursor-pointer"
>
    <div className="relative cursor-pointer">
      <ShoppingCart size={20} />

      {cart.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-purple-600 text-xs px-2 rounded-full">
          {cart.length}
        </span>
      )}
    </div>
</div>


</div>
          {/* Mobile Menu Button */}
          <Menu
            className="md:hidden cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
      </div>

      {/* Mobile Dropdown */}
      {open && (
  <div className="md:hidden px-6 pb-4 flex flex-col gap-4">

    <Link href="/beats" className="flex items-center gap-2 text-zinc-300 hover:text-purple-400 transition duration-200">
      <Music size={16} />
      Beats
    </Link>

    <Link href="/kits" className="flex items-center gap-2 text-zinc-300 hover:text-purple-400 transition duration-200">
      <Package size={16} />
      Sample Kits
    </Link>

    <Link href="/licenses" className="flex items-center gap-2 text-zinc-300 hover:text-purple-400 transition duration-200">
      <FileText size={16} />
      Licenses
    </Link>

    <Link href="/contact" className="flex items-center gap-2 text-zinc-300 hover:text-purple-400 transition duration-200">
      <Mail size={16} />
      Contact
    </Link>

  </div>
)}

      {showSearch && (
  <div className="absolute top-16 right-6 bg-zinc-900 border border-zinc-800 rounded-xl p-3 w-64">
    <input
      type="text"
      placeholder="Search beats..."
      className="w-full bg-transparent outline-none text-sm"
    />
  </div>

)}

    </nav>
  );
}