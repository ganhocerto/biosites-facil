import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { 
  RefreshCw, 
  ExternalLink, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Maximize2 
} from 'lucide-react';
import { DevicePreviewMode } from '../types/bio';

export interface PreviewFrameHandle {
  getIframeDocument: () => Document | null;
  reloadWithHtml: (html: string) => void;
}

interface PreviewFrameProps {
  initialHtml: string;
  deviceMode: DevicePreviewMode;
  onDeviceModeChange: (mode: DevicePreviewMode) => void;
  onIframeReady?: (doc: Document) => void;
}

export const PreviewFrame = forwardRef<PreviewFrameHandle, PreviewFrameProps>(
  ({ initialHtml, deviceMode, onDeviceModeChange, onIframeReady }, ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentDocHtml, setCurrentDocHtml] = useState(initialHtml);

    useImperativeHandle(ref, () => ({
      getIframeDocument: () => {
        try {
          return iframeRef.current?.contentDocument || null;
        } catch {
          return null;
        }
      },
      reloadWithHtml: (html: string) => {
        setCurrentDocHtml(html);
        if (iframeRef.current) {
          iframeRef.current.srcdoc = html;
        }
      },
    }));

    // Handle iframe load
    const handleIframeLoad = () => {
      setIsLoaded(true);
      try {
        const doc = iframeRef.current?.contentDocument;
        if (doc && onIframeReady) {
          onIframeReady(doc);
        }
      } catch (err) {
        console.warn('Iframe load notice:', err);
      }
    };

    // Reload preview button
    const handleManualReload = () => {
      if (iframeRef.current) {
        setIsLoaded(false);
        iframeRef.current.srcdoc = currentDocHtml;
      }
    };

    // Open biosite preview in new window
    const handleOpenInNewWindow = () => {
      try {
        const doc = iframeRef.current?.contentDocument;
        const html = doc ? '<!DOCTYPE html>\n' + doc.documentElement.outerHTML : currentDocHtml;
        const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      } catch {
        alert('Não foi possível abrir o preview em nova janela.');
      }
    };

    // Device width mapping
    const getDeviceWidthClass = () => {
      switch (deviceMode) {
        case 'mobile':
          return 'w-[390px] max-w-full';
        case 'tablet':
          return 'w-[768px] max-w-full';
        case 'desktop':
        default:
          return 'w-full';
      }
    };

    return (
      <div className="w-full h-full flex flex-col bg-[#050505] overflow-hidden select-none">
        
        {/* Top Control Bar for Preview */}
        <div className="h-10 sm:h-12 border-b border-white/[0.06] bg-[#080A09] px-4 flex items-center justify-between shrink-0">
          
          {/* Dimension Info */}
          <div className="flex items-center gap-2 text-xs text-[#8D9891]">
            <span className="w-2 h-2 rounded-full bg-[#35F58A]" />
            <span className="font-semibold text-white">Preview em Tempo Real</span>
            <span className="hidden sm:inline font-mono text-[11px] text-[#8D9891]/70">
              ({deviceMode === 'mobile' ? '390px • Celular' : deviceMode === 'tablet' ? '768px • Tablet' : '100% • Tela Completa'})
            </span>
          </div>

          {/* Quick Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleManualReload}
              className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-medium text-[#8D9891] hover:text-white bg-[#0D1110] hover:bg-[#141A17] border border-white/[0.06] transition-colors"
              title="Recarregar preview do zero"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Recarregar</span>
            </button>

            <button
              onClick={handleOpenInNewWindow}
              className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-medium text-[#8D9891] hover:text-white bg-[#0D1110] hover:bg-[#141A17] border border-white/[0.06] transition-colors"
              title="Abrir em nova aba"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Nova Aba</span>
            </button>
          </div>

        </div>

        {/* Preview Frame Container */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-2 sm:p-6 bg-[#050505]">
          <div
            className={`h-full transition-all duration-300 ease-out flex flex-col items-center justify-center relative ${getDeviceWidthClass()}`}
          >
            {/* Device Shell / Minimal Frame */}
            <div
              className={`w-full h-full flex flex-col bg-[#080A09] overflow-hidden transition-all ${
                deviceMode === 'mobile'
                  ? 'rounded-[36px] border-[6px] border-[#181E1B] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]'
                  : deviceMode === 'tablet'
                  ? 'rounded-[24px] border-[5px] border-[#181E1B] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]'
                  : 'rounded-xl border border-white/[0.08] shadow-2xl'
              }`}
            >
              {/* Mobile Speaker / Camera Notch Pill */}
              {deviceMode === 'mobile' && (
                <div className="h-6 w-full bg-[#181E1B] flex items-center justify-center shrink-0">
                  <div className="w-16 h-3 bg-[#0a0d0c] rounded-full flex items-center justify-end px-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1a221f]" />
                  </div>
                </div>
              )}

              {/* Tablet Minimal Bar */}
              {deviceMode === 'tablet' && (
                <div className="h-4 w-full bg-[#181E1B] flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-[#0a0d0c]" />
                </div>
              )}

              {/* The Isolated Iframe */}
              <iframe
                ref={iframeRef}
                title="Biosite Preview"
                srcDoc={initialHtml}
                onLoad={handleIframeLoad}
                sandbox="allow-scripts allow-forms allow-popups allow-modals allow-same-origin"
                className="w-full h-full bg-white border-0 flex-1"
              />
            </div>
          </div>
        </div>

      </div>
    );
  }
);

PreviewFrame.displayName = 'PreviewFrame';
