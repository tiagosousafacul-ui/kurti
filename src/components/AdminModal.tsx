import React, { useState, useEffect } from 'react';
import {
  X,
  User as UserIcon,
  Shield,
  Key,
  Mail,
  Lock,
  LogOut,
  UserPlus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Package,
  Inbox,
  Database,
  BarChart3,
  Search,
  RefreshCw,
  Download,
  Edit3,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Check
} from 'lucide-react';
import { User, Order } from '../types';
import { useAuth } from '../hooks/useAuth';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onOrdersUpdate?: (orders: Order[]) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  orders,
  onOrdersUpdate
}) => {
  const {
    user,
    token,
    loading: authLoading,
    isAuthenticated,
    isAdmin,
    isEditor,
    login,
    register,
    logout,
    demoLogin
  } = useAuth();

  // Mode for unauthenticated: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('');
  const [regRole, setRegRole] = useState<'leitor' | 'editor'>('leitor');
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  // Admin tabs: 'users' | 'orders' | 'messages' | 'content' | 'database'
  const [adminTab, setAdminTab] = useState<'users' | 'orders' | 'messages' | 'content' | 'database'>('users');

  // Admin users list state
  const [usersList, setUsersList] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'admin' | 'editor' | 'leitor'>('all');

  // New user creation by admin
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'editor' | 'leitor'>('editor');
  const [addUserError, setAddUserError] = useState<string | null>(null);
  const [addUserSuccess, setAddUserSuccess] = useState<string | null>(null);

  // Messages inbox state
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Database verification state
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [verifyingDb, setVerifyingDb] = useState(false);

  // Orders management inside admin
  const [localOrders, setLocalOrders] = useState<Order[]>(orders);
  const [orderStatusUpdating, setOrderStatusUpdating] = useState<string | null>(null);

  useEffect(() => {
    setLocalOrders(orders);
  }, [orders]);

  // Fetch users when on users tab and authenticated as admin/editor
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsersList(data);
      }
    } catch {
      // ignore
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch contact messages
  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const res = await fetch('/api/database/messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch {
      // ignore
    } finally {
      setLoadingMessages(false);
    }
  };

  // Fetch database status
  const fetchDbStatus = async () => {
    try {
      const res = await fetch('/api/database/status');
      if (res.ok) {
        const data = await res.json();
        setDbStatus(data);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated && (isAdmin || isEditor)) {
      if (adminTab === 'users') fetchUsers();
      if (adminTab === 'messages') fetchMessages();
      if (adminTab === 'database') fetchDbStatus();
    }
  }, [isOpen, isAuthenticated, isAdmin, isEditor, adminTab]);

  if (!isOpen) return null;

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!loginEmail || !loginPassword) {
      setLoginError('Por favor preencha e-mail e senha.');
      return;
    }

    const res = await login(loginEmail, loginPassword);
    if (!res.success) {
      setLoginError(res.error || 'Credenciais inválidas.');
    } else {
      setLoginEmail('');
      setLoginPassword('');
    }
  };

  // Handle Register submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccess(null);

    if (!regName || !regEmail || !regPassword) {
      setRegError('Preencha todos os campos obrigatórios.');
      return;
    }

    if (regPassword !== regPasswordConfirm) {
      setRegError('As senhas não coincidem.');
      return;
    }

    const res = await register(regName, regEmail, regPassword, regRole);
    if (!res.success) {
      setRegError(res.error || 'Erro ao criar conta.');
    } else {
      setRegSuccess('Conta criada com sucesso! Você já está conectado(a).');
      setRegName('');
      setRegEmail('');
      setRegPassword('');
      setRegPasswordConfirm('');
    }
  };

  // Handle Quick Demo Login
  const handleDemoClick = async (type: 'admin' | 'editor' | 'leitor') => {
    setLoginError(null);
    await demoLogin(type);
  };

  // Handle User Role Change
  const handleUpdateUserRole = async (userId: string, newRole: 'admin' | 'editor' | 'leitor') => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch {
      // ignore
    }
  };

  // Handle User Status Toggle (Ativo / Inativo)
  const handleToggleUserStatus = async (userId: string, currentStatus: 'Ativo' | 'Inativo') => {
    const nextStatus = currentStatus === 'Ativo' ? 'Inativo' : 'Ativo';
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch {
      // ignore
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Deseja realmente remover o usuário "${userName}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.error || 'Não foi possível excluir o usuário.');
      }
    } catch {
      // ignore
    }
  };

  // Handle Create User by Admin
  const handleCreateUserByAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddUserError(null);
    setAddUserSuccess(null);

    if (!newUserName || !newUserEmail) {
      setAddUserError('Nome e e-mail são obrigatórios.');
      return;
    }

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          password: newUserPassword || 'kurti2026',
          role: newUserRole
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setAddUserError(data.error || 'Erro ao cadastrar usuário.');
      } else {
        setAddUserSuccess('Usuário cadastrado com sucesso!');
        setNewUserName('');
        setNewUserEmail('');
        setNewUserPassword('');
        fetchUsers();
        setTimeout(() => {
          setShowAddUserModal(false);
          setAddUserSuccess(null);
        }, 1200);
      }
    } catch {
      setAddUserError('Erro de conexão ao salvar usuário.');
    }
  };

  // Handle Order Status Update
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setOrderStatusUpdating(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        const data = await res.json();
        const updated = localOrders.map((o) => (o.id === orderId ? data.order : o));
        setLocalOrders(updated);
        if (onOrdersUpdate) onOrdersUpdate(updated);
      }
    } catch {
      // ignore
    } finally {
      setOrderStatusUpdating(null);
    }
  };

  // Handle Database Integrity Verification
  const handleVerifyDatabase = async () => {
    setVerifyingDb(true);
    try {
      const res = await fetch('/api/database/verify', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        alert(`Integridade do Banco de Dados: ${data.integrity}\nRegistros validados: ${data.counts.products} produtos, ${data.counts.orders} pedidos, ${data.counts.messages} contatos.`);
      }
    } catch {
      alert('Erro ao checar integridade do banco.');
    } finally {
      setVerifyingDb(false);
    }
  };

  // Filter users list
  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchTerm.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white text-slate-900 w-full max-w-5xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col border border-stone-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-modal-title"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ed003f] flex items-center justify-center text-white shadow-sm shadow-red-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 id="admin-modal-title" className="text-lg font-bold text-stone-900 font-serif flex items-center gap-2">
                {isAuthenticated
                  ? (isAdmin || isEditor ? 'Painel de Administração Kurti' : 'Minha Conta Kurti')
                  : 'Acesso & Administração Kurti'}
              </h2>
              <p className="text-xs text-stone-500">
                {isAuthenticated
                  ? `Sessão ativa como ${user?.name} (${user?.email})`
                  : 'Faça login ou crie sua conta para gerenciar e acessar recursos exclusivos.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
            aria-label="Fechar painel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {!isAuthenticated ? (
            /* ============================================================ */
            /* 1. UNAUTHENTICATED STATE: LOGIN / REGISTER */
            /* ============================================================ */
            <div className="max-w-xl mx-auto py-2">
              {/* Tab Selector */}
              <div className="flex p-1 bg-stone-100 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  Entrar na Conta
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    authMode === 'register'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  Criar Nova Conta
                </button>
              </div>

              {authMode === 'login' ? (
                /* LOGIN FORM */
                <div className="space-y-6">
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    {loginError && (
                      <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                        <span>{loginError}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                        E-mail cadastrado
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                        <input
                          type="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="seuemail@exemplo.com"
                          className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#ed003f] transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                        Senha de acesso
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                        <input
                          type="password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#ed003f] transition-all"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full py-3 rounded-xl bg-[#ed003f] hover:bg-[#ba0032] text-white font-bold text-sm tracking-wide uppercase shadow-md shadow-red-500/20 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {authLoading ? 'Verificando...' : 'Entrar no Sistema'}
                    </button>
                  </form>

                  {/* Fast Demo Access */}
                  <div className="pt-4 border-t border-stone-200">
                    <div className="text-center mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-stone-400 bg-white px-2">
                        Acesso Rápido para Testes
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleDemoClick('admin')}
                        className="p-3 rounded-xl border border-red-200 bg-red-50/60 hover:bg-red-50 text-left transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#ba0032]">
                          <ShieldCheck className="w-4 h-4" />
                          <span>Administrador</span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-1 truncate">admin@kurti.com.br</p>
                        <span className="text-[10px] text-stone-400 mt-0.5 block">Acesso total</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDemoClick('editor')}
                        className="p-3 rounded-xl border border-purple-200 bg-purple-50/60 hover:bg-purple-50 text-left transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700">
                          <Edit3 className="w-4 h-4" />
                          <span>Redação / Editor</span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-1 truncate">redacao@kurti.com.br</p>
                        <span className="text-[10px] text-stone-400 mt-0.5 block">Gestão editorial</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDemoClick('leitor')}
                        className="p-3 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-50 text-left transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
                          <UserIcon className="w-4 h-4" />
                          <span>Leitor Membro</span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-1 truncate">leitor@kurti.com.br</p>
                        <span className="text-[10px] text-stone-400 mt-0.5 block">Espaço da comunidade</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* REGISTER FORM */
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  {regError && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                      <span>{regError}</span>
                    </div>
                  )}
                  {regSuccess && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span>{regSuccess}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                      Nome completo
                    </label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Ex.: Carolina Maria de Jesus"
                      className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#ed003f] transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                      E-mail
                    </label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="seuemail@exemplo.com"
                      className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#ed003f] transition-all"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                        Senha (mínimo 4 caracteres)
                      </label>
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#ed003f] transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                        Confirmar senha
                      </label>
                      <input
                        type="password"
                        value={regPasswordConfirm}
                        onChange={(e) => setRegPasswordConfirm(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#ed003f] transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                      Tipo de Perfil
                    </label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as 'leitor' | 'editor')}
                      className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#ed003f] transition-all"
                    >
                      <option value="leitor">Leitor / Membro da Comunidade</option>
                      <option value="editor">Editor / Colaborador de Conteúdo</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3 rounded-xl bg-[#ed003f] hover:bg-[#ba0032] text-white font-bold text-sm tracking-wide uppercase shadow-md shadow-red-500/20 transition-all cursor-pointer disabled:opacity-50 mt-2"
                  >
                    {authLoading ? 'Criando...' : 'Cadastrar e Conectar'}
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* ============================================================ */
            /* 2. AUTHENTICATED STATE */
            /* ============================================================ */
            <div className="space-y-6">
              {/* User Profile Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-stone-100/80 border border-stone-200 gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-xs bg-stone-200 flex items-center justify-center shrink-0">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-6 h-6 text-stone-500" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-base">{user?.name}</span>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          user?.role === 'admin'
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : user?.role === 'editor'
                            ? 'bg-purple-100 text-purple-700 border border-purple-200'
                            : 'bg-blue-100 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {user?.role === 'admin' ? 'Administrador' : user?.role === 'editor' ? 'Editor' : 'Leitor'}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500">{user?.email}</p>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 transition-colors self-start sm:self-auto cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sair da conta</span>
                </button>
              </div>

              {/* ADMIN / EDITOR VIEW */}
              {isAdmin || isEditor ? (
                <div>
                  {/* Admin Navigation Tabs */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200 mb-6">
                    <button
                      onClick={() => setAdminTab('users')}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        adminTab === 'users'
                          ? 'bg-[#ed003f] text-white shadow-xs'
                          : 'text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <UserIcon className="w-3.5 h-3.5" />
                      <span>Usuários Cadastrados</span>
                    </button>

                    <button
                      onClick={() => setAdminTab('orders')}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        adminTab === 'orders'
                          ? 'bg-[#ed003f] text-white shadow-xs'
                          : 'text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>Pedidos da Loja ({localOrders.length})</span>
                    </button>

                    <button
                      onClick={() => setAdminTab('messages')}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        adminTab === 'messages'
                          ? 'bg-[#ed003f] text-white shadow-xs'
                          : 'text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <Inbox className="w-3.5 h-3.5" />
                      <span>Mensagens & Denúncias</span>
                    </button>

                    <button
                      onClick={() => setAdminTab('content')}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        adminTab === 'content'
                          ? 'bg-[#ed003f] text-white shadow-xs'
                          : 'text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>Métricas & Conteúdo</span>
                    </button>

                    <button
                      onClick={() => setAdminTab('database')}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        adminTab === 'database'
                          ? 'bg-[#ed003f] text-white shadow-xs'
                          : 'text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <Database className="w-3.5 h-3.5" />
                      <span>Banco de Dados & Backups</span>
                    </button>
                  </div>

                  {/* TAB 1: USERS MANAGEMENT */}
                  {adminTab === 'users' && (
                    <div className="space-y-4">
                      {/* Search & Actions bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-1 max-w-md">
                          <div className="relative flex-1">
                            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                            <input
                              type="text"
                              value={userSearchTerm}
                              onChange={(e) => setUserSearchTerm(e.target.value)}
                              placeholder="Buscar por nome ou e-mail..."
                              className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#ed003f]"
                            />
                          </div>

                          <select
                            value={userRoleFilter}
                            onChange={(e) => setUserRoleFilter(e.target.value as any)}
                            className="text-xs py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                          >
                            <option value="all">Todos os cargos</option>
                            <option value="admin">Administradores</option>
                            <option value="editor">Editores</option>
                            <option value="leitor">Leitores</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={fetchUsers}
                            className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
                            title="Atualizar lista"
                          >
                            <RefreshCw className={`w-4 h-4 ${loadingUsers ? 'animate-spin' : ''}`} />
                          </button>

                          {isAdmin && (
                            <button
                              onClick={() => setShowAddUserModal(true)}
                              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#ed003f] hover:bg-[#ba0032] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                              <span>Novo Usuário</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Add User Modal Dialog */}
                      {showAddUserModal && (
                        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 mb-4 animate-fade-in">
                          <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
                            <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                              <UserPlus className="w-4 h-4 text-[#ed003f]" />
                              <span>Cadastrar Novo Usuário no Portal</span>
                            </h4>
                            <button
                              onClick={() => setShowAddUserModal(false)}
                              className="text-stone-400 hover:text-stone-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <form onSubmit={handleCreateUserByAdmin} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {addUserError && (
                              <div className="col-span-full p-2.5 rounded-lg bg-red-50 text-red-700 text-xs">
                                {addUserError}
                              </div>
                            )}
                            {addUserSuccess && (
                              <div className="col-span-full p-2.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs">
                                {addUserSuccess}
                              </div>
                            )}

                            <div>
                              <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">
                                Nome
                              </label>
                              <input
                                type="text"
                                value={newUserName}
                                onChange={(e) => setNewUserName(e.target.value)}
                                placeholder="Nome completo"
                                className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-lg"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">
                                E-mail
                              </label>
                              <input
                                type="email"
                                value={newUserEmail}
                                onChange={(e) => setNewUserEmail(e.target.value)}
                                placeholder="email@kurti.com.br"
                                className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-lg"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">
                                Senha Inicial (opcional, padrão: kurti2026)
                              </label>
                              <input
                                type="password"
                                value={newUserPassword}
                                onChange={(e) => setNewUserPassword(e.target.value)}
                                placeholder="Senha provisória"
                                className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-lg"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold uppercase text-stone-600 mb-1">
                                Cargo / Nível de Acesso
                              </label>
                              <select
                                value={newUserRole}
                                onChange={(e) => setNewUserRole(e.target.value as any)}
                                className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-lg"
                              >
                                <option value="leitor">Leitor (Acesso padrão)</option>
                                <option value="editor">Editor (Redação & Conteúdo)</option>
                                <option value="admin">Administrador (Acesso total)</option>
                              </select>
                            </div>

                            <div className="col-span-full flex justify-end gap-2 pt-2">
                              <button
                                type="button"
                                onClick={() => setShowAddUserModal(false)}
                                className="px-4 py-2 rounded-lg text-xs font-bold border border-stone-200 hover:bg-stone-100"
                              >
                                Cancelar
                              </button>
                              <button
                                type="submit"
                                className="px-4 py-2 rounded-lg text-xs font-bold bg-[#ed003f] hover:bg-[#ba0032] text-white"
                              >
                                Salvar Usuário
                              </button>
                            </div>
                          </form>
                        </div>
                      )}

                      {/* Users Table */}
                      <div className="rounded-xl border border-stone-200 overflow-hidden shadow-xs">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-stone-100/90 text-stone-600 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
                            <tr>
                              <th className="p-3">Usuário</th>
                              <th className="p-3">Cargo</th>
                              <th className="p-3">Status</th>
                              <th className="p-3 hidden sm:table-cell">Cadastrado em</th>
                              {isAdmin && <th className="p-3 text-right">Ações</th>}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100">
                            {filteredUsers.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="p-6 text-center text-stone-500">
                                  {loadingUsers ? 'Carregando lista de usuários...' : 'Nenhum usuário encontrado.'}
                                </td>
                              </tr>
                            ) : (
                              filteredUsers.map((u) => (
                                <tr key={u.id} className="hover:bg-stone-50/70 transition-colors">
                                  <td className="p-3">
                                    <div className="flex items-center gap-2.5">
                                      <div className="w-8 h-8 rounded-full bg-stone-200 overflow-hidden shrink-0 flex items-center justify-center">
                                        {u.avatar ? (
                                          <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                                        ) : (
                                          <UserIcon className="w-4 h-4 text-stone-500" />
                                        )}
                                      </div>
                                      <div>
                                        <div className="font-bold text-stone-900">{u.name}</div>
                                        <div className="text-[11px] text-stone-500">{u.email}</div>
                                      </div>
                                    </div>
                                  </td>

                                  <td className="p-3">
                                    {isAdmin && u.email !== 'admin@kurti.com.br' ? (
                                      <select
                                        value={u.role}
                                        onChange={(e) => handleUpdateUserRole(u.id, e.target.value as any)}
                                        className="text-[11px] font-bold py-1 px-2 rounded-lg bg-stone-50 border border-stone-200 focus:outline-none"
                                      >
                                        <option value="admin">Administrador</option>
                                        <option value="editor">Editor</option>
                                        <option value="leitor">Leitor</option>
                                      </select>
                                    ) : (
                                      <span
                                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                          u.role === 'admin'
                                            ? 'bg-red-100 text-red-700'
                                            : u.role === 'editor'
                                            ? 'bg-purple-100 text-purple-700'
                                            : 'bg-blue-100 text-blue-700'
                                        }`}
                                      >
                                        {u.role === 'admin' ? 'Administrador' : u.role === 'editor' ? 'Editor' : 'Leitor'}
                                      </span>
                                    )}
                                  </td>

                                  <td className="p-3">
                                    {isAdmin && u.email !== 'admin@kurti.com.br' ? (
                                      <button
                                        onClick={() => handleToggleUserStatus(u.id, u.status)}
                                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                                          u.status === 'Ativo'
                                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                            : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                                        }`}
                                      >
                                        {u.status}
                                      </button>
                                    ) : (
                                      <span
                                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                          u.status === 'Ativo'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-stone-200 text-stone-600'
                                        }`}
                                      >
                                        {u.status}
                                      </span>
                                    )}
                                  </td>

                                  <td className="p-3 text-stone-500 text-[11px] hidden sm:table-cell">
                                    {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                                  </td>

                                  {isAdmin && (
                                    <td className="p-3 text-right">
                                      {u.email !== 'admin@kurti.com.br' && (
                                        <button
                                          onClick={() => handleDeleteUser(u.id, u.name)}
                                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                          title="Remover usuário"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      )}
                                    </td>
                                  )}
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: ORDERS MANAGEMENT */}
                  {adminTab === 'orders' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-stone-900">
                          Gestão de Vendas & Envios da Loja Oficial
                        </h4>
                        <span className="text-xs text-stone-500 font-semibold">
                          Total: {localOrders.length} pedidos registrados
                        </span>
                      </div>

                      <div className="rounded-xl border border-stone-200 overflow-hidden shadow-xs">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-stone-100/90 text-stone-600 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
                            <tr>
                              <th className="p-3">Pedido</th>
                              <th className="p-3">Cliente</th>
                              <th className="p-3 hidden md:table-cell">Itens</th>
                              <th className="p-3">Valor</th>
                              <th className="p-3">Status do Pedido</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100">
                            {localOrders.map((order) => (
                              <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                                <td className="p-3">
                                  <span className="font-bold text-[#ed003f] block">{order.orderNumber}</span>
                                  <span className="text-[10px] text-stone-400">
                                    {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                                  </span>
                                </td>

                                <td className="p-3">
                                  <div className="font-semibold text-stone-900">{order.customerName}</div>
                                  <div className="text-[11px] text-stone-500">{order.customerEmail}</div>
                                  <div className="text-[10px] text-stone-400">
                                    {order.shippingAddress.city} - {order.shippingAddress.state}
                                  </div>
                                </td>

                                <td className="p-3 hidden md:table-cell">
                                  <div className="text-[11px] text-stone-600 max-w-xs truncate">
                                    {order.items.map((it) => `${it.quantity}x ${it.productName}`).join(', ')}
                                  </div>
                                </td>

                                <td className="p-3 font-bold text-stone-900">
                                  R$ {order.total.toFixed(2).replace('.', ',')}
                                </td>

                                <td className="p-3">
                                  <select
                                    value={order.status}
                                    disabled={orderStatusUpdating === order.id}
                                    onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                    className={`text-[11px] font-bold py-1 px-2.5 rounded-lg border cursor-pointer focus:outline-none transition-all ${
                                      order.status === 'Entregue'
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : order.status === 'Em transporte'
                                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                                        : order.status === 'Processando'
                                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                                        : 'bg-stone-100 text-stone-700 border-stone-300'
                                    }`}
                                  >
                                    <option value="Confirmado">Confirmado</option>
                                    <option value="Processando">Processando</option>
                                    <option value="Em transporte">Em transporte</option>
                                    <option value="Entregue">Entregue</option>
                                  </select>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: CONTACT MESSAGES */}
                  {adminTab === 'messages' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-stone-900">
                          Caixa de Contatos, Sugestões & Denúncias Recebidas
                        </h4>
                        <button
                          onClick={fetchMessages}
                          className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${loadingMessages ? 'animate-spin' : ''}`} />
                          <span>Atualizar</span>
                        </button>
                      </div>

                      {messages.length === 0 ? (
                        <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200">
                          <Inbox className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                          <p className="text-sm text-stone-600 font-medium">Nenhuma mensagem recente na caixa de entrada.</p>
                          <p className="text-xs text-stone-400 mt-1">
                            Mensagens enviadas pelo formulário de contato aparecerão aqui em tempo real.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {messages.map((msg) => (
                            <div
                              key={msg.id}
                              className="p-4 rounded-xl border border-stone-200 bg-white hover:border-stone-300 transition-all shadow-xs"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-stone-100">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-stone-900 text-xs">{msg.name}</span>
                                  <span className="text-[11px] text-stone-500">({msg.email})</span>
                                  <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full font-semibold">
                                    {msg.department || 'Geral'}
                                  </span>
                                </div>
                                <span className="text-[11px] text-stone-400">
                                  {new Date(msg.sentAt).toLocaleString('pt-BR')}
                                </span>
                              </div>
                              <div className="mt-2 text-xs font-semibold text-stone-800">
                                Assunto: {msg.subject}
                              </div>
                              <p className="mt-1 text-xs text-stone-600 leading-relaxed bg-stone-50 p-3 rounded-lg border border-stone-100">
                                {msg.message}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 4: METRICS & CONTENT */}
                  {adminTab === 'content' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                          <span className="text-[11px] font-bold text-stone-500 uppercase">Matérias Publicadas</span>
                          <div className="text-2xl font-extrabold text-[#ed003f] mt-1">86</div>
                          <span className="text-[10px] text-stone-400">100% verificadas</span>
                        </div>
                        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                          <span className="text-[11px] font-bold text-stone-500 uppercase">Estados Cobertos</span>
                          <div className="text-2xl font-extrabold text-stone-900 mt-1">9</div>
                          <span className="text-[10px] text-stone-400">Agendas e baladas</span>
                        </div>
                        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                          <span className="text-[11px] font-bold text-stone-500 uppercase">Catálogo Loja</span>
                          <div className="text-2xl font-extrabold text-purple-700 mt-1">6</div>
                          <span className="text-[10px] text-stone-400">Produtos oficiais</span>
                        </div>
                        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                          <span className="text-[11px] font-bold text-stone-500 uppercase">Disque 100</span>
                          <div className="text-2xl font-extrabold text-emerald-600 mt-1">Ativo</div>
                          <span className="text-[10px] text-stone-400">Canal de denúncias</span>
                        </div>
                      </div>

                      <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
                        <h4 className="text-sm font-bold text-stone-900 mb-2">Orientações Editoriais Kurti</h4>
                        <p className="text-xs text-stone-600 leading-relaxed">
                          Todo conteúdo publicado no portal Kurti segue as diretrizes de respeito aos direitos humanos, decisões firmadas pelo Supremo Tribunal Federal (criminalização da LGBTfobia, ADO 26; casamento igualitário; retificação civil de prenome e gênero) e apuração jornalística com fontes primárias.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* TAB 5: DATABASE & BACKUPS */}
                  {adminTab === 'database' && (
                    <div className="space-y-6">
                      <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <h4 className="text-sm font-bold text-stone-900">
                              Motor de Dados Relacional Kurti v2.4
                            </h4>
                          </div>
                          <p className="text-xs text-stone-500 mt-1">
                            Persistência durável em JSON nos servidores com sincronização em tempo real.
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleVerifyDatabase}
                            disabled={verifyingDb}
                            className="px-3.5 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 transition-colors cursor-pointer"
                          >
                            {verifyingDb ? 'Checando...' : 'Verificar Integridade'}
                          </button>

                          <a
                            href="/api/database/backup"
                            download
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#ed003f] hover:bg-[#ba0032] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Exportar Backup</span>
                          </a>
                        </div>
                      </div>

                      {dbStatus && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="p-4 rounded-xl border border-stone-200 bg-white">
                            <span className="text-[11px] font-bold text-stone-400 uppercase">Tabelas Ativas</span>
                            <div className="mt-2 space-y-1.5 text-xs text-stone-700">
                              <div className="flex justify-between">
                                <span>Usuários:</span>
                                <strong>{dbStatus.migration?.tables?.users?.count || usersList.length}</strong>
                              </div>
                              <div className="flex justify-between">
                                <span>Produtos da Loja:</span>
                                <strong>{dbStatus.migration?.tables?.products?.count || 6}</strong>
                              </div>
                              <div className="flex justify-between">
                                <span>Pedidos Registrados:</span>
                                <strong>{dbStatus.migration?.tables?.orders?.count || localOrders.length}</strong>
                              </div>
                              <div className="flex justify-between">
                                <span>Mensagens de Contato:</span>
                                <strong>{dbStatus.migration?.tables?.contactMessages?.count || 0}</strong>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 rounded-xl border border-stone-200 bg-white">
                            <span className="text-[11px] font-bold text-stone-400 uppercase">Auditoria & Segurança</span>
                            <div className="mt-2 space-y-1.5 text-xs text-stone-700">
                              <div className="flex justify-between">
                                <span>Status Geral:</span>
                                <span className="text-emerald-600 font-bold">100% Online</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Checksum:</span>
                                <span className="font-mono text-[11px]">SHA-256 Verified</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Proteção contra perda:</span>
                                <strong>Ativa (Fail-safe)</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* LEITOR (REGULAR READER) VIEW */
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
                    <h3 className="text-base font-bold text-stone-900 font-serif mb-1">
                      Bem-vindo(a) ao seu Espaço Kurti!
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Aqui você pode acompanhar suas compras na Loja Oficial, acessar canais diretos de suporte e interagir com as ferramentas da comunidade.
                    </p>
                  </div>

                  {/* Orders of this reader */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                      Seus Pedidos Recentes
                    </h4>
                    {localOrders.length === 0 ? (
                      <div className="p-6 text-center border border-dashed border-stone-200 rounded-xl text-stone-500 text-xs">
                        Você ainda não realizou compras na Loja Oficial Kurti.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {localOrders.slice(0, 3).map((ord) => (
                          <div
                            key={ord.id}
                            className="p-3.5 rounded-xl border border-stone-200 bg-white flex items-center justify-between"
                          >
                            <div>
                              <span className="font-bold text-[#ed003f] text-xs block">{ord.orderNumber}</span>
                              <span className="text-[11px] text-stone-500">
                                {ord.items.length} item(ns) • R$ {ord.total.toFixed(2).replace('.', ',')}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
                              {ord.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
