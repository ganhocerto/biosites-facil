import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { SAMPLE_TEMPLATE_HTML } from '../utils/sampleTemplate';

interface HomeImportProps {
  onAnalyzeHtml: (html: string) => void;
  savedDraftHtml?: string | null;
  onRestoreDraft?: () => void;
}

export const HomeImport: React.FC<HomeImportProps> = ({
  onAnalyzeHtml,
  savedDraftHtml,
  onRestoreDraft,
}) => {
  const [htmlInput, setHtmlInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleClear = () => {
    setHtmlInput('');
    setErrorMsg(null);
  };

  const handleSubmit = () => {
    if (!htmlInput.trim()) {
      setErrorMsg('Cole o código HTML do seu modelo antes de analisar.');
      return;
    }
    setErrorMsg(null);
    onAnalyzeHtml(htmlInput);
  };

  const handleLoadSample = () => {
    setHtmlInput(SAMPLE_TEMPLATE_HTML);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-between selection:bg-[#35F58A]/20 selection:text-[#35F58A]">
      {/* Top Bar for Draft Recovery if available */}
      {savedDraftHtml && onRestoreDraft ? (
        <header className="w-full border-b border-white/[0.06] bg-[#080A09]/80 backdrop-blur-md px-6 py-3">
          <div className="max-w-3xl mx-auto flex items-center justify-end">
            <button
              onClick={onRestoreDraft}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#35F58A] bg-[#35F58A]/10 border border-[#35F58A]/30 hover:bg-[#35F58A]/20 rounded-lg transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Continuar Rascunho Salvo</span>
            </button>
          </div>
        </header>
      ) : (
        <div className="h-4 sm:h-8" />
      )}

      {/* Main Container */}
      <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 flex-1 flex flex-col justify-center">
        
        {/* Brand & Description Section */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none mb-2">
            <span className="text-white">BIO</span>{' '}
            <span className="text-[#35F58A]">FÁCIL</span>
          </h1>

          <div className="text-xs sm:text-sm tracking-[0.25em] text-[#8D9891] uppercase font-bold mb-4">
            EDITOR DE BIOSITES
          </div>

          <p className="text-sm sm:text-base text-[#8D9891] max-w-lg mx-auto leading-relaxed">
            Cole o HTML do seu modelo e personalize textos, imagens, links, produtos e muito mais.
          </p>
        </div>

        {/* Card: Cole o Código do Seu Modelo */}
        <div className="bg-[#080A09] border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl relative">
          
          {/* Header of Area */}
          <div className="mb-4">
            <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              COLE O CÓDIGO DO SEU MODELO
            </h2>
          </div>

          {/* Textarea Area */}
          <div className="relative mb-5">
            <textarea
              value={htmlInput}
              onChange={(e) => setHtmlInput(e.target.value)}
              placeholder="Cole aqui o código HTML completo do seu modelo..."
              rows={11}
              className="w-full bg-[#0D1110] text-[#e5e7eb] font-mono text-xs sm:text-sm p-4 sm:p-5 rounded-2xl border border-white/[0.08] focus:border-[#35F58A] focus:outline-none focus:ring-1 focus:ring-[#35F58A]/50 transition-all resize-y placeholder:text-[#8D9891]/50 shadow-inner"
              spellCheck={false}
            />

            {htmlInput.length > 0 && (
              <div className="absolute bottom-3 right-3 text-[11px] font-mono text-[#8D9891] bg-[#080A09]/80 px-2 py-0.5 rounded border border-white/[0.05] pointer-events-none">
                {(htmlInput.length / 1024).toFixed(1)} KB
              </div>
            )}
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Main Action Button */}
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full py-4 px-8 bg-[#35F58A] hover:bg-[#2fe07c] text-[#050505] font-extrabold text-sm sm:text-base rounded-xl sm:rounded-2xl tracking-wide shadow-lg shadow-[#35F58A]/25 hover:shadow-[#35F58A]/40 transition-all flex items-center justify-center gap-2 transform active:scale-[0.99] cursor-pointer"
            >
              <span>ANALISAR MODELO</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#050505]" />
            </button>

            <div className="flex items-center justify-between w-full pt-1 px-1">
              <button
                type="button"
                onClick={handleLoadSample}
                className="text-xs text-[#8D9891] hover:text-[#35F58A] underline underline-offset-4 transition-colors cursor-pointer"
              >
                Testar com modelo de exemplo
              </button>

              {htmlInput && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-[#8D9891] hover:text-red-400 transition-colors cursor-pointer"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>
        </div>

      </main>

      {/* Discreet Minimal Footer */}
      <footer className="w-full py-4 text-center text-xs text-[#8D9891]/60">
        <div className="max-w-3xl mx-auto px-4">
          <span className="font-semibold text-white/80">BIO FÁCIL</span> • Editor de Biosites
        </div>
      </footer>
    </div>
  );
};
