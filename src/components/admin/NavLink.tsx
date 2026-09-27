"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function NavLink({ href, children, exact = false }: { href: string; children: ReactNode; exact?: boolean }) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-lg transition-colors font-semibold flex items-center gap-2.5 border text-xs ${
        isActive
          ? "bg-[#D4AF37]/20 text-[#E5C158] border-[#D4AF37]/30"
          : "bg-transparent text-white/70 hover:bg-[#D4AF37]/10 hover:text-[#E5C158] border-transparent hover:border-[#D4AF37]/20"
      }`}
    >
      {children}
    </Link>
  );
}
