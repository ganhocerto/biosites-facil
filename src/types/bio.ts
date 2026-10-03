export type FieldType = 'text' | 'image' | 'link' | 'service' | 'gallery' | 'chat';

export interface BioTextField {
  id: string;
  key: string;
  label: string;
  originalValue: string;
  currentValue: string;
  isMultiline: boolean;
  category: string;
  occurrences: number;
}

export interface BioImageField {
  id: string;
  key: string;
  label: string;
  originalSrc: string;
  currentSrc: string;
  category: string;
  occurrences: number;
  isBase64?: boolean;
}

export type LinkType = 'whatsapp' | 'instagram' | 'maps' | 'phone' | 'email' | 'facebook' | 'tiktok' | 'youtube' | 'website' | 'catalog' | 'order' | 'other';

export interface BioLinkField {
  id: string;
  key: string;
  label: string;
  originalHref: string;
  currentHref: string;
  linkType: LinkType;
  category: string;
  occurrences: number;
  // Specific parsed fields
  whatsappNumber?: string;
  whatsappMessage?: string;
  instagramUsername?: string;
  mapsAddress?: string;
}

export interface BioServiceSubField {
  type: 'text' | 'image' | 'link';
  key: string;
  label: string;
  value: string;
  originalValue: string;
}

export interface BioServiceItem {
  id: string;
  index: number;
  title: string;
  fields: BioServiceSubField[];
}

export interface BioServiceGroup {
  id: string;
  containerSelector: string;
  title: string;
  category: 'services' | 'menu' | 'portfolio';
  items: BioServiceItem[];
}

export interface BioGalleryItem {
  id: string;
  index: number;
  imageKey?: string;
  src: string;
  originalSrc: string;
}

export interface BioGalleryGroup {
  id: string;
  containerSelector: string;
  title: string;
  items: BioGalleryItem[];
}

export interface BioChatOption {
  text: string;
  targetFlow?: string;
}

export interface BioChatMessage {
  id: string;
  type: 'message' | 'question' | 'input' | 'option';
  key: string;
  label: string;
  text: string;
  originalText: string;
  options?: BioChatOption[];
}

export interface ParsedBioModel {
  rawHtml: string;
  title: string;
  textFields: BioTextField[];
  imageFields: BioImageField[];
  linkFields: BioLinkField[];
  serviceGroups: BioServiceGroup[];
  galleryGroups: BioGalleryGroup[];
  chatMessages: BioChatMessage[];
  totalFieldsFound: number;
}

export interface EditorHistoryStep {
  textValues: Record<string, string>;
  imageValues: Record<string, string>;
  linkValues: Record<string, string>;
  htmlSnapshot?: string;
}

export type DevicePreviewMode = 'mobile' | 'tablet' | 'desktop';
