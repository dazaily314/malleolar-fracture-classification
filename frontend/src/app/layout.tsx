"use client";

import type { SVGProps } from "react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Language } from "@/lib/translations";

/** Icons only: extensions (e.g. Dark Reader) mutate SVG attrs before hydrate; suppress avoids false-positive mismatches. */
function Svg(props: SVGProps<SVGSVGElement>) {
  return <svg suppressHydrationWarning {...props} />;
}

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button 
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-accent hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
    >
      {theme === 'light' ? (
        <Svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></Svg>
      ) : (
        <Svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></Svg>
      )}
    </button>
  );
};

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();
  return (
    <select 
      value={language} 
      onChange={(e) => setLanguage(e.target.value as Language)}
      className="bg-accent text-sm font-medium p-2 rounded-lg border-none focus:ring-2 focus:ring-primary transition-colors"
    >
      <option value="en">EN</option>
      <option value="fr">FR</option>
      <option value="ar">AR</option>
    </select>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const pathname = usePathname();

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 transition-colors">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-md">
            <Svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></Svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">{t('app_title')}</h1>
          </div>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-secondary">
          <Link href="/" className={`hover:text-primary transition-colors ${pathname === '/' ? 'text-primary' : ''}`}>{t('nav_home')}</Link>
          <Link href="/about" className={`hover:text-primary transition-colors ${pathname === '/about' ? 'text-primary' : ''}`}>{t('nav_about')}</Link>
          {user && <Link href="/dashboard" className={`hover:text-primary transition-colors ${pathname.startsWith('/dashboard') ? 'text-primary' : ''}`}>{t('nav_dashboard')}</Link>}
          {user?.role === 'admin' && <Link href="/admin" className={`hover:text-primary transition-colors ${pathname.startsWith('/admin') ? 'text-primary' : ''}`}>{t('nav_admin')}</Link>}
        </nav>

        <div className="flex items-center gap-4">
          <LanguageToggle />
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-secondary hidden sm:block">{user.email}</span>
              <button 
                onClick={logout}
                className="text-sm font-medium text-destructive-foreground bg-destructive hover:opacity-90 px-4 py-2 rounded-lg transition-all"
              >
                {t('nav_logout')}
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors">{t('nav_login')}</Link>
              <Link href="/register" className="text-sm font-medium text-primary-foreground bg-primary hover:opacity-90 px-5 py-2.5 rounded-xl transition-all shadow-sm">{t('nav_register')}</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="fr">
      <body suppressHydrationWarning className="antialiased min-h-screen bg-background text-foreground transition-colors">
        <LanguageProvider>
          <ThemeProvider>
            <AuthProvider>
              <Navbar />
              <main className="max-w-6xl mx-auto px-6 py-8">
                {children}
              </main>
              <footer className="border-t border-border mt-12 py-8 text-center text-sm text-secondary">
                 <p>© 2026 OrthoVision - Malleolar Fracture Classification</p>
              </footer>
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
