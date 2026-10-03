import React, { useState, useMemo, useRef, ChangeEvent } from 'react';
import { 
  Search, 
  ChevronDown, 
  ChevronRight, 
  RotateCcw, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Type, 
  Plus, 
  Trash2, 
  Copy, 
  ChevronUp, 
  Upload, 
  ExternalLink,
  MessageSquare,
  Sparkles,
  HelpCircle,
  FolderOpen
} from 'lucide-react';
import { 
  BioTextField, 
  BioImageField, 
  BioLinkField, 
  BioServiceGroup, 
  BioGalleryGroup, 
  BioChatMessage,
  LinkType
} from '../types/bio';
import { formatWhatsAppUrl, formatInstagramUrl, formatMapsUrl } from '../utils/analyzer';
import { fileToBase64 } from '../utils/domUpdater';

interface EditorPanelProps {
  textFields: BioTextField[];
  imageFields: BioImageField[];
  linkFields: BioLinkField[];
  serviceGroups: BioServiceGroup[];
  galleryGroups: BioGalleryGroup[];
  chatMessages: BioChatMessage[];
  onTextChange: (key: string, newValue: string) => void;
  onImageChange: (key: string, newSrc: string) => void;
  onLinkChange: (key: string, newHref: string) => void;
  onRestoreTextField: (key: string) => void;
  onRestoreImageField: (key: string) => void;
  onRestoreLinkField: (key: string) => void;
  onDuplicateService: (containerSelector: string, itemIndex: number) => void;
  onDeleteService: (containerSelector: string, itemIndex: number) => void;
  onMoveService: (containerSelector: string, itemIndex: number, direction: 'up' | 'down') => void;
  onDuplicateGalleryItem: (containerSelector: string, itemIndex: number) => void;
  onDeleteGalleryItem: (containerSelector: string, itemIndex: number) => void;
  onGalleryImageChange: (containerSelector: string, itemIndex: number, newSrc: string) => void;
  onChatMessageChange: (key: string, newText: string) => void;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
  textFields,
  imageFields,
  linkFields,
  serviceGroups,
  galleryGroups,
  chatMessages,
  onTextChange,
  onImageChange,
  onLinkChange,
  onRestoreTextField,
  onRestoreImageField,
  onRestoreLinkField,
  onDuplicateService,
  onDeleteService,
  onMoveService,
  onDuplicateGalleryItem,
  onDeleteGalleryItem,
  onGalleryImageChange,
  onChatMessageChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    IDENTIDADE: true,
    CONTATOS: true,
    TEXTOS: true,
    SERVIÇOS: true,
    CARDÁPIO: true,
    PORTFÓLIO: true,
    GALERIA: true,
    CHATBOT: true,
    IMAGENS: true,
    OUTROS: true,
  });

  const [expandedServices, setExpandedServices] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleServiceItem = (itemId: string) => {
    setExpandedServices((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  // Filtered fields based on search
  const normalizedSearch = searchTerm.toLowerCase().trim();

  const filteredTexts = useMemo(() => {
    if (!normalizedSearch) return textFields;
    return textFields.filter(
      (f) =>
        f.label.toLowerCase().includes(normalizedSearch) ||
        f.key.toLowerCase().includes(normalizedSearch) ||
        f.currentValue.toLowerCase().includes(normalizedSearch)
    );
  }, [textFields, normalizedSearch]);

  const filteredImages = useMemo(() => {
    if (!normalizedSearch) return imageFields;
    return imageFields.filter(
      (f) =>
        f.label.toLowerCase().includes(normalizedSearch) ||
        f.key.toLowerCase().includes(normalizedSearch)
    );
  }, [imageFields, normalizedSearch]);

  const filteredLinks = useMemo(() => {
    if (!normalizedSearch) return linkFields;
    return linkFields.filter(
      (f) =>
        f.label.toLowerCase().includes(normalizedSearch) ||
        f.key.toLowerCase().includes(normalizedSearch) ||
        f.currentHref.toLowerCase().includes(normalizedSearch)
    );
  }, [linkFields, normalizedSearch]);

  // Group texts by category
  const textsByCategory = useMemo(() => {
    const map: Record<string, BioTextField[]> = {};
    filteredTexts.forEach((tf) => {
      const cat = tf.category || 'TEXTOS';
      if (!map[cat]) map[cat] = [];
      map[cat].push(tf);
    });
    return map;
  }, [filteredTexts]);

  // Group images by category
  const imagesByCategory = useMemo(() => {
    const map: Record<string, BioImageField[]> = {};
    filteredImages.forEach((img) => {
      const cat = img.category || 'IMAGENS';
      if (!map[cat]) map[cat] = [];
      map[cat].push(img);
    });
    return map;
  }, [filteredImages]);

  // Handle local image file upload
  const handleImageFileUpload = async (key: string, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      onImageChange(key, base64);
    } catch {
      alert('Erro ao carregar a imagem selecionada.');
    }
  };

  // Handle gallery item file upload
  const handleGalleryFileUpload = async (
    containerSelector: string,
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      onGalleryImageChange(containerSelector, index, base64);
    } catch {
      alert('Erro ao carregar imagem para a galeria.');
    }
  };

  const totalResults =
    filteredTexts.length +
    filteredImages.length +
    filteredLinks.length +
    serviceGroups.length +
    galleryGroups.length;

  return (
    <div className="w-full h-full flex flex-col bg-[#080A09] text-white select-none">
      
      {/* Search Bar */}
      <div className="p-3 sm:p-4 border-b border-white/[0.06] bg-[#080A09]">
        <div className="relative">
          <Search className="w-4 h-4 text-[#8D9891] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar campo (ex: WhatsApp, Logo, Título)..."
            className="w-full bg-[#0D1110] text-xs sm:text-sm text-white placeholder:text-[#8D9891]/60 pl-9 pr-8 py-2.5 rounded-xl border border-white/[0.08] focus:border-[#35F58A] focus:outline-none focus:ring-1 focus:ring-[#35F58A]/30 transition-all select-text"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8D9891] hover:text-white px-1.5 py-0.5 rounded"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Accordions List */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 select-text">
        {totalResults === 0 && searchTerm && (
          <div className="text-center py-10 text-xs text-[#8D9891]">
            Nenhum campo encontrado para &quot;{searchTerm}&quot;.
          </div>
        )}

        {/* 1. SECTION: IDENTIDADE (Logo, Business Name, Avatar) */}
        {(textsByCategory['IDENTIDADE']?.length || imagesByCategory['IDENTIDADE']?.length) ? (
          <div className="border border-white/[0.07] rounded-2xl bg-[#0D1110]/60 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('IDENTIDADE')}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#0D1110] hover:bg-[#141A17] text-left transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#35F58A]" />
                <span className="text-xs font-bold tracking-wider uppercase text-white">
                  Identidade do Biosite
                </span>
              </div>
              {openSections['IDENTIDADE'] ? (
                <ChevronDown className="w-4 h-4 text-[#8D9891]" />
              ) : (
                <ChevronRight className="w-4 h-4 text-[#8D9891]" />
              )}
            </button>

            {openSections['IDENTIDADE'] && (
              <div className="p-4 space-y-5">
                {/* Images in Identity (Logo, Avatar) */}
                {imagesByCategory['IDENTIDADE']?.map((img) => (
                  <ImageFieldCard
                    key={img.id}
                    field={img}
                    onChange={(src) => onImageChange(img.key, src)}
                    onRestore={() => onRestoreImageField(img.key)}
                    onFileUpload={(e) => handleImageFileUpload(img.key, e)}
                  />
                ))}

                {/* Texts in Identity (Business name, etc.) */}
                {textsByCategory['IDENTIDADE']?.map((txt) => (
                  <TextFieldCard
                    key={txt.id}
                    field={txt}
                    onChange={(val) => onTextChange(txt.key, val)}
                    onRestore={() => onRestoreTextField(txt.key)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : null}

        {/* 2. SECTION: CONTATOS & LINKS (WhatsApp, Instagram, Maps, etc.) */}
        {(filteredLinks.length > 0 || textsByCategory['CONTATOS']?.length) ? (
          <div className="border border-white/[0.07] rounded-2xl bg-[#0D1110]/60 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('CONTATOS')}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#0D1110] hover:bg-[#141A17] text-left transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#35F58A]" />
                <span className="text-xs font-bold tracking-wider uppercase text-white">
                  Contatos, Redes & Localização
                </span>
              </div>
              {openSections['CONTATOS'] ? (
                <ChevronDown className="w-4 h-4 text-[#8D9891]" />
              ) : (
                <ChevronRight className="w-4 h-4 text-[#8D9891]" />
              )}
            </button>

            {openSections['CONTATOS'] && (
              <div className="p-4 space-y-5">
                {/* Links */}
                {filteredLinks.map((link) => (
                  <LinkFieldCard
                    key={link.id}
                    field={link}
                    onChange={(val) => onLinkChange(link.key, val)}
                    onRestore={() => onRestoreLinkField(link.key)}
                  />
                ))}

                {/* Texts in Contacts (Address, hours text, etc.) */}
                {textsByCategory['CONTATOS']?.map((txt) => (
                  <TextFieldCard
                    key={txt.id}
                    field={txt}
                    onChange={(val) => onTextChange(txt.key, val)}
                    onRestore={() => onRestoreTextField(txt.key)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : null}

        {/* 3. SECTION: TEXTOS GERAIS (Hero title, subtitle, descriptions, badges) */}
        {textsByCategory['TEXTOS']?.length ? (
          <div className="border border-white/[0.07] rounded-2xl bg-[#0D1110]/60 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('TEXTOS')}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#0D1110] hover:bg-[#141A17] text-left transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#35F58A]" />
                <span className="text-xs font-bold tracking-wider uppercase text-white">
                  Títulos & Textos Principais
                </span>
              </div>
              {openSections['TEXTOS'] ? (
                <ChevronDown className="w-4 h-4 text-[#8D9891]" />
              ) : (
                <ChevronRight className="w-4 h-4 text-[#8D9891]" />
              )}
            </button>

            {openSections['TEXTOS'] && (
              <div className="p-4 space-y-4">
                {textsByCategory['TEXTOS'].map((txt) => (
                  <TextFieldCard
                    key={txt.id}
                    field={txt}
                    onChange={(val) => onTextChange(txt.key, val)}
                    onRestore={() => onRestoreTextField(txt.key)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : null}

        {/* 4. SECTION: SERVIÇOS OU CARDÁPIO (Repeatable items) */}
        {serviceGroups.map((group) => {
          const isMenu = group.category === 'menu';
          const title = isMenu ? 'Gerenciar Cardápio' : 'Gerenciar Serviços';
          const sectionKey = isMenu ? 'CARDÁPIO' : 'SERVIÇOS';

          return (
            <div key={group.id} className="border border-white/[0.07] rounded-2xl bg-[#0D1110]/60 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection(sectionKey)}
                className="w-full flex items-center justify-between px-4 py-3 bg-[#0D1110] hover:bg-[#141A17] text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#35F58A]" />
                  <span className="text-xs font-bold tracking-wider uppercase text-white">
                    {group.title || title} ({group.items.length})
                  </span>
                </div>
                {openSections[sectionKey] ? (
                  <ChevronDown className="w-4 h-4 text-[#8D9891]" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-[#8D9891]" />
                )}
              </button>

              {openSections[sectionKey] && (
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] text-[#8D9891]">
                      Duplique, reordene ou remova itens preservando o design.
                    </span>
                    {group.items.length > 0 && (
                      <button
                        type="button"
                        onClick={() => onDuplicateService(group.containerSelector, group.items.length - 1)}
                        className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-[#35F58A] bg-[#35F58A]/10 hover:bg-[#35F58A]/20 border border-[#35F58A]/30 rounded-lg transition-all"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Adicionar Item</span>
                      </button>
                    )}
                  </div>

                  {group.items.map((item, idx) => {
                    const isExpanded = expandedServices[item.id] !== false; // expanded by default
                    return (
                      <div
                        key={item.id}
                        className="border border-white/[0.08] rounded-xl bg-[#080A09] overflow-hidden"
                      >
                        <div className="flex items-center justify-between p-3 bg-[#0D1110] text-xs font-semibold">
                          <button
                            type="button"
                            onClick={() => toggleServiceItem(item.id)}
                            className="flex items-center gap-2 text-white hover:text-[#35F58A] transition-colors truncate max-w-[170px]"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-3.5 h-3.5 text-[#8D9891]" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5 text-[#8D9891]" />
                            )}
                            <span className="truncate">
                              #{idx + 1} {item.title}
                            </span>
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => onMoveService(group.containerSelector, idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 text-[#8D9891] hover:text-white disabled:opacity-20 transition-colors"
                              title="Mover para cima"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onMoveService(group.containerSelector, idx, 'down')}
                              disabled={idx === group.items.length - 1}
                              className="p-1 text-[#8D9891] hover:text-white disabled:opacity-20 transition-colors"
                              title="Mover para baixo"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDuplicateService(group.containerSelector, idx)}
                              className="p-1 text-[#8D9891] hover:text-[#35F58A] transition-colors"
                              title="Duplicar item clonando layout"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteService(group.containerSelector, idx)}
                              disabled={group.items.length <= 1}
                              className="p-1 text-[#8D9891] hover:text-red-400 disabled:opacity-20 transition-colors"
                              title="Excluir item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="p-3 space-y-3 border-t border-white/[0.05]">
                            {item.fields.map((sub) => {
                              if (sub.type === 'text') {
                                return (
                                  <div key={sub.key}>
                                    <label className="text-[11px] font-medium text-[#8D9891] mb-1 block">
                                      {sub.label}
                                    </label>
                                    <input
                                      type="text"
                                      value={sub.value}
                                      onChange={(e) => onTextChange(sub.key, e.target.value)}
                                      className="w-full bg-[#131715] text-xs text-white px-3 py-1.5 rounded-lg border border-white/[0.08] focus:border-[#35F58A] focus:outline-none"
                                    />
                                  </div>
                                );
                              }
                              if (sub.type === 'image') {
                                return (
                                  <div key={sub.key}>
                                    <label className="text-[11px] font-medium text-[#8D9891] mb-1 block">
                                      {sub.label}
                                    </label>
                                    <input
                                      type="text"
                                      value={sub.value}
                                      onChange={(e) => onImageChange(sub.key, e.target.value)}
                                      className="w-full bg-[#131715] text-xs text-white px-3 py-1.5 rounded-lg border border-white/[0.08] focus:border-[#35F58A] focus:outline-none"
                                    />
                                  </div>
                                );
                              }
                              if (sub.type === 'link') {
                                return (
                                  <div key={sub.key}>
                                    <label className="text-[11px] font-medium text-[#8D9891] mb-1 block">
                                      {sub.label}
                                    </label>
                                    <input
                                      type="text"
                                      value={sub.value}
                                      onChange={(e) => onLinkChange(sub.key, e.target.value)}
                                      className="w-full bg-[#131715] text-xs text-white px-3 py-1.5 rounded-lg border border-white/[0.08] focus:border-[#35F58A] focus:outline-none"
                                    />
                                  </div>
                                );
                              }
                              return null;
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* 5. SECTION: GALERIA DE FOTOS */}
        {galleryGroups.map((group) => (
          <div key={group.id} className="border border-white/[0.07] rounded-2xl bg-[#0D1110]/60 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('GALERIA')}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#0D1110] hover:bg-[#141A17] text-left transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#35F58A]" />
                <span className="text-xs font-bold tracking-wider uppercase text-white">
                  {group.title} ({group.items.length})
                </span>
              </div>
              {openSections['GALERIA'] ? (
                <ChevronDown className="w-4 h-4 text-[#8D9891]" />
              ) : (
                <ChevronRight className="w-4 h-4 text-[#8D9891]" />
              )}
            </button>

            {openSections['GALERIA'] && (
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-[#8D9891]">
                    Substitua ou clone fotos da galeria.
                  </span>
                  {group.items.length > 0 && (
                    <button
                      type="button"
                      onClick={() => onDuplicateGalleryItem(group.containerSelector, group.items.length - 1)}
                      className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-[#35F58A] bg-[#35F58A]/10 hover:bg-[#35F58A]/20 border border-[#35F58A]/30 rounded-lg transition-all"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Adicionar Foto</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {group.items.map((item, idx) => (
                    <div
                      key={item.id}
                      className="border border-white/[0.08] rounded-xl bg-[#080A09] p-2 space-y-2 relative group"
                    >
                      <div className="aspect-square rounded-lg overflow-hidden bg-black/40 border border-white/[0.05] relative">
                        <img
                          src={item.src}
                          alt={`Foto ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex items-center justify-between gap-1">
                        <label className="cursor-pointer flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-white bg-[#0D1110] hover:bg-[#151D18] border border-white/[0.08] rounded-md transition-colors">
                          <Upload className="w-3 h-3 text-[#35F58A]" />
                          <span>Trocar</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleGalleryFileUpload(group.containerSelector, idx, e)}
                          />
                        </label>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => onDuplicateGalleryItem(group.containerSelector, idx)}
                            className="p-1 text-[#8D9891] hover:text-[#35F58A] transition-colors"
                            title="Duplicar foto"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteGalleryItem(group.containerSelector, idx)}
                            disabled={group.items.length <= 1}
                            className="p-1 text-[#8D9891] hover:text-red-400 disabled:opacity-20 transition-colors"
                            title="Remover foto"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* 6. SECTION: OUTRAS IMAGENS (Banners, Backgrounds, etc.) */}
        {imagesByCategory['IMAGENS']?.length ? (
          <div className="border border-white/[0.07] rounded-2xl bg-[#0D1110]/60 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('IMAGENS')}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#0D1110] hover:bg-[#141A17] text-left transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#35F58A]" />
                <span className="text-xs font-bold tracking-wider uppercase text-white">
                  Fotos & Banners
                </span>
              </div>
              {openSections['IMAGENS'] ? (
                <ChevronDown className="w-4 h-4 text-[#8D9891]" />
              ) : (
                <ChevronRight className="w-4 h-4 text-[#8D9891]" />
              )}
            </button>

            {openSections['IMAGENS'] && (
              <div className="p-4 space-y-4">
                {imagesByCategory['IMAGENS'].map((img) => (
                  <ImageFieldCard
                    key={img.id}
                    field={img}
                    onChange={(src) => onImageChange(img.key, src)}
                    onRestore={() => onRestoreImageField(img.key)}
                    onFileUpload={(e) => handleImageFileUpload(img.key, e)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : null}

        {/* 7. SECTION: CHATBOT */}
        {chatMessages.length > 0 && (
          <div className="border border-white/[0.07] rounded-2xl bg-[#0D1110]/60 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('CHATBOT')}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#0D1110] hover:bg-[#141A17] text-left transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#35F58A]" />
                <span className="text-xs font-bold tracking-wider uppercase text-white">
                  Conversas do Chatbot ({chatMessages.length})
                </span>
              </div>
              {openSections['CHATBOT'] ? (
                <ChevronDown className="w-4 h-4 text-[#8D9891]" />
              ) : (
                <ChevronRight className="w-4 h-4 text-[#8D9891]" />
              )}
            </button>

            {openSections['CHATBOT'] && (
              <div className="p-4 space-y-3">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#8D9891] block">
                      {msg.label}
                    </label>
                    <input
                      type="text"
                      value={msg.text}
                      onChange={(e) => onChatMessageChange(msg.key, e.target.value)}
                      className="w-full bg-[#0D1110] text-xs text-white px-3 py-2 rounded-xl border border-white/[0.08] focus:border-[#35F58A] focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

/* --- Subcomponent: Text Field Card --- */
interface TextFieldCardProps {
  field: BioTextField;
  onChange: (val: string) => void;
  onRestore: () => void;
}

const TextFieldCard: React.FC<TextFieldCardProps> = ({ field, onChange, onRestore }) => {
  const isChanged = field.currentValue !== field.originalValue;

  return (
    <div className="space-y-1.5 group">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-[#d1d5db] flex items-center gap-1.5">
          <span>{field.label}</span>
          {field.occurrences > 1 && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.06] text-[#8D9891]" title="Este mesmo texto é usado em múltiplos locais do site">
              {field.occurrences}x sincronizado
            </span>
          )}
        </label>

        {isChanged && (
          <button
            type="button"
            onClick={onRestore}
            className="flex items-center gap-1 text-[10px] text-[#8D9891] hover:text-[#35F58A] transition-colors"
            title="Restaurar valor original"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restaurar</span>
          </button>
        )}
      </div>

      {field.isMultiline ? (
        <textarea
          rows={3}
          value={field.currentValue}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#0D1110] text-xs sm:text-sm text-white p-3 rounded-xl border border-white/[0.08] focus:border-[#35F58A] focus:outline-none focus:ring-1 focus:ring-[#35F58A]/30 transition-all resize-y select-text"
        />
      ) : (
        <input
          type="text"
          value={field.currentValue}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#0D1110] text-xs sm:text-sm text-white px-3.5 py-2.5 rounded-xl border border-white/[0.08] focus:border-[#35F58A] focus:outline-none focus:ring-1 focus:ring-[#35F58A]/30 transition-all select-text"
        />
      )}
    </div>
  );
};

/* --- Subcomponent: Image Field Card --- */
interface ImageFieldCardProps {
  field: BioImageField;
  onChange: (newSrc: string) => void;
  onRestore: () => void;
  onFileUpload: (e: ChangeEvent<HTMLInputElement>) => void;
}

const ImageFieldCard: React.FC<ImageFieldCardProps> = ({
  field,
  onChange,
  onRestore,
  onFileUpload,
}) => {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const isChanged = field.currentSrc !== field.originalSrc;
  const isBase64 = field.currentSrc.startsWith('data:image');

  return (
    <div className="space-y-2 group">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-[#d1d5db] flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-[#35F58A]" />
          <span>{field.label}</span>
          {field.occurrences > 1 && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.06] text-[#8D9891]">
              {field.occurrences}x
            </span>
          )}
        </label>

        {isChanged && (
          <button
            type="button"
            onClick={onRestore}
            className="flex items-center gap-1 text-[10px] text-[#8D9891] hover:text-[#35F58A] transition-colors"
            title="Restaurar imagem original"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restaurar</span>
          </button>
        )}
      </div>

      <div className="flex items-start gap-3">
        {/* Thumbnail Preview */}
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-black/60 border border-white/[0.1] shrink-0 relative flex items-center justify-center">
          {field.currentSrc ? (
            <img
              src={field.currentSrc}
              alt={field.label}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="w-6 h-6 text-[#8D9891]/40" />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#050505] bg-[#35F58A] hover:bg-[#2fe07c] rounded-lg transition-all shadow-sm">
              <Upload className="w-3.5 h-3.5" />
              <span>Escolher Imagem</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileUpload}
              />
            </label>

            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="px-2.5 py-1.5 text-xs font-medium text-[#8D9891] hover:text-white bg-[#0D1110] hover:bg-[#141A17] border border-white/[0.08] rounded-lg transition-all"
            >
              {showUrlInput ? 'Ocultar URL' : 'Colar URL'}
            </button>
          </div>

          <div className="text-[10px] text-[#8D9891]">
            {isBase64 ? (
              <span className="text-[#35F58A]">✓ Imagem incorporada para publicação local</span>
            ) : (
              <span>Imagens do computador serão convertidas em Base64 para funcionar offline.</span>
            )}
          </div>
        </div>
      </div>

      {showUrlInput && (
        <div className="pt-1">
          <input
            type="text"
            placeholder="https://exemplo.com/minha-foto.jpg"
            value={field.currentSrc}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-[#0D1110] text-xs text-white px-3 py-2 rounded-xl border border-white/[0.08] focus:border-[#35F58A] focus:outline-none"
          />
        </div>
      )}
    </div>
  );
};

/* --- Subcomponent: Link Field Card --- */
interface LinkFieldCardProps {
  field: BioLinkField;
  onChange: (newHref: string) => void;
  onRestore: () => void;
}

const LinkFieldCard: React.FC<LinkFieldCardProps> = ({ field, onChange, onRestore }) => {
  const isChanged = field.currentHref !== field.originalHref;
  const isWhatsApp = field.linkType === 'whatsapp';
  const isInstagram = field.linkType === 'instagram';
  const isMaps = field.linkType === 'maps';

  // Local state for specialized inputs
  const [waNumber, setWaNumber] = useState(field.whatsappNumber || '');
  const [waMessage, setWaMessage] = useState(field.whatsappMessage || '');
  const [instaUser, setInstaUser] = useState(field.instagramUsername || '');
  const [mapsQuery, setMapsQuery] = useState(field.mapsAddress || field.currentHref || '');

  const handleWhatsAppUpdate = (num: string, msg: string) => {
    setWaNumber(num);
    setWaMessage(msg);
    const newHref = formatWhatsAppUrl(num, msg);
    onChange(newHref);
  };

  const handleInstagramUpdate = (val: string) => {
    setInstaUser(val);
    const newHref = formatInstagramUrl(val);
    onChange(newHref);
  };

  const handleMapsUpdate = (val: string) => {
    setMapsQuery(val);
    const newHref = formatMapsUrl(val);
    onChange(newHref);
  };

  return (
    <div className="space-y-2 group">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-[#d1d5db] flex items-center gap-1.5">
          <LinkIcon className="w-3.5 h-3.5 text-[#35F58A]" />
          <span>{field.label}</span>
          {field.occurrences > 1 && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.06] text-[#8D9891]">
              {field.occurrences}x
            </span>
          )}
        </label>

        {isChanged && (
          <button
            type="button"
            onClick={onRestore}
            className="flex items-center gap-1 text-[10px] text-[#8D9891] hover:text-[#35F58A] transition-colors"
            title="Restaurar link original"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restaurar</span>
          </button>
        )}
      </div>

      {/* WHATSAPP SPECIFIC CONTROLS */}
      {isWhatsApp ? (
        <div className="p-3 rounded-xl bg-[#080A09] border border-white/[0.08] space-y-2.5">
          <div>
            <label className="text-[11px] font-medium text-[#8D9891] mb-1 block">
              Número do WhatsApp (DDD + Número):
            </label>
            <input
              type="text"
              placeholder="34999999999 ou +5534999999999"
              value={waNumber}
              onChange={(e) => handleWhatsAppUpdate(e.target.value, waMessage)}
              className="w-full bg-[#0D1110] text-xs text-white px-3 py-2 rounded-lg border border-white/[0.08] focus:border-[#35F58A] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-[#8D9891] mb-1 block">
              Mensagem Inicial Pré-definida (opcional):
            </label>
            <input
              type="text"
              placeholder="Olá, gostaria de saber mais informações!"
              value={waMessage}
              onChange={(e) => handleWhatsAppUpdate(waNumber, e.target.value)}
              className="w-full bg-[#0D1110] text-xs text-white px-3 py-2 rounded-lg border border-white/[0.08] focus:border-[#35F58A] focus:outline-none"
            />
          </div>

          <div className="text-[10px] font-mono text-[#8D9891] truncate" title={field.currentHref}>
            Link: {field.currentHref}
          </div>
        </div>
      ) : isInstagram ? (
        /* INSTAGRAM SPECIFIC CONTROLS */
        <div className="p-3 rounded-xl bg-[#080A09] border border-white/[0.08] space-y-2">
          <label className="text-[11px] font-medium text-[#8D9891] block">
            Nome do usuário ou URL do perfil:
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#8D9891] pointer-events-none">
              @
            </span>
            <input
              type="text"
              placeholder="seuperfil"
              value={instaUser}
              onChange={(e) => handleInstagramUpdate(e.target.value)}
              className="w-full bg-[#0D1110] text-xs text-white pl-7 pr-3 py-2 rounded-lg border border-white/[0.08] focus:border-[#35F58A] focus:outline-none"
            />
          </div>
          <div className="text-[10px] font-mono text-[#8D9891] truncate" title={field.currentHref}>
            Link: {field.currentHref}
          </div>
        </div>
      ) : isMaps ? (
        /* GOOGLE MAPS SPECIFIC CONTROLS */
        <div className="p-3 rounded-xl bg-[#080A09] border border-white/[0.08] space-y-2">
          <label className="text-[11px] font-medium text-[#8D9891] block">
            Endereço ou Link do Google Maps:
          </label>
          <input
            type="text"
            placeholder="Av. Paulista, 1000, São Paulo - SP ou link do Maps"
            value={mapsQuery}
            onChange={(e) => handleMapsUpdate(e.target.value)}
            className="w-full bg-[#0D1110] text-xs text-white px-3 py-2 rounded-lg border border-white/[0.08] focus:border-[#35F58A] focus:outline-none"
          />
          <div className="text-[10px] font-mono text-[#8D9891] truncate" title={field.currentHref}>
            Link: {field.currentHref}
          </div>
        </div>
      ) : (
        /* STANDARD URL INPUT */
        <div>
          <input
            type="text"
            value={field.currentHref}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-[#0D1110] text-xs sm:text-sm text-white px-3.5 py-2.5 rounded-xl border border-white/[0.08] focus:border-[#35F58A] focus:outline-none focus:ring-1 focus:ring-[#35F58A]/30 transition-all select-text"
          />
        </div>
      )}
    </div>
  );
};
