import { useState, useEffect } from "react";
import { nanoid } from "nanoid";

interface HomeProps {
  onLogout: () => void;
}

interface Session {
  key: string;
  level: "BASIC" | "PRO" | "DEV";
  limit: number;
  duration: number;
  packages: number;
  hwid: string;
  usage: number;
}

export default function Home({ onLogout }: HomeProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [tab, setTab] = useState<"inicio" | "gerar" | "config">("inicio");
  const [generatedData, setGeneratedData] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const sessionData = localStorage.getItem("auth_session");
    if (sessionData) {
      setSession(JSON.parse(sessionData));
    }
  }, []);

  const handleGenerate = () => {
    if (!session) return;

    if (session.usage >= session.limit) {
      alert("Limite de requisições atingido!");
      return;
    }

    const data = `${session.key}_${nanoid(8)}_${new Date().toISOString()}`;
    setGeneratedData(data);

    const updatedSession = { ...session, usage: session.usage + 1 };
    setSession(updatedSession);
    localStorage.setItem("auth_session", JSON.stringify(updatedSession));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogoutClick = () => {
    localStorage.removeItem("auth_session");
    onLogout();
  };

  if (!session) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🔐</div>
              <div>
                <div className="text-xl font-bold">{session.level}</div>
                <div className="text-xs text-blue-100">Plano {session.level}</div>
              </div>
            </div>
            <button
              onClick={handleLogoutClick}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg text-xs font-bold transition-all"
            >
              Desconectar
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="text-xs font-semibold mb-1">LIMITE</div>
            <div className="w-full bg-blue-900/50 rounded-full h-2 overflow-hidden">
              <div
                className="bg-green-400 h-full transition-all"
                style={{ width: `${(session.usage / session.limit) * 100}%` }}
              />
            </div>
            <div className="text-xs text-blue-100 mt-1">
              {session.usage} / {session.limit}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-500/30 rounded-lg p-3">
              <div className="text-xs text-blue-100">USADO</div>
              <div className="text-2xl font-bold">{session.usage}</div>
              <div className="text-xs text-blue-100">Requisições</div>
            </div>
            <div className="bg-blue-500/30 rounded-lg p-3">
              <div className="text-xs text-blue-100">PACOTES</div>
              <div className="text-2xl font-bold">{session.packages}</div>
              <div className="text-xs text-blue-100">Disponíveis</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {tab === "inicio" && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Bem-vindo!</h2>
              <p className="text-gray-600 mb-6">
                Você está usando a chave <span className="font-bold text-blue-600">{session.key}</span> no nível <span className="font-bold text-blue-600">{session.level}</span>.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <div className="text-xs font-semibold text-gray-500">Limite:</div>
                  <div className="text-lg font-bold text-gray-800">{session.limit}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500">Duração:</div>
                  <div className="text-lg font-bold text-gray-800">{session.duration} dias</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500">Nível:</div>
                  <div className="text-lg font-bold text-gray-800">{session.level}</div>
                </div>
              </div>
            </div>
          )}

          {tab === "gerar" && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Gerador</h2>
              <button
                onClick={handleGenerate}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg mb-4 transition-all"
              >
                Gerar Dados
              </button>

              {generatedData && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs font-semibold text-gray-500 mb-2">Dados Gerados:</div>
                  <div className="bg-white border border-gray-300 rounded p-3 mb-3 break-all text-sm font-mono text-gray-800">
                    {generatedData}
                  </div>
                  <button
                    onClick={handleCopy}
                    className={`w-full py-2 rounded-lg font-bold transition-all ${
                      copied
                        ? "bg-green-500 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    {copied ? "✓ Copiado!" : "Copiar"}
                  </button>
                </div>
              )}
            </div>
          )}

          {tab === "config" && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Configurações</h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div>
                  <div className="text-xs font-semibold text-gray-500">Chave Ativa</div>
                  <div className="text-gray-800 font-mono text-sm">{session.key}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500">Nível de Acesso</div>
                  <div className="text-gray-800 font-bold">{session.level}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500">Limite de Requisições</div>
                  <div className="text-gray-800 font-bold">{session.limit}</div>
                </div>
              </div>

              <button
                onClick={handleLogoutClick}
                className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-all"
              >
                Desconectar
              </button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-t border-gray-200">
          <button
            onClick={() => setTab("inicio")}
            className={`flex-1 py-3 text-center font-semibold transition-all ${
              tab === "inicio"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            🏠 Início
          </button>
          <button
            onClick={() => setTab("gerar")}
            className={`flex-1 py-3 text-center font-semibold transition-all ${
              tab === "gerar"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            ⚡ Gerar
          </button>
          <button
            onClick={() => setTab("config")}
            className={`flex-1 py-3 text-center font-semibold transition-all ${
              tab === "config"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            ⚙️ Config
          </button>
        </div>
      </div>
    </div>
  );
}
