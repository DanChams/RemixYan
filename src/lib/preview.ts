/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Prépare un lien pour l'affichage en iframe (PDF, InDesign, Drive)
 */
export function getPreviewLink(url: string | undefined): string {
  if (!url) return '';
  
  // Adobe InDesign Publish Online
  if (url.includes('indd.adobe.com')) {
    // Si c'est un lien direct (/view/), on le transforme en /embed/ pour l'iframe
    if (url.includes('/view/')) {
      return url.replace('/view/', '/embed/');
    }
    return url;
  }

  // Google Drive
  const fileIdPattern = /(?:\/d\/|id=)([a-zA-Z0-9_-]{25,})/;
  const match = url.match(fileIdPattern);
  const fileId = match ? match[1] : null;
  
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  
  return url;
}

/**
 * Transforme un lien en lien direct (pour <img> ou <model-viewer>)
 */
export function getDirectLink(url: string | undefined): string {
  if (!url) return '';
  
  const fileIdPattern = /(?:\/d\/|id=)([a-zA-Z0-9_-]{25,})/;
  const match = url.match(fileIdPattern);
  const fileId = match ? match[1] : null;

  if (fileId) {
    const isImage = url.match(/\.(jpg|jpeg|png|webp|gif|svg)/i);
    if (isImage) {
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    }
    return `https://docs.google.com/uc?export=download&id=${fileId}`;
  }
  
  return url;
}
