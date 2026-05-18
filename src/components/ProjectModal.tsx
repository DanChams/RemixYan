/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Box, FileText, Maximize2, Minimize2 } from 'lucide-react';
import { Project } from '../types.ts';
import { getDirectLink, getPreviewLink } from '../lib/preview.ts';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!project) return null;

  const isSketchfab = project.threeDUrl?.includes('sketchfab.com');
  const isDirect3D = project.threeDUrl?.match(/\.(glb|gltf)/i) || project.threeDUrl?.includes('drive.google.com');
  const hasPDF = !!project.pdfUrl;

  const CustomModelViewer = 'model-viewer' as any;

  return (
    <AnimatePresence>
      <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ${isFullscreen ? 'p-0' : 'p-4 md:p-10'}`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-brand-dark/95 backdrop-blur-md"
        />
        
        <motion.div
          layoutId={`project-${project.id}`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`relative transition-all duration-500 bg-white shadow-2xl overflow-hidden ${
            isFullscreen 
              ? 'fixed inset-[0.5%] z-[100] max-w-none max-h-none rounded-2xl ring-1 ring-white/10' 
              : 'w-full max-w-6xl rounded-3xl h-[85vh] flex'
          }`}
        >
          <button
            onClick={isFullscreen ? () => setIsFullscreen(false) : onClose}
            className="absolute top-6 right-6 z-[110] p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full transition-colors text-white"
          >
            <X size={20} />
          </button>

          {/* Image, 3D or PDF Section */}
          <div className="w-full h-full bg-gray-50 relative overflow-hidden flex flex-col">
            {hasPDF ? (
              <div className="flex-1">
                <iframe
                  src={getPreviewLink(project.pdfUrl)}
                  className="w-full h-full border-0"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              </div>
            ) : isSketchfab ? (
              <div className="flex-1">
                <iframe
                  title="3D Viewer"
                  src={project.threeDUrl}
                  className="w-full h-full border-0"
                  allowFullScreen
                  allow="autoplay; fullscreen; xr-spatial-tracking"
                />
              </div>
            ) : isDirect3D ? (
              <div className="flex-1 bg-brand-cyan/20">
                <CustomModelViewer
                  src={getDirectLink(project.threeDUrl)}
                  auto-rotate
                  camera-controls
                  shadow-intensity="1"
                  style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
                  alt="A 3D model of a project"
                ></CustomModelViewer>
              </div>
            ) : (
              <img
                src={getDirectLink(project.imageUrl)}
                alt={project.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            )}
            
            {project.threeDUrl && !hasPDF && (
              <div className="absolute bottom-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-lg text-white text-[10px] font-bold tracking-widest uppercase">
                <Box size={14} />
                Aperçu 3D interactif
              </div>
            )}
            {hasPDF && !isFullscreen && (
              <div className="absolute bottom-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-brand-dark/80 backdrop-blur-md rounded-lg text-white text-[10px] font-bold tracking-widest uppercase border border-white/20 z-10">
                <FileText size={14} />
                Aperçu InDesign PDF
              </div>
            )}

            {hasPDF && (
              <button 
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="absolute top-6 right-20 z-[110] p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full transition-colors text-white"
                title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
              >
                {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
