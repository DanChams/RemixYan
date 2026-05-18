/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ProjectStatus = 'Planifié' | 'En cours' | 'Revu' | 'Terminé' | 'Archivé';

export interface Project {
  id: string;
  title: string;
  category: string;
  status: ProjectStatus;
  description: string;
  imageUrl?: string;
  threeDUrl?: string; // URL for 3D preview (Sketchfab, etc.)
  pdfUrl?: string; // URL for PDF/InDesign preview
  details: {
    client: string;
    date: string;
    role: string;
  };
}
