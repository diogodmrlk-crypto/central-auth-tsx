import { useState } from "react";
import { findKey, getHWID } from "../data/keys";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!key.trim()) {
      setError("Digite sua chave!");
      return;
    }

    const foundKey = findKey(key);
    if (!foundKey) {
      setError("Key inválida ou não encontrada!");
      return;
    }

    const hwid = getHWID();
    localStorage.setItem("auth_session", JSON.stringify({
      key: foundKey.key,
      level: foundKey.level,
      limit: foundKey.limit,
      duration: foundKey.duration,
      packages: foundKey.packages,
      hwid,
      usage: 0,
    }));

    setError("");
    onLogin();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
      <div className="bg-blue-500/20 backdrop-blur-md rounded-3xl p-8 w-96 border border-blue-400/30 shadow-2xl">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold text-white mb-2">CentralAuth</h1>
          <p className="text-blue-100">Insira sua chave de acesso</p>
        </div>

        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleLogin()}
          placeholder="DIGITE SUA CHAVE"
          className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-400 font-semibold mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <button
          onClick={handleLogin}
          className="w-full px-4 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold transition-all mb-4 border-2 border-dashed border-green-300"
        >
          Acessar
        </button>

        {error && (
          <div className="bg-red-500/30 border border-red-400 text-red-100 px-4 py-2 rounded-lg text-center text-sm">
            {error}
          </div>
        )}

        <p className="text-blue-100 text-xs text-center mt-4">
          Sua chave é vinculada ao seu dispositivo (HWID)
        </p>
      </div>
    </div>
  );
}
