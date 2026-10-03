import React from 'react';
import { 
  Download, 
  RotateCcw, 
  Undo2, 
  Redo2, 
  ArrowLeft, 
  Check, 
  Sparkles,
  Smartphone,
  Tablet,
  Monitor
} from 'lucide-react';
import { DevicePreviewMode } from '../types/bio';

interface HeaderProps {
  onBackToImport: () => void;
  onDownload: () => void;
  onRestoreOriginal: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  saveStatus: 'idle' | 'saving' | 'saved';
  deviceMode: DevicePreviewMode;
  onDeviceModeChange: (mode: DevicePreviewMode) => void;
  mobileActiveTab: 'edit' | 'preview';
  onMobileActiveTabChange: (tab: 'edit' | 'preview') => void;
  totalFields: number;
}

export const Header: React.FC<HeaderProps> = ({
  onBackToImport,
  onDownload,
  onRestoreOriginal,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  saveStatus,
  deviceMode,
  onDeviceModeChange,
  mobileActiveTab,
  onMobileActiveTabChange,
  totalFields,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#080A09]/95 backdrop-blur-md border-b border-white/[0.08] px-3 sm:px-6 py-2.5 sm:py-3 transition-colors">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Brand & Model Status */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button
            onClick={onBackToImport}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-[#8D9891] hover:text-white bg-[#0D1110] hover:bg-[#141A17] border border-white/[0.06] hover:border-white/[0.15] rounded-lg transition-all"
            title="Voltar e trocar o modelo atual"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Trocar Modelo</span>
          </button>

          <div className="flex items-center gap-2 border-l border-white/[0.08] pl-3">
            <span className="font-extrabold text-base tracking-tight select-none">
              <span className="text-white">BIO</span>{' '}
              <span className="text-[#35F58A]">FÁCIL</span>
            </span>

            <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#35F58A]/10 text-[#35F58A] border border-[#35F58A]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#35F58A] animate-pulse"></span>
              Modelo Ativo ({totalFields} campos)
            </span>
          </div>
        </div>

        {/* Center: Device Mode Switcher (Desktop) & Mobile View Switcher */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Responsive device switches for desktop preview */}
          <div className="hidden md:flex items-center p-0.5 bg-[#0D1110] border border-white/[0.08] rounded-xl">
            <button
              onClick={() => onDeviceModeChange('mobile')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                deviceMode === 'mobile'
                  ? 'bg-[#19221C] text-[#35F58A] shadow-sm font-semibold'
                  : 'text-[#8D9891] hover:text-white'
              }`}
              title="Visualização Celular (390px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Celular</span>
            </button>

            <button
              onClick={() => onDeviceModeChange('tablet')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                deviceMode === 'tablet'
                  ? 'bg-[#19221C] text-[#35F58A] shadow-sm font-semibold'
                  : 'text-[#8D9891] hover:text-white'
              }`}
              title="Visualização Tablet (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Tablet</span>
            </button>

            <button
              onClick={() => onDeviceModeChange('desktop')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                deviceMode === 'desktop'
                  ? 'bg-[#19221C] text-[#35F58A] shadow-sm font-semibold'
                  : 'text-[#8D9891] hover:text-white'
              }`}
              title="Visualização Desktop (100%)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
          </div>

          {/* Mobile tabs for Edit vs Preview */}
          <div className="flex md:hidden items-center p-0.5 bg-[#0D1110] border border-white/[0.08] rounded-lg">
            <button
              onClick={() => onMobileActiveTabChange('edit')}
              className={`px-3 py-1 text-xs font-bold rounded transition-all ${
                mobileActiveTab === 'edit'
                  ? 'bg-[#35F58A] text-[#050505]'
                  : 'text-[#8D9891]'
              }`}
            >
              Editar
            </button>
            <button
              onClick={() => onMobileActiveTabChange('preview')}
              className={`px-3 py-1 text-xs font-bold rounded transition-all ${
                mobileActiveTab === 'preview'
                  ? 'bg-[#35F58A] text-[#050505]'
                  : 'text-[#8D9891]'
              }`}
            >
              Preview
            </button>
          </div>
        </div>

        {/* Right: Actions, Undo, Redo, Save Indicator, Download */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Save Status Badge */}
          <div className="hidden xl:flex items-center gap-1 text-[11px] text-[#8D9891]">
            {saveStatus === 'saving' ? (
              <span className="text-yellow-400/80 animate-pulse">Salvando...</span>
            ) : saveStatus === 'saved' ? (
              <span className="flex items-center gap-1 text-[#35F58A]">
                <Check className="w-3 h-3" /> Salvo no dispositivo
              </span>
            ) : null}
          </div>

          {/* Undo / Redo */}
          <div className="hidden sm:flex items-center gap-1 bg-[#0D1110] border border-white/[0.08] p-1 rounded-xl">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="p-1.5 rounded-lg text-[#8D9891] hover:text-white hover:bg-[#161D19] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#8D9891] transition-colors"
              title="Desfazer (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="p-1.5 rounded-lg text-[#8D9891] hover:text-white hover:bg-[#161D19] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#8D9891] transition-colors"
              title="Refazer (Ctrl+Shift+Z)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          {/* Restore Original */}
          <button
            onClick={onRestoreOriginal}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs text-[#8D9891] hover:text-white hover:bg-[#0D1110] rounded-xl border border-transparent hover:border-white/[0.08] transition-colors"
            title="Restaurar o modelo para o estado original"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Restaurar</span>
          </button>

          {/* Main Action: Baixar HTML */}
          <button
            onClick={onDownload}
            className="flex items-center gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-xl bg-[#35F58A] hover:bg-[#2fe07c] text-[#050505] font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-[#35F58A]/20 hover:shadow-[#35F58A]/35 transition-all transform active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#050505]" />
            <span>BAIXAR HTML</span>
          </button>
        </div>

      </div>
    </header>
  );
};
