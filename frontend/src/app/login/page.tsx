"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      if (!response.ok) {
        throw new Error("Email ou mot de passe incorrect");
      }

      const data = await response.json();
      const userRes = await fetch("http://127.0.0.1:8000/users/me", {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });
      const userData = await userRes.json();

      login(data.access_token, userData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center py-12 px-6">
      <div className="bg-card p-8 rounded-2xl shadow-xl border border-border w-full max-w-md transition-colors">
        <h2 className="text-2xl font-bold text-center text-foreground mb-2">{t('nav_login')}</h2>
        <p className="text-secondary text-center mb-8 text-sm">{t('app_title')}</p>

        {error && (
          <div className="mb-6 p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">{t('user_email')}</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary hover:opacity-90 text-primary-foreground font-medium py-2.5 rounded-xl transition-all shadow-md disabled:opacity-50"
          >
            {isLoading ? "..." : t('nav_login')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-secondary">
          {t('nav_register')}? <Link href="/register" className="text-primary font-medium hover:underline">{t('nav_register')}</Link>
        </p>
      </div>
    </main>
  );
}
