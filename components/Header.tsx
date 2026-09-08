"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import LangToggle from "./LangToggle";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const { t } = useI18n();
  const pathname = usePathname();

  const navItem = (href: string, label: string) => (
    <Link
      href={href}
      className={`font-body text-sm transition-colors ${
        pathname === href
          ? "text-ink dark:text-cream"
          : "text-ink-faint dark:text-cream/50 hover:text-ink-soft dark:hover:text-cream/80"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between px-4 sm:px-8 py-5">
        <Link href="/" className="font-display text-xl text-ink dark:text-cream">
          {t("brand")}
        </Link>
        <nav className="hidden sm:flex items-center gap-6">
          {navItem("/", t("nav.generator"))}
          {navItem("/favorites", t("nav.favorites"))}
          {navItem("/how-it-works", t("nav.howItWorks"))}
        </nav>
        <div className="flex items-center gap-2">
          <LangToggle />
          <ThemeToggle />
        </div>
      </div>
      <nav className="flex sm:hidden items-center gap-5 px-4 pb-3 -mt-2">
        {navItem("/", t("nav.generator"))}
        {navItem("/favorites", t("nav.favorites"))}
        {navItem("/how-it-works", t("nav.howItWorks"))}
      </nav>
    </header>
  );
}
