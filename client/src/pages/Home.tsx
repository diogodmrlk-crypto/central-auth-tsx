import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Copy, Check, Settings, Home as HomeIcon, Zap, Package } from 'lucide-react';
import { toast } from 'sonner';

export default function Home() {
  const { session, logout, isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'generator' | 'settings'>('home');
  const [generatedData, setGeneratedData] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [usageCount, setUsageCount] = useState(0);

  if (!isLoggedIn || !session) {
    return null;
  }

  const keyLimit = session.keyData.limit;
  const usagePercentage = (usageCount / keyLimit) * 100;

  // Gerar dados aleatórios (simular gerador)
  const generateRandomData = () => {
    const timestamp = new Date().toISOString();
    const randomId = Math.random().toString(36).substr(2, 9).toUpperCase();
    const data = `${session.activeKey}_${randomId}_${timestamp}`;
    setGeneratedData(data);

    // Incrementar uso
    const newCount = Math.min(usageCount + 1, keyLimit);
    setUsageCount(newCount);
    localStorage.setItem(`usage_${session.activeKey}`, newCount.toString());

    toast.success('Dados gerados com sucesso!');
  };

  // Copiar para clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId('generated');
      setTimeout(() => setCopiedId(null), 2000);
      toast.success('Copiado para a área de transferência!');
    } catch (err) {
      toast.error('Erro ao copiar');
    }
  };

  // Restaurar uso do localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`usage_${session.activeKey}`);
    if (saved) {
      setUsageCount(parseInt(saved, 10));
    }
  }, [session.activeKey]);

  const handleLogout = () => {
    logout();
    toast.success('Desconectado com sucesso!');
  };

  return (
    <div className="fixed inset-0 bg-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-gray-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-screen max-h-screen md:max-h-[932px] relative">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#1a56e8] to-[#1240c0] px-5 pt-5 pb-12 flex-shrink-0">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center text-2xl font-black text-orange-400 border-2 border-white/20">
                🔐
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-tight">{session.keyLevel}</p>
                <p className="text-white/65 text-xs">Plano {session.keyLevel}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white/15 hover:bg-white/25 active:scale-95 border-0 cursor-pointer w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-100"
            >
              <LogOut className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Limit Bar */}
          <div className="bg-white/10 rounded-2xl p-3 mb-3">
            <div className="flex justify-between items-center mb-1">
              <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">Limite</p>
              <p className="text-white font-bold text-sm">{usageCount} / {keyLimit}</p>
            </div>
            <div className="bg-white/20 rounded-full h-1 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500"
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/13 border border-white/10 rounded-2xl p-3 cursor-pointer hover:bg-white/20 active:scale-95 transition-all">
              <p className="text-white/75 text-xs flex items-center gap-1 mb-1 font-semibold uppercase tracking-wide">
                <Zap className="w-3 h-3" /> Usado
              </p>
              <p className="text-white font-black text-2xl">{usageCount}</p>
              <p className="text-white/60 text-xs mt-1">Requisições</p>
            </div>
            <div className="bg-white/13 border border-white/10 rounded-2xl p-3 cursor-pointer hover:bg-white/20 active:scale-95 transition-all">
              <p className="text-white/75 text-xs flex items-center gap-1 mb-1 font-semibold uppercase tracking-wide">
                <Package className="w-3 h-3" /> Pacotes
              </p>
              <p className="text-white font-black text-2xl">{session.keyData.packages}</p>
              <p className="text-white/60 text-xs mt-1">Disponíveis</p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-100 pb-24">
          {/* Home Tab */}
          {activeTab === 'home' && (
            <div className="p-4 space-y-4">
              <div className="bg-white rounded-2xl shadow-sm p-4">
                <h2 className="text-gray-900 font-bold text-base mb-3">Bem-vindo!</h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Você está usando a chave <span className="font-mono font-bold text-blue-600">{session.activeKey}</span> no nível <span className="font-bold text-blue-600">{session.keyLevel}</span>.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-4">
                <h3 className="text-gray-900 font-bold text-sm mb-2">Informações da Chave</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Limite:</span>
                    <span className="font-bold text-gray-900">{keyLimit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duração:</span>
                    <span className="font-bold text-gray-900">{session.keyData.durationDays === -1 ? 'Ilimitado' : `${session.keyData.durationDays} dias`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nível:</span>
                    <span className="font-bold text-gray-900">{session.keyLevel}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Generator Tab */}
          {activeTab === 'generator' && (
            <div className="p-4 space-y-4">
              <button
                onClick={generateRandomData}
                disabled={usageCount >= keyLimit}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all duration-100 cursor-pointer border-0"
              >
                {usageCount >= keyLimit ? 'Limite atingido' : 'Gerar Dados'}
              </button>

              {generatedData && (
                <div className="bg-white rounded-2xl shadow-sm p-4">
                  <h3 className="text-gray-900 font-bold text-sm mb-3">Dados Gerados</h3>
                  <div className="bg-gray-50 rounded-xl p-3 mb-3 break-all font-mono text-xs text-gray-700">
                    {generatedData}
                  </div>
                  <button
                    onClick={() => copyToClipboard(generatedData)}
                    className="w-full bg-green-500 hover:bg-green-600 active:scale-95 text-white font-bold py-2 rounded-xl transition-all duration-100 cursor-pointer border-0 flex items-center justify-center gap-2"
                  >
                    {copiedId === 'generated' ? (
                      <>
                        <Check className="w-4 h-4" /> Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" /> Copiar
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="p-4 space-y-4">
              <div className="bg-white rounded-2xl shadow-sm p-4">
                <h3 className="text-gray-900 font-bold text-base mb-4">Configurações</h3>

                <div className="space-y-3">
                  <div className="pb-3 border-b border-gray-200">
                    <p className="text-gray-600 text-sm font-semibold mb-1">Chave Ativa</p>
                    <p className="text-gray-900 font-mono text-sm">{session.activeKey}</p>
                  </div>

                  <div className="pb-3 border-b border-gray-200">
                    <p className="text-gray-600 text-sm font-semibold mb-1">Nível de Acesso</p>
                    <p className="text-gray-900 font-bold text-sm">{session.keyLevel}</p>
                  </div>

                  <div className="pb-3">
                    <p className="text-gray-600 text-sm font-semibold mb-1">Limite de Requisições</p>
                    <p className="text-gray-900 font-bold text-sm">{keyLimit}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-600 active:scale-95 text-white font-bold py-3 rounded-2xl transition-all duration-100 cursor-pointer border-0"
              >
                Desconectar
              </button>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 w-full">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-colors ${
              activeTab === 'home' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <HomeIcon className="w-5 h-5" />
            <span className="text-xs font-semibold">Início</span>
          </button>
          <button
            onClick={() => setActiveTab('generator')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-colors ${
              activeTab === 'generator' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Zap className="w-5 h-5" />
            <span className="text-xs font-semibold">Gerar</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-colors ${
              activeTab === 'settings' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-xs font-semibold">Config</span>
          </button>
        </div>
      </div>
    </div>
  );
}
