"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <main className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center py-20 lg:py-32">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          OrthoVision AI
        </div>
        
        <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-foreground max-w-4xl mb-6">
          {t('hero_title')}
        </h1>
        
        <p className="text-xl text-secondary max-w-2xl mb-12">
          {t('hero_subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/register" className="px-8 py-4 rounded-xl text-lg font-semibold text-primary-foreground bg-primary hover:opacity-90 transition-all shadow-lg hover:-translate-y-1">
            {t('get_started')}
          </Link>
          <Link href="/about" className="px-8 py-4 rounded-xl text-lg font-semibold text-foreground bg-card border border-border hover:bg-accent transition-all">
            {t('learn_more')}
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 border-t border-border">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
            </div>
            <h3 className="text-xl font-bold mb-3">{t('feature_secure')}</h3>
            <p className="text-secondary">Security and privacy are our top priorities.</p>
          </div>
          <div>
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <h3 className="text-xl font-bold mb-3">{t('feature_instant')}</h3>
            <p className="text-secondary">AI-powered analysis in seconds.</p>
          </div>
          <div>
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <h3 className="text-xl font-bold mb-3">{t('feature_classes')}</h3>
            <p className="text-secondary">Comprehensive orthopedic classification.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
