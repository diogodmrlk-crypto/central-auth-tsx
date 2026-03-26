import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const [keyInput, setKeyInput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Gerar HWID simulado (em produção, seria mais sofisticado)
  const generateHWID = () => {
    return `HWID_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const hwid = generateHWID();
      const result = await login(keyInput, hwid);

      if (!result.success) {
        setError(result.message);
        setKeyInput('');
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#1a56e8] to-[#1240c0] flex items-center justify-center p-6 z-50">
      <div className="w-full max-w-sm">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
          {/* Logo */}
          <div className="text-5xl mb-6 text-center">🔐</div>

          {/* Title */}
          <h1 className="text-2xl font-black text-white text-center mb-2">
            CentralAuth
          </h1>

          {/* Subtitle */}
          <p className="text-sm text-white/80 text-center mb-8">
            Insira sua chave de acesso
          </p>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value.toUpperCase())}
              placeholder="Digite sua chave"
              className="w-full px-4 py-4 rounded-2xl border-0 bg-white text-center text-gray-900 font-semibold text-base placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-400 transition-all uppercase"
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-4 rounded-2xl border-0 bg-green-500 hover:bg-green-600 active:scale-95 text-white font-bold text-base cursor-pointer transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? 'Validando...' : 'Acessar'}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-400/50 rounded-lg">
              <p className="text-red-200 text-sm font-semibold text-center">{error}</p>
            </div>
          )}

          {/* Info Text */}
          <p className="text-xs text-white/60 text-center mt-6">
            Sua chave é vinculada ao seu dispositivo (HWID)
          </p>
        </div>
      </div>
    </div>
  );
}
