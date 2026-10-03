import {
  BioTextField,
  BioImageField,
  BioLinkField,
  LinkType,
  BioServiceGroup,
  BioServiceItem,
  BioServiceSubField,
  BioGalleryGroup,
  BioGalleryItem,
  BioChatMessage,
  ParsedBioModel,
} from '../types/bio';

// Friendly labels dictionary
export const FRIENDLY_LABELS: Record<string, string> = {
  'business-name': 'Nome da empresa',
  'company-name': 'Nome da empresa',
  'brand-name': 'Nome da marca',
  'hero-title': 'Título principal',
  'hero-subtitle': 'Subtítulo principal',
  'hero-description': 'Descrição principal',
  'hero-tagline': 'Slogan / Frase de efeito',
  'about-title': 'Título Sobre',
  'about-text': 'Texto Sobre nós',
  'about-description': 'Descrição detalhada',
  'address': 'Endereço',
  'address-city': 'Cidade e Estado',
  'hours': 'Horário de funcionamento',
  'working-hours': 'Horário de atendimento',
  'instagram-label': 'Nome do Instagram',
  'whatsapp-label': 'Texto do WhatsApp',
  'phone-label': 'Número de telefone',
  'email-label': 'Endereço de e-mail',
  'location': 'Localização',
  'maps-label': 'Texto do mapa',
  'logo': 'Logo da empresa',
  'logo-light': 'Logo (versão clara)',
  'logo-dark': 'Logo (versão escura)',
  'hero-image': 'Foto de destaque',
  'profile-image': 'Foto de perfil',
  'avatar': 'Foto de perfil / Avatar',
  'banner-image': 'Banner principal',
  'background-image': 'Imagem de fundo',
  'about-image': 'Foto Sobre',
  'badge': 'Selo / Destaque',
  'cta-button': 'Texto do botão principal',
  'cta-text': 'Chamada para ação',
  'footer-text': 'Texto do rodapé',
  'copyright': 'Direitos autorais',
  'whatsapp': 'Link do WhatsApp',
  'instagram': 'Link do Instagram',
  'maps': 'Localização no Google Maps',
  'facebook': 'Link do Facebook',
  'tiktok': 'Link do TikTok',
  'youtube': 'Canal do YouTube',
  'email': 'Link de E-mail',
  'phone': 'Link de Telefone',
  'catalog': 'Catálogo / Menu',
  'website': 'Site oficial',
  'order': 'Fazer pedido',
};

