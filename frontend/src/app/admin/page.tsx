"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { user, token, isLoading: isAuthLoading } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();
  const [predictions, setPredictions] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<any | null>(null);

  useEffect(() => {
    if (!isAuthLoading) {
      if (!user || user.role !== "admin") {
        router.push("/dashboard");
      } else {
        fetchAdminData();
      }
    }
  }, [user, isAuthLoading, router]);

  const fetchAdminData = async () => {
    try {
      const usersRes = await fetch("http://127.0.0.1:8000/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (usersRes.ok) setUsers(await usersRes.json());

      const predsRes = await fetch("http://127.0.0.1:8000/admin/predictions", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (predsRes.ok) setPredictions(await predsRes.json());
    } catch (err: any) {
      setError("Erreur de connexion au serveur.");
    }
  };

  const deleteUser = async (userId: number) => {
    if (!confirm(t('confirm_delete'))) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchAdminData();
    } catch (err) {
      setError("Erreur lors de la suppression de l'utilisateur.");
    }
  };

  const deletePrediction = async (predId: number) => {
    if (!confirm(t('confirm_delete'))) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/admin/predictions/${predId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchAdminData();
    } catch (err) {
      setError("Erreur lors de la suppression de la prédiction.");
    }
  };

  const promoteUser = async (userId: number) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/admin/users/${userId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ role: "admin" })
      });
      if (res.ok) fetchAdminData();
    } catch (err) {
      setError("Erreur lors de la promotion.");
    }
  };

  if (isAuthLoading || !user || user.role !== "admin") {
    return <div className="min-h-screen flex items-center justify-center">Vérification...</div>;
  }

  return (
    <div className="space-y-12">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('nav_admin')}</h1>
      </header>
      
      {error && <div className="p-4 bg-destructive/10 text-destructive rounded-xl border border-destructive/20">{error}</div>}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* User Management */}
        <section className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="p-6 border-b border-border bg-accent/50 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">{t('admin_users')}</h2>
            <span className="bg-primary/10 text-primary py-1 px-3 rounded-full text-xs font-bold">{users.length}</span>
          </div>
          <div className="divide-y divide-border overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-accent/30 text-secondary uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-3 font-semibold">{t('user_fullname')}</th>
                  <th className="px-6 py-3 font-semibold">{t('user_role')}</th>
                  <th className="px-6 py-3 font-semibold text-right">{t('user_actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-accent/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{u.full_name}</div>
                      <div className="text-xs text-secondary">{u.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${u.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 rtl:space-x-reverse">
                      {u.role !== 'admin' && (
                        <button onClick={() => promoteUser(u.id)} className="text-primary hover:underline text-xs">{t('admin_promote')}</button>
                      )}
                      {u.id !== user.id && (
                        <button onClick={() => deleteUser(u.id)} className="text-destructive hover:underline text-xs">{t('admin_delete')}</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Prediction Management */}
        <section className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="p-6 border-b border-border bg-accent/50 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">{t('admin_predictions')}</h2>
            <span className="bg-primary/10 text-primary py-1 px-3 rounded-full text-xs font-bold">{predictions.length}</span>
          </div>
          <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
            {predictions.length === 0 ? (
              <p className="p-6 text-secondary text-center">{t('no_history')}</p>
            ) : (
              predictions.map(p => {
                const date = new Date(p.created_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : language === 'fr' ? 'fr-FR' : 'en-US', { 
                  hour: '2-digit', minute: '2-digit' 
                });
                return (
                  <div key={p.id} className="p-4 flex items-center justify-between hover:bg-accent/20 transition-colors">
                    <div>
                      <p className="font-medium text-foreground">{p.predicted_class}</p>
                      <p className="text-[10px] text-secondary">User #{p.user_id} • {date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-sm font-bold text-primary">{(p.confidence * 100).toFixed(1)}%</span>
                        <p className="text-[10px] text-secondary max-w-[80px] truncate">{p.filename}</p>
                      </div>
                      <button 
                        onClick={() => deletePrediction(p.id)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
