import { useState, useEffect, useCallback } from 'react';
import { User, AuthSession } from '../types';

const STORAGE_KEY_USER = 'kurti_auth_user';
const STORAGE_KEY_TOKEN = 'kurti_auth_token';

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_TOKEN);
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState<boolean>(false);

  // Sync session changes to localStorage
  const saveSession = useCallback((session: AuthSession | null) => {
    if (session && session.user && session.token) {
      setUser(session.user);
      setToken(session.token);
      try {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(session.user));
        localStorage.setItem(STORAGE_KEY_TOKEN, session.token);
      } catch {
        // storage quota
      }
    } else {
      setUser(null);
      setToken(null);
      try {
        localStorage.removeItem(STORAGE_KEY_USER);
        localStorage.removeItem(STORAGE_KEY_TOKEN);
      } catch {
        // ignore
      }
    }
  }, []);

  // Check current session validity on mount
  useEffect(() => {
    if (!token) return;

    fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Sessão expirada');
      })
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(data.user));
        }
      })
      .catch(() => {
        // Clear invalid session
        saveSession(null);
      });
  }, [token, saveSession]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string; message?: string }> => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Falha ao realizar login.' };
      }

      saveSession({ user: data.user, token: data.token });
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erro de conexão com o servidor.' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: 'leitor' | 'editor' = 'leitor'
  ): Promise<{ success: boolean; error?: string; message?: string }> => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Falha ao registrar usuário.' };
      }

      saveSession({ user: data.user, token: data.token });
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erro de conexão com o servidor.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    saveSession(null);
  };

  const demoLogin = async (type: 'admin' | 'editor' | 'leitor') => {
    const creds = {
      admin: { email: 'admin@kurti.com.br', pass: 'admin' },
      editor: { email: 'redacao@kurti.com.br', pass: 'redacao' },
      leitor: { email: 'leitor@kurti.com.br', pass: 'leitor' }
    }[type];

    return login(creds.email, creds.pass);
  };

  return {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isEditor: user?.role === 'editor' || user?.role === 'admin',
    login,
    register,
    logout,
    demoLogin
  };
}
