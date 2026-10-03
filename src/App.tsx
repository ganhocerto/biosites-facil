import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ParsedBioModel, 
  DevicePreviewMode, 
  EditorHistoryStep, 
  BioServiceGroup 
} from './types/bio';
import { parseModelHtml } from './utils/analyzer';
import { 
  updatePreviewText, 
  updatePreviewImage, 
  updatePreviewLink, 
  duplicateServiceItemInDoc, 
  deleteServiceItemInDoc, 
  moveServiceItemInDoc, 
  duplicateGalleryItemInDoc, 
  deleteGalleryItemInDoc, 
  serializeDocToHtml 
} from './utils/domUpdater';
import { Header } from './components/Header';
import { HomeImport } from './components/HomeImport';
import { EditorPanel } from './components/EditorPanel';
import { PreviewFrame, PreviewFrameHandle } from './components/PreviewFrame';
import { DownloadModal } from './components/DownloadModal';
import { ConfirmModal } from './components/ConfirmModal';

const DRAFT_STORAGE_KEY = 'biofacil_draft_html';
const ORIGINAL_STORAGE_KEY = 'biofacil_original_html';

export default function App() {
  const [viewMode, setViewMode] = useState<'import' | 'editor'>('import');
  const [originalHtml, setOriginalHtml] = useState<string>('');
  const [parsedModel, setParsedModel] = useState<ParsedBioModel | null>(null);
  const [deviceMode, setDeviceMode] = useState<DevicePreviewMode>('mobile');
  const [mobileActiveTab, setMobileActiveTab] = useState<'edit' | 'preview'>('edit');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Modals
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [exportedHtml, setExportedHtml] = useState('');
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    isDestructive: boolean;
    action: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Confirmar',
    isDestructive: false,
    action: () => {},
  });

  // History for Undo/Redo
  const [history, setHistory] = useState<EditorHistoryStep[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // References
  const previewRef = useRef<PreviewFrameHandle>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check for saved draft on mount
  const [savedDraft, setSavedDraft] = useState<string | null>(null);

  useEffect(() => {
    try {
      const draft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (draft && draft.trim()) {
        setSavedDraft(draft);
      }
    } catch {
      // Ignore localStorage issues
    }
  }, []);

  // Autosave to localStorage
  const triggerAutoSave = useCallback((htmlToSave: string) => {
    setSaveStatus('saving');
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_STORAGE_KEY, htmlToSave);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } catch {
        setSaveStatus('idle');
      }
    }, 800);
  }, []);

  // Analyze and load HTML model
  const handleAnalyzeHtml = (html: string) => {
    try {
      const parsed = parseModelHtml(html);
      setOriginalHtml(html);
      setParsedModel(parsed);
      setViewMode('editor');
      setDeviceMode('mobile');
      setMobileActiveTab('edit');

      // Initialize history
      const initialStep: EditorHistoryStep = {
        textValues: {},
        imageValues: {},
        linkValues: {},
        htmlSnapshot: html,
      };
      parsed.textFields.forEach((f) => (initialStep.textValues[f.key] = f.currentValue));
      parsed.imageFields.forEach((f) => (initialStep.imageValues[f.key] = f.currentSrc));
      parsed.linkFields.forEach((f) => (initialStep.linkValues[f.key] = f.currentHref));

      setHistory([initialStep]);
      setHistoryIndex(0);

      // Save initial draft
      try {
        localStorage.setItem(ORIGINAL_STORAGE_KEY, html);
        localStorage.setItem(DRAFT_STORAGE_KEY, html);
      } catch {
        // Ignore storage error
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao analisar modelo HTML.';
      alert(message);
    }
  };

  // Restore draft from localStorage
  const handleRestoreDraft = () => {
    try {
      const draft = localStorage.getItem(DRAFT_STORAGE_KEY);
      const original = localStorage.getItem(ORIGINAL_STORAGE_KEY) || draft;
      if (draft) {
        handleAnalyzeHtml(draft);
        if (original) {
          setOriginalHtml(original);
        }
      }
    } catch {
      alert('Não foi possível restaurar o rascunho salvo.');
    }
  };

  // When iframe is ready or reloaded, sync current values into DOM
  const handleIframeReady = useCallback(
    (doc: Document) => {
      if (!parsedModel) return;

      // Sync all texts
      parsedModel.textFields.forEach((tf) => {
        updatePreviewText(doc, tf.key, tf.currentValue);
      });

      // Sync all images
      parsedModel.imageFields.forEach((img) => {
        updatePreviewImage(doc, img.key, img.currentSrc);
      });

      // Sync all links
      parsedModel.linkFields.forEach((lk) => {
        updatePreviewLink(doc, lk.key, lk.currentHref);
      });
    },
    [parsedModel]
  );

  // Push new history step
  const pushHistoryStep = useCallback(
    (newStep: Partial<EditorHistoryStep>) => {
      setHistory((prev) => {
        const current = prev[historyIndex] || {
          textValues: {},
          imageValues: {},
          linkValues: {},
        };
        const nextStep: EditorHistoryStep = {
          textValues: { ...current.textValues, ...newStep.textValues },
          imageValues: { ...current.imageValues, ...newStep.imageValues },
          linkValues: { ...current.linkValues, ...newStep.linkValues },
        };
        const newHistory = prev.slice(0, historyIndex + 1);
        return [...newHistory, nextStep];
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex]
  );

  // Text Change Handler - DIRECT DOM UPDATE, NO RELOAD
  const handleTextChange = useCallback(
    (key: string, newValue: string) => {
      const doc = previewRef.current?.getIframeDocument();
      if (doc) {
        updatePreviewText(doc, key, newValue);
      }

      setParsedModel((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          textFields: prev.textFields.map((tf) =>
            tf.key === key ? { ...tf, currentValue: newValue } : tf
          ),
          // Also update service item subfields if key matches
          serviceGroups: prev.serviceGroups.map((g) => ({
            ...g,
            items: g.items.map((it) => ({
              ...it,
              fields: it.fields.map((f) =>
                f.key === key ? { ...f, value: newValue } : f
              ),
            })),
          })),
        };
      });

      pushHistoryStep({ textValues: { [key]: newValue } });

      if (doc) {
        triggerAutoSave(serializeDocToHtml(doc));
      }
    },
    [pushHistoryStep, triggerAutoSave]
  );

  // Image Change Handler - DIRECT DOM UPDATE, NO RELOAD
  const handleImageChange = useCallback(
    (key: string, newSrc: string) => {
      const doc = previewRef.current?.getIframeDocument();
      if (doc) {
        updatePreviewImage(doc, key, newSrc);
      }

      setParsedModel((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          imageFields: prev.imageFields.map((img) =>
            img.key === key ? { ...img, currentSrc: newSrc } : img
          ),
          serviceGroups: prev.serviceGroups.map((g) => ({
            ...g,
            items: g.items.map((it) => ({
              ...it,
              fields: it.fields.map((f) =>
                f.key === key ? { ...f, value: newSrc } : f
              ),
            })),
          })),
        };
      });

      pushHistoryStep({ imageValues: { [key]: newSrc } });

      if (doc) {
        triggerAutoSave(serializeDocToHtml(doc));
      }
    },
    [pushHistoryStep, triggerAutoSave]
  );

  // Link Change Handler - DIRECT DOM UPDATE, NO RELOAD
  const handleLinkChange = useCallback(
    (key: string, newHref: string) => {
      const doc = previewRef.current?.getIframeDocument();
      if (doc) {
        updatePreviewLink(doc, key, newHref);
      }

      setParsedModel((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          linkFields: prev.linkFields.map((lk) =>
            lk.key === key ? { ...lk, currentHref: newHref } : lk
          ),
          serviceGroups: prev.serviceGroups.map((g) => ({
            ...g,
            items: g.items.map((it) => ({
              ...it,
              fields: it.fields.map((f) =>
                f.key === key ? { ...f, value: newHref } : f
              ),
            })),
          })),
        };
      });

      pushHistoryStep({ linkValues: { [key]: newHref } });

      if (doc) {
        triggerAutoSave(serializeDocToHtml(doc));
      }
    },
    [pushHistoryStep, triggerAutoSave]
  );

  // Restore individual text field
  const handleRestoreTextField = (key: string) => {
    const field = parsedModel?.textFields.find((f) => f.key === key);
    if (field) {
      handleTextChange(key, field.originalValue);
    }
  };

  // Restore individual image field
  const handleRestoreImageField = (key: string) => {
    const field = parsedModel?.imageFields.find((f) => f.key === key);
    if (field) {
      handleImageChange(key, field.originalSrc);
    }
  };

  // Restore individual link field
  const handleRestoreLinkField = (key: string) => {
    const field = parsedModel?.linkFields.find((f) => f.key === key);
    if (field) {
      handleLinkChange(key, field.originalHref);
    }
  };

  // Re-sync parsed model from current iframe DOM (used after structural changes like duplicate/delete)
  const refreshModelFromIframe = () => {
    const doc = previewRef.current?.getIframeDocument();
    if (!doc) return;
    const currentHtml = serializeDocToHtml(doc);
    try {
      const reParsed = parseModelHtml(currentHtml);
      setParsedModel(reParsed);
      triggerAutoSave(currentHtml);
    } catch (err) {
      console.warn('Refresh notice:', err);
    }
  };

  // Duplicate service item
  const handleDuplicateService = (containerSelector: string, itemIndex: number) => {
    const doc = previewRef.current?.getIframeDocument();
    if (doc) {
      const ok = duplicateServiceItemInDoc(doc, containerSelector, itemIndex);
      if (ok) {
        refreshModelFromIframe();
      }
    }
  };

  // Delete service item
  const handleDeleteService = (containerSelector: string, itemIndex: number) => {
    const doc = previewRef.current?.getIframeDocument();
    if (doc) {
      const ok = deleteServiceItemInDoc(doc, containerSelector, itemIndex);
      if (ok) {
        refreshModelFromIframe();
      }
    }
  };

  // Move service item
  const handleMoveService = (containerSelector: string, itemIndex: number, direction: 'up' | 'down') => {
    const doc = previewRef.current?.getIframeDocument();
    if (doc) {
      const ok = moveServiceItemInDoc(doc, containerSelector, itemIndex, direction);
      if (ok) {
        refreshModelFromIframe();
      }
    }
  };

  // Duplicate gallery item
  const handleDuplicateGalleryItem = (containerSelector: string, itemIndex: number) => {
    const doc = previewRef.current?.getIframeDocument();
    if (doc) {
      const ok = duplicateGalleryItemInDoc(doc, containerSelector, itemIndex);
      if (ok) {
        refreshModelFromIframe();
      }
    }
  };

  // Delete gallery item
  const handleDeleteGalleryItem = (containerSelector: string, itemIndex: number) => {
    const doc = previewRef.current?.getIframeDocument();
    if (doc) {
      const ok = deleteGalleryItemInDoc(doc, containerSelector, itemIndex);
      if (ok) {
        refreshModelFromIframe();
      }
    }
  };

  // Change gallery image
  const handleGalleryImageChange = (containerSelector: string, itemIndex: number, newSrc: string) => {
    const doc = previewRef.current?.getIframeDocument();
    if (doc) {
      const container = doc.querySelector<HTMLElement>(containerSelector);
      if (container) {
        let items = Array.from(container.children) as HTMLElement[];
        if (items.length === 0) {
          items = Array.from(container.querySelectorAll<HTMLElement>('img'));
        }
        const target = items[itemIndex];
        if (target) {
          const imgEl = target.tagName === 'IMG' ? (target as HTMLImageElement) : target.querySelector<HTMLImageElement>('img');
          if (imgEl) {
            imgEl.src = newSrc;
            refreshModelFromIframe();
          }
        }
      }
    }
  };

  // Chat message change
  const handleChatMessageChange = (key: string, newText: string) => {
    const doc = previewRef.current?.getIframeDocument();
    if (doc) {
      const el = doc.querySelector<HTMLElement>(
        `[data-bio-chat-message="${key}"], [data-bio-chat-question="${key}"], [data-bio-chat-option="${key}"], [data-bio-chat-input="${key}"]`
      );
      if (el) {
        el.textContent = newText;
      }
    }

    setParsedModel((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        chatMessages: prev.chatMessages.map((msg) =>
          msg.key === key ? { ...msg, text: newText } : msg
        ),
      };
    });

    if (doc) {
      triggerAutoSave(serializeDocToHtml(doc));
    }
  };

  // Undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const targetStep = history[historyIndex - 1];
      const doc = previewRef.current?.getIframeDocument();

      // Apply texts
      Object.entries(targetStep.textValues).forEach(([k, v]) => {
        if (doc) updatePreviewText(doc, k, v);
      });
      // Apply images
      Object.entries(targetStep.imageValues).forEach(([k, v]) => {
        if (doc) updatePreviewImage(doc, k, v);
      });
      // Apply links
      Object.entries(targetStep.linkValues).forEach(([k, v]) => {
        if (doc) updatePreviewLink(doc, k, v);
      });

      setParsedModel((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          textFields: prev.textFields.map((tf) => ({
            ...tf,
            currentValue: targetStep.textValues[tf.key] ?? tf.currentValue,
          })),
          imageFields: prev.imageFields.map((img) => ({
            ...img,
            currentSrc: targetStep.imageValues[img.key] ?? img.currentSrc,
          })),
          linkFields: prev.linkFields.map((lk) => ({
            ...lk,
            currentHref: targetStep.linkValues[lk.key] ?? lk.currentHref,
          })),
        };
      });

      setHistoryIndex((prev) => prev - 1);
    }
  }, [history, historyIndex]);

  // Redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const targetStep = history[historyIndex + 1];
      const doc = previewRef.current?.getIframeDocument();

      Object.entries(targetStep.textValues).forEach(([k, v]) => {
        if (doc) updatePreviewText(doc, k, v);
      });
      Object.entries(targetStep.imageValues).forEach(([k, v]) => {
        if (doc) updatePreviewImage(doc, k, v);
      });
      Object.entries(targetStep.linkValues).forEach(([k, v]) => {
        if (doc) updatePreviewLink(doc, k, v);
      });

      setParsedModel((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          textFields: prev.textFields.map((tf) => ({
            ...tf,
            currentValue: targetStep.textValues[tf.key] ?? tf.currentValue,
          })),
          imageFields: prev.imageFields.map((img) => ({
            ...img,
            currentSrc: targetStep.imageValues[img.key] ?? img.currentSrc,
          })),
          linkFields: prev.linkFields.map((lk) => ({
            ...lk,
            currentHref: targetStep.linkValues[lk.key] ?? lk.currentHref,
          })),
        };
      });

      setHistoryIndex((prev) => prev + 1);
    }
  }, [history, historyIndex]);

  // Keyboard shortcuts (Ctrl+Z / Ctrl+Shift+Z)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Restore Entire Original Template
  const handleRestoreOriginalConfirm = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Restaurar Modelo Original',
      message:
        'Todas as alterações de textos, fotos e links feitas nesta sessão serão descartadas e o modelo voltará ao estado inicial. Deseja continuar?',
      confirmLabel: 'Restaurar Tudo',
      isDestructive: true,
      action: () => {
        if (originalHtml) {
          previewRef.current?.reloadWithHtml(originalHtml);
          handleAnalyzeHtml(originalHtml);
        }
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Back to import screen (Trocar Modelo)
  const handleBackToImportConfirm = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Trocar Modelo',
      message:
        'Suas alterações atuais foram salvas neste dispositivo, mas ao trocar de modelo você iniciará uma nova edição. Deseja continuar?',
      confirmLabel: 'Trocar Modelo',
      isDestructive: false,
      action: () => {
        setViewMode('import');
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Prepare & trigger download
  const handleOpenDownload = () => {
    const doc = previewRef.current?.getIframeDocument();
    let finalHtml = '';
    if (doc) {
      finalHtml = serializeDocToHtml(doc);
    } else if (originalHtml) {
      finalHtml = originalHtml;
    }
    setExportedHtml(finalHtml);
    setShowDownloadModal(true);
  };

  // Render Import screen
  if (viewMode === 'import' || !parsedModel) {
    return (
      <>
        <HomeImport
          onAnalyzeHtml={handleAnalyzeHtml}
          savedDraftHtml={savedDraft}
          onRestoreDraft={handleRestoreDraft}
        />

        <ConfirmModal
          isOpen={confirmModal.isOpen}
          title={confirmModal.title}
          message={confirmModal.message}
          confirmLabel={confirmModal.confirmLabel}
          isDestructive={confirmModal.isDestructive}
          onConfirm={confirmModal.action}
          onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        />
      </>
    );
  }

  // Render Visual Editor
  return (
    <div className="h-screen w-screen flex flex-col bg-[#050505] text-white overflow-hidden">
      
      {/* Top Header */}
      <Header
        onBackToImport={handleBackToImportConfirm}
        onDownload={handleOpenDownload}
        onRestoreOriginal={handleRestoreOriginalConfirm}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        saveStatus={saveStatus}
        deviceMode={deviceMode}
        onDeviceModeChange={setDeviceMode}
        mobileActiveTab={mobileActiveTab}
        onMobileActiveTabChange={setMobileActiveTab}
        totalFields={parsedModel.totalFieldsFound}
      />

      {/* Main Workspace (Editor Panel + Preview) */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Side: Visual Editor Panel */}
        <aside
          className={`h-full w-full md:w-[380px] lg:w-[420px] shrink-0 border-r border-white/[0.08] transition-all duration-200 z-10 ${
            mobileActiveTab === 'edit' ? 'block' : 'hidden md:block'
          }`}
        >
          <EditorPanel
            textFields={parsedModel.textFields}
            imageFields={parsedModel.imageFields}
            linkFields={parsedModel.linkFields}
            serviceGroups={parsedModel.serviceGroups}
            galleryGroups={parsedModel.galleryGroups}
            chatMessages={parsedModel.chatMessages}
            onTextChange={handleTextChange}
            onImageChange={handleImageChange}
            onLinkChange={handleLinkChange}
            onRestoreTextField={handleRestoreTextField}
            onRestoreImageField={handleRestoreImageField}
            onRestoreLinkField={handleRestoreLinkField}
            onDuplicateService={handleDuplicateService}
            onDeleteService={handleDeleteService}
            onMoveService={handleMoveService}
            onDuplicateGalleryItem={handleDuplicateGalleryItem}
            onDeleteGalleryItem={handleDeleteGalleryItem}
            onGalleryImageChange={handleGalleryImageChange}
            onChatMessageChange={handleChatMessageChange}
          />
        </aside>

        {/* Right Side: Live Iframe Preview */}
        <main
          className={`h-full flex-1 overflow-hidden transition-all duration-200 ${
            mobileActiveTab === 'preview' ? 'block' : 'hidden md:block'
          }`}
        >
          <PreviewFrame
            ref={previewRef}
            initialHtml={originalHtml}
            deviceMode={deviceMode}
            onDeviceModeChange={setDeviceMode}
            onIframeReady={handleIframeReady}
          />
        </main>

      </div>

      {/* Download Modal */}
      <DownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        htmlContent={exportedHtml}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.confirmLabel}
        isDestructive={confirmModal.isDestructive}
        onConfirm={confirmModal.action}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />

    </div>
  );
}
