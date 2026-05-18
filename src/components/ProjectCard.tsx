/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Box, FileText } from 'lucide-react';
import { Project } from '../types.ts';
import { getDirectLink, getPreviewLink } from '../lib/preview.ts';
import StatusBadge from './StatusBadge.tsx';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  key?: string | number;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <motion.div
      layoutId={`project-${project.id}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="group cursor-pointer bg-white overflow-hidden rounded-2xl border border-gray-100 transition-all hover:shadow-2xl hover:shadow-brand-beige/10"
    >
      <div className="aspect-[4/3] overflow-hidden relative bg-gray-50">
        {project.pdfUrl && !project.imageUrl ? (
          <div className="w-full h-full overflow-hidden pointer-events-none">
            <iframe
              src={getPreviewLink(project.pdfUrl)}
              className="border-0"
              style={{ width: '200%', height: '200%', transform: 'scale(0.5)', transformOrigin: 'top left' }}
              scrolling="no"
              title={project.title}
            />
          </div>
        ) : (
          <img
            src={getDirectLink(project.imageUrl)}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        )}
        
        {project.threeDUrl && (
          <div className="absolute top-4 right-4 z-10 px-2 py-1 bg-white/80 backdrop-blur-sm rounded-md shadow-sm flex items-center gap-1.5 border border-white/50">
            <Box size={14} className="text-brand-dark" />
            <span className="text-[10px] font-bold tracking-wider text-brand-dark uppercase">3D</span>
          </div>
        )}

        {project.pdfUrl && (
          <div className={`absolute top-4 ${project.threeDUrl ? 'right-16' : 'right-4'} z-10 px-2 py-1 bg-white/80 backdrop-blur-sm rounded-md shadow-sm flex items-center gap-1.5 border border-white/50`}>
            <FileText size={14} className="text-brand-dark" />
            <span className="text-[10px] font-bold tracking-wider text-brand-dark uppercase">PDF</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
           <span className="text-white text-sm font-medium tracking-wide">Voir les détails</span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#c88d4d] opacity-70">
            {project.category}
          </span>
          <StatusBadge status={project.status} />
        </div>
        <h3 className="text-xl font-medium text-brand-dark group-hover:text-[#c88d4d] transition-colors">
          {project.title}
        </h3>
        <p className="mt-2 text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {project.description}
        </p>
      </div>
    </motion.div>
  );
}