// Converts key to friendly label
export function getFriendlyLabel(key: string): string {
  const normalized = key.toLowerCase().trim();
  if (FRIENDLY_LABELS[normalized]) {
    return FRIENDLY_LABELS[normalized];
  }

  // Common patterns
  if (normalized.endsWith('-name')) {
    const prefix = normalized.replace(/-name$/, '');
    return `Nome do ${getFriendlyLabel(prefix) || prefix}`;
  }
  if (normalized.endsWith('-title')) {
    const prefix = normalized.replace(/-title$/, '');
    return `Título do ${getFriendlyLabel(prefix) || prefix}`;
  }
  if (normalized.endsWith('-price')) {
    return 'Preço';
  }
  if (normalized.endsWith('-promo-price') || normalized.endsWith('-discount-price')) {
    return 'Preço Promocional';
  }
  if (normalized.endsWith('-image') || normalized.endsWith('-photo')) {
    const prefix = normalized.replace(/-(image|photo)$/, '');
    return `Imagem de ${getFriendlyLabel(prefix) || prefix}`;
  }
  if (normalized.endsWith('-description') || normalized.endsWith('-desc')) {
    return 'Descrição';
  }

  // Fallback: replace hyphens/underscores and capitalize words
  return key
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

// Categorize a field
export function categorizeField(key: string, type: 'text' | 'image' | 'link'): string {
  const lower = key.toLowerCase();
  
  if (
    lower.includes('logo') ||
    lower.includes('business-name') ||
    lower.includes('company') ||
    lower.includes('brand') ||
    lower.includes('avatar') ||
    lower.includes('profile')
  ) {
    return 'IDENTIDADE';
  }

  if (
    type === 'link' ||
    lower.includes('whatsapp') ||
    lower.includes('instagram') ||
    lower.includes('maps') ||
    lower.includes('phone') ||
    lower.includes('email') ||
    lower.includes('address') ||
    lower.includes('location') ||
    lower.includes('hours') ||
    lower.includes('contact') ||
    lower.includes('social')
  ) {
    return 'CONTATOS';
  }

  if (type === 'image') {
    return 'IMAGENS';
  }

  return 'TEXTOS';
}

// Helper to parse WhatsApp URL
export function parseWhatsAppUrl(href: string): { number: string; message: string } {
  let number = '';
  let message = '';

  try {
    if (!href) return { number, message };

    // Matches wa.me/55... or api.whatsapp.com/send?phone=...&text=...
    const url = new URL(href.startsWith('http') ? href : `https://${href}`);
    
    if (url.hostname.includes('wa.me')) {
      const pathParts = url.pathname.replace(/^\//, '').split('/');
      number = pathParts[0]?.replace(/\D/g, '') || '';
      const textParam = url.searchParams.get('text');
      if (textParam) message = textParam;
    } else if (url.hostname.includes('whatsapp.com')) {
      const phoneParam = url.searchParams.get('phone');
      if (phoneParam) number = phoneParam.replace(/\D/g, '');
      const textParam = url.searchParams.get('text');
      if (textParam) message = textParam;
    }
  } catch {
    // If not a valid standard URL, extract digits
    const digits = href.replace(/\D/g, '');
    if (digits.length >= 8) {
      number = digits;
    }
  }

  return { number, message };
}

// Helper to format WhatsApp URL
export function formatWhatsAppUrl(number: string, message: string): string {
  const cleanNumber = number.replace(/\D/g, '');
  if (!cleanNumber) return '#';
  
  // If user typed 10 or 11 digits without country code (Brazil standard: 34999999999), add 55
  let finalNumber = cleanNumber;
  if (finalNumber.length === 10 || finalNumber.length === 11) {
    finalNumber = '55' + finalNumber;
  }

  const encodedMsg = message.trim() ? `?text=${encodeURIComponent(message.trim())}` : '';
  return `https://wa.me/${finalNumber}${encodedMsg}`;
}

// Helper to parse Instagram
export function parseInstagramUrl(href: string): string {
  if (!href) return '';
  try {
    if (href.startsWith('@')) return href.replace('@', '').trim();
    if (href.includes('instagram.com/')) {
      const parts = href.split('instagram.com/')[1].split('/')[0].split('?')[0];
      return parts.replace('@', '').trim();
    }
    return href.replace('@', '').trim();
  } catch {
    return href;
  }
}

// Helper to format Instagram
export function formatInstagramUrl(input: string): string {
  const clean = input.replace('@', '').trim();
  if (!clean) return '#';
  if (clean.startsWith('http://') || clean.startsWith('https://')) return clean;
  return `https://instagram.com/${clean}`;
}

// Helper to format Maps
export function formatMapsUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '#';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`;
}

// Detect link type
export function detectLinkType(key: string, href: string): LinkType {
  const lowerKey = key.toLowerCase();
  const lowerHref = href.toLowerCase();

  if (lowerKey.includes('whatsapp') || lowerHref.includes('wa.me') || lowerHref.includes('whatsapp.com')) return 'whatsapp';
  if (lowerKey.includes('instagram') || lowerHref.includes('instagram.com')) return 'instagram';
  if (lowerKey.includes('map') || lowerKey.includes('location') || lowerHref.includes('google.com/maps') || lowerHref.includes('maps.app')) return 'maps';
  if (lowerKey.includes('phone') || lowerKey.includes('tel') || lowerHref.startsWith('tel:')) return 'phone';
  if (lowerKey.includes('email') || lowerKey.includes('mail') || lowerHref.startsWith('mailto:')) return 'email';
  if (lowerKey.includes('facebook') || lowerHref.includes('facebook.com')) return 'facebook';
  if (lowerKey.includes('tiktok') || lowerHref.includes('tiktok.com')) return 'tiktok';
  if (lowerKey.includes('youtube') || lowerHref.includes('youtube.com')) return 'youtube';
  if (lowerKey.includes('catalog') || lowerKey.includes('menu')) return 'catalog';
  if (lowerKey.includes('order')) return 'order';
  if (lowerKey.includes('site') || lowerKey.includes('web')) return 'website';

  return 'other';
}

// Universal parser for HTML models
export function parseModelHtml(rawHtml: string): ParsedBioModel {
  if (!rawHtml || !rawHtml.trim()) {
    throw new Error('Cole ou selecione um arquivo HTML válido.');
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, 'text/html');

  // Title of the page
  const title = doc.querySelector('title')?.textContent?.trim() || 'Meu Biosite';

  // 1. Text fields [data-bio-text]
  const textElements = Array.from(doc.querySelectorAll<HTMLElement>('[data-bio-text]'));
  const textMap = new Map<string, { el: HTMLElement; count: number }>();

  // Check if inside service/gallery container to avoid duplicate root fields
  textElements.forEach((el) => {
    const key = el.getAttribute('data-bio-text') || '';
    if (!key) return;
    
    // Check if element is inside a repeatable service or chat container
    const isInsideService = !!el.closest('[data-bio-service-item]');
    const isInsideChat = !!el.closest('[data-bio-chat]');
    if (isInsideService || isInsideChat) {
      return; // Handled in respective specialized sections
    }

    if (!textMap.has(key)) {
      textMap.set(key, { el, count: 1 });
    } else {
      textMap.get(key)!.count += 1;
    }
  });

  const textFields: BioTextField[] = Array.from(textMap.entries()).map(([key, data], index) => {
    const val = data.el.textContent || '';
    const isMultiline = val.length > 60 || val.includes('\n') || data.el.tagName === 'P' || data.el.tagName === 'ARTICLE';
    return {
      id: `text-${index}-${key}`,
      key,
      label: getFriendlyLabel(key),
      originalValue: val.trim(),
      currentValue: val.trim(),
      isMultiline,
      category: categorizeField(key, 'text'),
      occurrences: data.count,
    };
  });

  // 2. Image fields [data-bio-image]
  const imageElements = Array.from(doc.querySelectorAll<HTMLElement>('[data-bio-image]'));
  const imageMap = new Map<string, { el: HTMLElement; count: number }>();

  imageElements.forEach((el) => {
    const key = el.getAttribute('data-bio-image') || '';
    if (!key) return;
    
    const isInsideService = !!el.closest('[data-bio-service-item]');
    const isInsideGallery = !!el.closest('[data-bio-gallery]');
    if (isInsideService || isInsideGallery) {
      return;
    }

    if (!imageMap.has(key)) {
      imageMap.set(key, { el, count: 1 });
    } else {
      imageMap.get(key)!.count += 1;
    }
  });

  const imageFields: BioImageField[] = Array.from(imageMap.entries()).map(([key, data], index) => {
    let src = '';
    if (data.el instanceof HTMLImageElement) {
      src = data.el.getAttribute('src') || '';
    } else {
      src = data.el.getAttribute('src') || data.el.getAttribute('data-src') || '';
      // Check style background-image
      const style = data.el.getAttribute('style') || '';
      const bgMatch = style.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/i);
      if (bgMatch) src = bgMatch[1];
    }

    return {
      id: `image-${index}-${key}`,
      key,
      label: getFriendlyLabel(key),
      originalSrc: src,
      currentSrc: src,
      category: categorizeField(key, 'image'),
      occurrences: data.count,
    };
  });

  // 3. Link fields [data-bio-link]
  const linkElements = Array.from(doc.querySelectorAll<HTMLElement>('[data-bio-link]'));
  const linkMap = new Map<string, { el: HTMLElement; count: number }>();

  linkElements.forEach((el) => {
    const key = el.getAttribute('data-bio-link') || '';
    if (!key) return;

    const isInsideService = !!el.closest('[data-bio-service-item]');
    if (isInsideService) return;

    if (!linkMap.has(key)) {
      linkMap.set(key, { el, count: 1 });
    } else {
      linkMap.get(key)!.count += 1;
    }
  });

  const linkFields: BioLinkField[] = Array.from(linkMap.entries()).map(([key, data], index) => {
    const href = data.el.getAttribute('href') || '';
    const linkType = detectLinkType(key, href);

    let whatsappNumber = '';
    let whatsappMessage = '';
    let instagramUsername = '';
    let mapsAddress = '';

    if (linkType === 'whatsapp') {
      const parsed = parseWhatsAppUrl(href);
      whatsappNumber = parsed.number;
      whatsappMessage = parsed.message;
    } else if (linkType === 'instagram') {
      instagramUsername = parseInstagramUrl(href);
    } else if (linkType === 'maps') {
      mapsAddress = href;
    }

    return {
      id: `link-${index}-${key}`,
      key,
      label: getFriendlyLabel(key),
      originalHref: href,
      currentHref: href,
      linkType,
      category: 'CONTATOS',
      occurrences: data.count,
      whatsappNumber,
      whatsappMessage,
      instagramUsername,
      mapsAddress,
    };
  });

  // 4. Services / Products [data-bio-services] & [data-bio-service-item]
  const serviceContainers = Array.from(doc.querySelectorAll<HTMLElement>('[data-bio-services]'));
  const serviceGroups: BioServiceGroup[] = [];

  serviceContainers.forEach((container, groupIndex) => {
    const groupKey = container.getAttribute('data-bio-services') || `services-${groupIndex}`;
    const itemElements = Array.from(container.querySelectorAll<HTMLElement>('[data-bio-service-item]'));

    // Determine category: services, menu, or portfolio
    let category: 'services' | 'menu' | 'portfolio' = 'services';
    const lowerKey = groupKey.toLowerCase();
    if (lowerKey.includes('cardapio') || lowerKey.includes('menu') || lowerKey.includes('pratos') || lowerKey.includes('lanches')) {
      category = 'menu';
    } else if (lowerKey.includes('portfolio') || lowerKey.includes('projetos') || lowerKey.includes('trabalhos')) {
      category = 'portfolio';
    }

    const items: BioServiceItem[] = itemElements.map((itemEl, itemIdx) => {
      // Find sub-fields in this item
      const subFields: BioServiceSubField[] = [];

      // Text sub-fields
      itemEl.querySelectorAll<HTMLElement>('[data-bio-text]').forEach((subText) => {
        const subKey = subText.getAttribute('data-bio-text') || '';
        const val = subText.textContent?.trim() || '';
        subFields.push({
          type: 'text',
          key: subKey,
          label: getFriendlyLabel(subKey),
          value: val,
          originalValue: val,
        });
      });

      // Image sub-fields
      itemEl.querySelectorAll<HTMLElement>('[data-bio-image]').forEach((subImg) => {
        const subKey = subImg.getAttribute('data-bio-image') || '';
        const src = subImg.getAttribute('src') || '';
        subFields.push({
          type: 'image',
          key: subKey,
          label: getFriendlyLabel(subKey),
          value: src,
          originalValue: src,
        });
      });

      // Link sub-fields
      itemEl.querySelectorAll<HTMLElement>('[data-bio-link]').forEach((subLink) => {
        const subKey = subLink.getAttribute('data-bio-link') || '';
        const href = subLink.getAttribute('href') || '';
        subFields.push({
          type: 'link',
          key: subKey,
          label: getFriendlyLabel(subKey),
          value: href,
          originalValue: href,
        });
      });

      // Derive title of the item
      const nameField = subFields.find((f) => f.key.includes('name') || f.key.includes('title'));
      const title = nameField?.value || `Item ${itemIdx + 1}`;

      return {
        id: `service-item-${groupIndex}-${itemIdx}`,
        index: itemIdx,
        title,
        fields: subFields,
      };
    });

    serviceGroups.push({
      id: `service-group-${groupIndex}`,
      containerSelector: `[data-bio-services="${groupKey}"]`,
      title: getFriendlyLabel(groupKey),
      category,
      items,
    });
  });

  // 5. Gallery [data-bio-gallery]
  const galleryContainers = Array.from(doc.querySelectorAll<HTMLElement>('[data-bio-gallery]'));
  const galleryGroups: BioGalleryGroup[] = [];

  galleryContainers.forEach((container, groupIndex) => {
    const galleryKey = container.getAttribute('data-bio-gallery') || `gallery-${groupIndex}`;
    
    // Find images or items inside gallery
    const imgElements = Array.from(container.querySelectorAll<HTMLImageElement>('img'));
    const items: BioGalleryItem[] = imgElements.map((imgEl, imgIdx) => {
      const src = imgEl.getAttribute('src') || '';
      const imageKey = imgEl.getAttribute('data-bio-image') || `gallery-img-${imgIdx}`;
      return {
        id: `gallery-item-${groupIndex}-${imgIdx}`,
        index: imgIdx,
        imageKey,
        src,
        originalSrc: src,
      };
    });

    galleryGroups.push({
      id: `gallery-group-${groupIndex}`,
      containerSelector: `[data-bio-gallery="${galleryKey}"]`,
      title: getFriendlyLabel(galleryKey) || 'Galeria de Fotos',
      items,
    });
  });

  // 6. Chatbot [data-bio-chat]
  const chatContainers = Array.from(doc.querySelectorAll<HTMLElement>('[data-bio-chat]'));
  const chatMessages: BioChatMessage[] = [];

  chatContainers.forEach((chatEl, chatIndex) => {
    // Look for chat items
    const msgEls = Array.from(chatEl.querySelectorAll<HTMLElement>('[data-bio-chat-message], [data-bio-chat-question], [data-bio-chat-option], [data-bio-chat-input]'));
    
    msgEls.forEach((el, msgIndex) => {
      let type: 'message' | 'question' | 'input' | 'option' = 'message';
      let key = '';

      if (el.hasAttribute('data-bio-chat-message')) {
        type = 'message';
        key = el.getAttribute('data-bio-chat-message') || `msg-${msgIndex}`;
      } else if (el.hasAttribute('data-bio-chat-question')) {
        type = 'question';
        key = el.getAttribute('data-bio-chat-question') || `question-${msgIndex}`;
      } else if (el.hasAttribute('data-bio-chat-option')) {
        type = 'option';
        key = el.getAttribute('data-bio-chat-option') || `option-${msgIndex}`;
      } else if (el.hasAttribute('data-bio-chat-input')) {
        type = 'input';
        key = el.getAttribute('data-bio-chat-input') || `input-${msgIndex}`;
      }

      const text = el.textContent?.trim() || '';
      chatMessages.push({
        id: `chat-${chatIndex}-${msgIndex}`,
        type,
        key,
        label: getFriendlyLabel(key),
        text,
        originalText: text,
      });
    });
  });

  const totalFieldsFound =
    textFields.length +
    imageFields.length +
    linkFields.length +
    serviceGroups.reduce((acc, g) => acc + g.items.length, 0) +
    galleryGroups.reduce((acc, g) => acc + g.items.length, 0) +
    chatMessages.length;

  return {
    rawHtml,
    title,
    textFields,
    imageFields,
    linkFields,
    serviceGroups,
    galleryGroups,
    chatMessages,
    totalFieldsFound,
  };
}
