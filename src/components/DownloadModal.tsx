import React, { useState } from 'react';
import { 
  Download, 
  CheckCircle2, 
  X, 
  Copy, 
  Check, 
  Globe, 
  Sparkles, 
  HardDrive,
  Code
} from 'lucide-react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  htmlContent: string;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  htmlContent,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownloadFile = () => {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'index.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(htmlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert('Não foi possível copiar para a área de transferência.');
    }
  };

  const fileSizeKb = (new Blob([htmlContent]).size / 1024).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-[#080A09] border border-white/[0.1] rounded-3xl p-6 sm:p-8 shadow-2xl relative text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#8D9891] hover:text-white bg-[#0D1110] hover:bg-[#141A17] border border-white/[0.06] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Success Icon & Heading */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#35F58A]/15 border border-[#35F58A]/30 text-[#35F58A] flex items-center justify-center shadow-lg shadow-[#35F58A]/10">
            <CheckCircle2 className="w-6 h-6 text-[#35F58A]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#35F58A]/10 text-[#35F58A] text-[10px] font-bold tracking-wider uppercase mb-1">
              <Sparkles className="w-3 h-3" /> PRONTO PARA PUBLICAÇÃO
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              SEU BIOSITE ESTÁ PRONTO ✓
            </h2>
          </div>
        </div>

        <p className="text-sm text-[#8D9891] mb-6 leading-relaxed">
          O arquivo <strong className="text-white font-mono bg-white/[0.06] px-1.5 py-0.5 rounded">index.html</strong> foi preparado com todas as suas personalizações, imagens embutidas e totalmente limpo de scripts do editor.
        </p>

        {/* Key Features of exported file */}
        <div className="bg-[#0D1110] border border-white/[0.06] rounded-2xl p-4 sm:p-5 mb-6 space-y-3 text-xs sm:text-sm">
          <div className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-[#35F58A] mt-0.5 shrink-0" />
            <span className="text-[#d1d5db]">
              <strong className="text-white font-medium">Hospedagem universal:</strong> Funciona na Vercel, Netlify, GitHub Pages, Cloudflare Pages ou qualquer servidor estático.
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-[#35F58A] mt-0.5 shrink-0" />
            <span className="text-[#d1d5db]">
              <strong className="text-white font-medium">Imagens embutidas:</strong> Fotos do seu computador foram convertidas para Base64 e não quebram ao hospedar.
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-[#35F58A] mt-0.5 shrink-0" />
            <span className="text-[#d1d5db]">
              <strong className="text-white font-medium">Re-edição futura:</strong> Os atributos <code className="text-[#35F58A] font-mono">data-bio-*</code> foram preservados para você abrir este arquivo no BIO FÁCIL e editar novamente quando quiser.
            </span>
          </div>

          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#8D9891]">
            <span>Tamanho do arquivo: <strong className="text-white font-mono">{fileSizeKb} KB</strong></span>
            <span>Tipo: <strong className="text-white font-mono">text/html</strong></span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleDownloadFile}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-[#35F58A] hover:bg-[#2fe07c] text-[#050505] font-extrabold text-sm tracking-wide shadow-lg shadow-[#35F58A]/25 hover:shadow-[#35F58A]/40 transition-all flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#050505]" />
            <span>BAIXAR INDEX.HTML</span>
          </button>

          <button
            onClick={handleCopyCode}
            className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-[#0D1110] hover:bg-[#141A17] text-white font-semibold text-xs border border-white/[0.08] hover:border-white/[0.2] transition-all flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#35F58A]" />
                <span className="text-[#35F58A]">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#8D9891]" />
                <span>Copiar Código</span>
              </>
            )}
          </button>
        </div>

        {/* Hosting guidance tip */}
        <div className="mt-5 text-center text-[11px] text-[#8D9891]">
          Dica rápida: Basta arrastar o arquivo baixado para a sua pasta pública ou serviço de hospedagem favorito.
        </div>

      </div>
    </div>
  );
};
