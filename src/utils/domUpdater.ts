/**
 * DOM Updater utilities for BIO FÁCIL
 * Directly alters iframe document elements without reloading or resetting iframe.
 */

// Update all text elements matching data-bio-text=key
export function updatePreviewText(doc: Document | null, key: string, newText: string): number {
  if (!doc) return 0;
  const elements = doc.querySelectorAll<HTMLElement>(`[data-bio-text="${key}"]`);
  elements.forEach((el) => {
    el.textContent = newText;
  });
  return elements.length;
}

// Update all image elements matching data-bio-image=key
export function updatePreviewImage(doc: Document | null, key: string, newSrc: string): number {
  if (!doc) return 0;
  const elements = doc.querySelectorAll<HTMLElement>(`[data-bio-image="${key}"]`);
  elements.forEach((el) => {
    if (el instanceof HTMLImageElement) {
      el.src = newSrc;
    } else {
      // Could be background image or div
      el.style.backgroundImage = `url("${newSrc}")`;
    }
  });
  return elements.length;
}

// Update all link elements matching data-bio-link=key
export function updatePreviewLink(doc: Document | null, key: string, newHref: string): number {
  if (!doc) return 0;
  const elements = doc.querySelectorAll<HTMLElement>(`[data-bio-link="${key}"]`);
  elements.forEach((el) => {
    if (el instanceof HTMLAnchorElement) {
      el.href = newHref;
    } else {
      el.setAttribute('href', newHref);
    }
  });
  return elements.length;
}

// Duplicate a service item in container
export function duplicateServiceItemInDoc(
  doc: Document | null,
  containerSelector: string,
  itemIndex: number
): boolean {
  if (!doc) return false;
  const container = doc.querySelector<HTMLElement>(containerSelector);
  if (!container) return false;

  const items = container.querySelectorAll<HTMLElement>('[data-bio-service-item]');
  const target = items[itemIndex];
  if (!target) return false;

  const clone = target.cloneNode(true) as HTMLElement;
  const uniqueSuffix = `copy-${Date.now().toString().slice(-4)}`;

  // Update inner data-bio-* keys in the clone to prevent key clashes
  clone.querySelectorAll<HTMLElement>('[data-bio-text]').forEach((el) => {
    const prev = el.getAttribute('data-bio-text');
    if (prev) el.setAttribute('data-bio-text', `${prev}-${uniqueSuffix}`);
  });
  clone.querySelectorAll<HTMLElement>('[data-bio-image]').forEach((el) => {
    const prev = el.getAttribute('data-bio-image');
    if (prev) el.setAttribute('data-bio-image', `${prev}-${uniqueSuffix}`);
  });
  clone.querySelectorAll<HTMLElement>('[data-bio-link]').forEach((el) => {
    const prev = el.getAttribute('data-bio-link');
    if (prev) el.setAttribute('data-bio-link', `${prev}-${uniqueSuffix}`);
  });

  // Insert right after the original target
  if (target.nextSibling) {
    container.insertBefore(clone, target.nextSibling);
  } else {
    container.appendChild(clone);
  }

  return true;
}

// Delete a service item in container
export function deleteServiceItemInDoc(
  doc: Document | null,
  containerSelector: string,
  itemIndex: number
): boolean {
  if (!doc) return false;
  const container = doc.querySelector<HTMLElement>(containerSelector);
  if (!container) return false;

  const items = container.querySelectorAll<HTMLElement>('[data-bio-service-item]');
  const target = items[itemIndex];
  if (!target) return false;

  target.remove();
  return true;
}

// Move a service item up or down
export function moveServiceItemInDoc(
  doc: Document | null,
  containerSelector: string,
  itemIndex: number,
  direction: 'up' | 'down'
): boolean {
  if (!doc) return false;
  const container = doc.querySelector<HTMLElement>(containerSelector);
  if (!container) return false;

  const items = Array.from(container.querySelectorAll<HTMLElement>('[data-bio-service-item]'));
  const target = items[itemIndex];
  if (!target) return false;

  if (direction === 'up' && itemIndex > 0) {
    const prev = items[itemIndex - 1];
    container.insertBefore(target, prev);
    return true;
  } else if (direction === 'down' && itemIndex < items.length - 1) {
    const next = items[itemIndex + 1];
    if (next.nextSibling) {
      container.insertBefore(target, next.nextSibling);
    } else {
      container.appendChild(target);
    }
    return true;
  }

  return false;
}

// Duplicate a gallery item in container
export function duplicateGalleryItemInDoc(
  doc: Document | null,
  containerSelector: string,
  itemIndex: number
): boolean {
  if (!doc) return false;
  const container = doc.querySelector<HTMLElement>(containerSelector);
  if (!container) return false;

  // Items might be img elements or wrapping div/figure elements
  let items = Array.from(container.children) as HTMLElement[];
  if (items.length === 0) {
    items = Array.from(container.querySelectorAll<HTMLElement>('img'));
  }
  const target = items[itemIndex];
  if (!target) return false;

  const clone = target.cloneNode(true) as HTMLElement;
  const uniqueSuffix = `copy-${Date.now().toString().slice(-4)}`;

  // Find image in clone
  const imgEl = clone.tagName === 'IMG' ? clone : clone.querySelector<HTMLImageElement>('img');
  if (imgEl) {
    const prev = imgEl.getAttribute('data-bio-image');
    if (prev) imgEl.setAttribute('data-bio-image', `${prev}-${uniqueSuffix}`);
  }

  if (target.nextSibling) {
    container.insertBefore(clone, target.nextSibling);
  } else {
    container.appendChild(clone);
  }

  return true;
}

// Delete gallery item
export function deleteGalleryItemInDoc(
  doc: Document | null,
  containerSelector: string,
  itemIndex: number
): boolean {
  if (!doc) return false;
  const container = doc.querySelector<HTMLElement>(containerSelector);
  if (!container) return false;

  let items = Array.from(container.children) as HTMLElement[];
  if (items.length === 0) {
    items = Array.from(container.querySelectorAll<HTMLElement>('img'));
  }
  const target = items[itemIndex];
  if (!target) return false;

  target.remove();
  return true;
}

// Serialize the current iframe DOM to pure standalone HTML
export function serializeDocToHtml(doc: Document | null): string {
  if (!doc) return '';

  let doctype = '<!DOCTYPE html>\n';
  if (doc.doctype) {
    doctype = `<!DOCTYPE ${doc.doctype.name}${
      doc.doctype.publicId ? ` PUBLIC "${doc.doctype.publicId}"` : ''
    }${
      !doc.doctype.publicId && doc.doctype.systemId ? ' SYSTEM' : ''
    }${
      doc.doctype.systemId ? ` "${doc.doctype.systemId}"` : ''
    }>\n`;
  }

  const htmlContent = doc.documentElement.outerHTML;
  return doctype + htmlContent;
}

// Convert uploaded file to Base64 Data URL
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Falha ao ler imagem em Base64.'));
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
