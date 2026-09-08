"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import en from "./en";
import th from "./th";

export type Lang = "en" | "th";

const dictionaries = { en, th };

const LANG_STORAGE_KEY = "fitcolor.lang";

interface I18nContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (path: string, vars?: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function getByPath(obj: any, path: string): unknown {
  return path.split(".").reduce((acc, key) => (acc && typeof acc === "object" ? acc[key] : undefined), obj);
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(LANG_STORAGE_KEY) : null;
    if (stored === "en" || stored === "th") {
      setLangState(stored);
    } else if (typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("th")) {
      setLangState("th");
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    window.localStorage.setItem(LANG_STORAGE_KEY, lang);
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);

  const t = useMemo(() => {
    return (path: string, vars?: Record<string, string>) => {
      const dict = dictionaries[lang];
      const value = getByPath(dict, path);
      let str = typeof value === "string" ? value : path;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          str = str.replace(`{${k}}`, v);
        });
      }
      return str;
    };
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
