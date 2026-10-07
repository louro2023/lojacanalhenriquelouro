import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users,
  Calendar,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Save,
  Eye,
} from 'lucide-react';
import {
  UserAccount,
  subscribeAllUsers,
  adminCreateUser,
  adminApproveUser,
  adminUpdateUser,
  adminDeleteUser,
  getDaysRemaining,
  subscribeSystemSettings,
  updateSystemSettings,
  SystemSettings,
  DEFAULT_SYSTEM_SETTINGS,
} from '../lib/firebase';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [tab, setTab] = useState<'pending' | 'create' | 'all' | 'licenses'>('pending');

  // License Settings State
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(DEFAULT_SYSTEM_SETTINGS);
  const [editLicenses, setEditLicenses] = useState<number>(10);
  const [editNoticeEnabled, setEditNoticeEnabled] = useState<boolean>(true);
  const [editNoticeMessage, setEditNoticeMessage] = useState<string>('');
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaveMsg, setSettingsSaveMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // Create form state
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newDays, setNewDays] = useState<number>(30);
  const [newRole, setNewRole] = useState<'customer' | 'admin'>('customer');
  const [createMsg, setCreateMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // Approval custom days per pending user
  const [approvalDaysConfig, setApprovalDaysConfig] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!isOpen) return;
    const unsubscribeUsers = subscribeAllUsers((list) => {
      setUsers(list);
    });
    const unsubscribeSettings = subscribeSystemSettings((settings) => {
      setSystemSettings(settings);
      setEditLicenses(settings.availableLicenses);
      setEditNoticeEnabled(settings.noticeEnabled);
      setEditNoticeMessage(settings.customNoticeMessage || '');
    });
    return () => {
      unsubscribeUsers();
      unsubscribeSettings();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const pendingUsers = users.filter((u) => u.status === 'pending');
  const activeUsers = users.filter((u) => u.status === 'active');

  const handleApprove = async (userId: string) => {
    const days = approvalDaysConfig[userId] || 30;
    // Approves user with 999 downloads allowed during the period
    await adminApproveUser(userId, 999, days);
  };

  const handleDelete = async (userId: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir o usuário "${name}"?`)) {
      await adminDeleteUser(userId);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newEmail.trim() || !newPassword.trim()) return;

    setCreateMsg(null);
    const res = await adminCreateUser({
      username: newUsername,
      email: newEmail,
      password: newPassword,
      downloadCredits: 999,
      licenseDays: Number(newDays) || 30,
      role: newRole,
    });

    if (res.success) {
      setCreateMsg({ type: 'ok', text: 'Apoiador criado e ativado por 30 dias com sucesso!' });
      setNewUsername('');
      setNewEmail('');
      setNewPassword('');
      setNewDays(30);
      setTimeout(() => setCreateMsg(null), 3500);
    } else {
      setCreateMsg({ type: 'err', text: res.error || 'Erro ao criar usuário.' });
    }
  };

  const handleAddDays = async (userId: string, currentDays: number, addDays: number) => {
    const newTotalDays = Math.max(1, currentDays + addDays);
    await adminUpdateUser(userId, {
      licenseDays: newTotalDays,
      status: 'active',
    });
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSaveMsg(null);

    const res = await updateSystemSettings({
      availableLicenses: Number(editLicenses) || 0,
      noticeEnabled: editNoticeEnabled,
      customNoticeMessage: editNoticeMessage.trim(),
    });

    setSavingSettings(false);
    if (res.success) {
      setSettingsSaveMsg({
        type: 'ok',
        text: `Configuração atualizada com sucesso! Agora constam ${editLicenses} licenças disponíveis no site.`,
      });
      setTimeout(() => setSettingsSaveMsg(null), 4000);
    } else {
      setSettingsSaveMsg({
        type: 'err',
        text: res.error || 'Erro ao atualizar configurações.',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-[#0d1017] border border-purple-500/30 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_40px_rgba(168,85,247,0.2)] z-10 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-black/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight font-sans">
                  Painel de Administração
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 font-bold text-[10px] uppercase">
                  Gestão de Apoiadores
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Aprovação de acessos com comprovante PIX e gerenciamento de licenças disponíveis
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 p-4 sm:p-6 pb-2">
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Total Usuários
            </span>
            <span className="text-2xl font-black text-white font-sans mt-0.5 block">
              {users.length}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
              Pendentes
            </span>
            <span className="text-2xl font-black text-amber-300 font-sans mt-0.5 block">
              {pendingUsers.length}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
              Apoiadores Ativos
            </span>
            <span className="text-2xl font-black text-emerald-300 font-sans mt-0.5 block">
              {activeUsers.length}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-center">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block">
              Downloads
            </span>
            <span className="text-2xl font-black text-purple-300 font-sans mt-0.5 block">
              {users.reduce((acc, u) => acc + (u.totalDownloads || 0), 0)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setTab('licenses')}
            className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
              tab === 'licenses'
                ? 'bg-amber-400/20 border-amber-400 ring-2 ring-amber-400/30'
                : 'bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20'
            }`}
            title="Clique para gerenciar quantidade de licenças disponíveis"
          >
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Vagas Disponíveis</span>
            </span>
            <span className="text-2xl font-black text-amber-300 font-sans mt-0.5 block font-mono">
              {systemSettings.availableLicenses}
            </span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 sm:px-6 pt-3 flex gap-2 border-b border-white/10 overflow-x-auto">
          <button
            type="button"
            onClick={() => setTab('pending')}
            className={`pb-3 px-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 cursor-pointer shrink-0 ${
              tab === 'pending'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Aprovações Pendentes</span>
            {pendingUsers.length > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500 text-black text-[10px] font-black rounded-full">
                {pendingUsers.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setTab('create')}
            className={`pb-3 px-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 cursor-pointer shrink-0 ${
              tab === 'create'
                ? 'border-purple-400 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Criar Novo Apoiador</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('all')}
            className={`pb-3 px-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 cursor-pointer shrink-0 ${
              tab === 'all'
                ? 'border-blue-400 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Todos os Usuários ({users.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('licenses')}
            className={`pb-3 px-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 cursor-pointer shrink-0 ${
              tab === 'licenses'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Gerenciar Licenças & Vagas</span>
            <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-mono font-black rounded-full border border-amber-500/40">
              {systemSettings.availableLicenses}
            </span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          
          {/* TAB 1: PENDING APPROVALS */}
          {tab === 'pending' && (
            <div className="space-y-4">
              {pendingUsers.length === 0 ? (
                <div className="p-8 text-center bg-white/[0.02] border border-white/5 rounded-2xl">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-white uppercase">Nenhuma solicitação pendente</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Quando um apoiador fizer o PIX e solicitar acesso, a conta aparecerá aqui para você conferir o comprovante e aprovar.
                  </p>
                </div>
              ) : (
                pendingUsers.map((u) => {
                  const days = approvalDaysConfig[u.id] || 30;
                  return (
                    <div
                      key={u.id}
                      className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/20 to-black border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-white text-base">{u.username}</span>
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase">
                            Aguardando Comprovante PIX
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">E-mail: <strong>{u.email}</strong></p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Solicitado em: {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>

                      {/* Approval inputs: Days */}
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1.5 bg-black/60 p-2 rounded-xl border border-white/10 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-blue-400" />
                          <label className="text-slate-400">Dias de Acesso:</label>
                          <input
                            type="number"
                            min="1"
                            max="3650"
                            value={days}
                            onChange={(e) =>
                              setApprovalDaysConfig((prev) => ({
                                ...prev,
                                [u.id]: Number(e.target.value) || 30,
                              }))
                            }
                            className="w-16 px-2 py-1 rounded bg-slate-900 border border-white/20 text-white font-bold text-center focus:outline-none focus:border-blue-400"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleApprove(u.id)}
                            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Aprovar Acesso</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(u.id, u.username)}
                            className="p-2.5 rounded-xl bg-red-950/50 hover:bg-red-900/60 border border-red-500/30 text-red-400 transition-colors cursor-pointer"
                            title="Recusar e Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: CREATE USER */}
          {tab === 'create' && (
            <form onSubmit={handleCreateSubmit} className="max-w-xl mx-auto space-y-4">
              {createMsg && (
                <div
                  className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    createMsg.type === 'ok'
                      ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                      : 'bg-red-950/60 border border-red-500/40 text-red-200'
                  }`}
                >
                  {createMsg.type === 'ok' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  <span>{createMsg.text}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Nome / Nick do Apoiador:
                  </label>
                  <input
                    type="text"
                    required
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="ex: Carlos Gamer"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-purple-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    E-mail para Login:
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="ex: carlos@gmail.com"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-purple-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Senha Inicial:
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Defina a senha..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-purple-400 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>Duração da Licença (Dias):</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="3650"
                    required
                    value={newDays}
                    onChange={(e) => setNewDays(Number(e.target.value))}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-bold focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span>Nível de Acesso:</span>
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-bold focus:outline-none focus:border-purple-400"
                  >
                    <option value="customer">Apoiador (Cliente)</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <UserPlus className="w-4 h-4" />
                <span>Criar e Ativar Apoiador</span>
              </button>
            </form>
          )}

          {/* TAB 3: ALL USERS LIST */}
          {tab === 'all' && (
            <div className="space-y-3">
              {users.map((u) => {
                const days = getDaysRemaining(u.licenseExpiresAt);
                const isExp = u.role !== 'admin' && days <= 0;

                return (
                  <div
                    key={u.id}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-left"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{u.username}</span>
                        {u.role === 'admin' ? (
                          <span className="px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 text-[9px] font-black uppercase">
                            Admin
                          </span>
                        ) : isExp ? (
                          <span className="px-2 py-0.5 rounded-full bg-red-900/60 text-red-300 text-[9px] font-black uppercase">
                            Acesso Expirado
                          </span>
                        ) : u.status === 'pending' ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-900/60 text-amber-300 text-[9px] font-black uppercase">
                            Pendente
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 text-[9px] font-black uppercase">
                            Ativo
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Days Counter */}
                      <div className="text-center px-3.5 py-1.5 rounded-xl bg-black/40 border border-white/10 min-w-[80px]">
                        <span className="text-[9px] text-slate-400 uppercase block">Licença</span>
                        <span className={`text-sm font-black ${isExp ? 'text-red-400' : 'text-blue-400'}`}>
                          {u.role === 'admin' ? 'Permanente' : isExp ? '0 dias' : `${days} dias`}
                        </span>
                      </div>

                      {/* Quick Adjust Buttons */}
                      {u.role !== 'admin' && (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleAddDays(u.id, days, 30)}
                            className="px-2.5 py-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 text-[10px] font-bold cursor-pointer transition-colors"
                            title="Renovar por mais 30 dias"
                          >
                            +30 Dias
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(u.id, u.username)}
                            className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 text-red-400 cursor-pointer transition-colors"
                            title="Excluir Usuário"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 4: GERENCIAR LICENÇAS E VAGAS */}
          {tab === 'licenses' && (
            <div className="max-w-2xl mx-auto space-y-6">
              
              {/* Header Box */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-left">
                <div className="flex items-center gap-2 text-amber-400 font-black text-xs uppercase tracking-wider mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Gerenciador de Licenças & Vagas Disponíveis</span>
                </div>
                <p className="text-xs text-slate-300">
                  Defina a quantidade de licenças disponíveis que será exibida para os visitantes e novos apoiadores. Essa informação é atualizada em tempo real em todas as telas.
                </p>
              </div>

              {/* Status Message */}
              {settingsSaveMsg && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    settingsSaveMsg.type === 'ok'
                      ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-200'
                      : 'bg-red-950/60 border border-red-500/40 text-red-200'
                  }`}
                >
                  {settingsSaveMsg.type === 'ok' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  )}
                  <span>{settingsSaveMsg.text}</span>
                </div>
              )}

              {/* Form Settings */}
              <form onSubmit={handleSaveSettings} className="space-y-5 text-left">
                
                {/* Quantidade de Licenças */}
                <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <label className="text-xs font-bold text-white uppercase tracking-wider block">
                    Quantidade de Licenças Disponíveis:
                  </label>

                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={0}
                      max={9999}
                      value={editLicenses}
                      onChange={(e) => setEditLicenses(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-32 rounded-xl bg-slate-900 border border-white/20 px-4 py-3 text-lg font-black text-amber-400 font-mono text-center focus:outline-none focus:border-amber-400"
                    />

                    {/* Quick increment/decrement buttons */}
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditLicenses((prev) => Math.max(0, prev - 5))}
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold text-xs cursor-pointer transition-colors"
                      >
                        -5
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditLicenses((prev) => Math.max(0, prev - 1))}
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold text-xs cursor-pointer transition-colors"
                      >
                        -1
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditLicenses((prev) => prev + 1)}
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold text-xs cursor-pointer transition-colors"
                      >
                        +1
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditLicenses((prev) => prev + 5)}
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold text-xs cursor-pointer transition-colors"
                      >
                        +5
                      </button>
                    </div>
                  </div>

                  {/* Preset Values */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
                    <span>Valores rápidos:</span>
                    {[5, 10, 15, 20, 30, 50].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setEditLicenses(val)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                          editLicenses === val
                            ? 'bg-amber-400 text-black border-amber-400'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mensagem Personalizada */}
                <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-white uppercase tracking-wider block">
                      Mensagem do Aviso (Opcional):
                    </label>
                    <button
                      type="button"
                      onClick={() => setEditNoticeMessage('')}
                      className="text-[10px] text-slate-400 hover:text-amber-400 underline cursor-pointer"
                    >
                      Usar mensagem padrão
                    </button>
                  </div>

                  <input
                    type="text"
                    value={editNoticeMessage}
                    onChange={(e) => setEditNoticeMessage(e.target.value)}
                    placeholder={`No momento temos somente ${editLicenses} licenças disponíveis!`}
                    className="w-full rounded-xl bg-slate-900 border border-white/20 px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <p className="text-[11px] text-slate-400">
                    Se deixar em branco, o sistema exibirá automaticamente: <em>"No momento temos somente {editLicenses} licenças disponíveis!"</em>
                  </p>
                </div>

                {/* Ativar/Desativar Aviso */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white uppercase tracking-wider block">
                      Exibir Aviso aos Visitantes
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Controla se o banner de vagas limitadas aparece no topo do site e login
                    </span>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editNoticeEnabled}
                      onChange={(e) => setEditNoticeEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
                  </label>
                </div>

                {/* Prévia em tempo real */}
                <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>Prévia de como os clientes verão:</span>
                  </div>

                  {editNoticeEnabled ? (
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-500/40 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                        <div>
                          <p className="text-xs font-black text-white">
                            {editNoticeMessage || `No momento temos somente ${editLicenses} licenças disponíveis!`}
                          </p>
                          <p className="text-[10px] text-slate-300">
                            Garanta seu acesso antes do encerramento das vagas para novos apoiadores.
                          </p>
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded-xl bg-black/40 border border-amber-500/30 text-amber-400 font-black text-xs font-mono shrink-0">
                        {editLicenses} Vagas
                      </span>
                    </div>
                  ) : (
                    <div className="p-3 text-center text-xs text-slate-500 italic bg-black/20 rounded-xl">
                      (Aviso desativado - não será exibido aos clientes)
                    </div>
                  )}
                </div>

                {/* Botão Salvar */}
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-110 active:scale-95 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-400/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingSettings ? 'Salvando...' : 'Salvar e Publicar no Site'}</span>
                </button>
              </form>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
