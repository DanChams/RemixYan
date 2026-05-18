/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings } from 'lucide-react';
import Navbar from './components/Navbar.tsx';
import ProjectCard from './components/ProjectCard.tsx';
import ProjectModal from './components/ProjectModal.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import { PROJECTS as STATIC_PROJECTS } from './data.ts';
import { subscribeToProjects } from './lib/supabase.ts';
import { Project } from './types.ts';

export default function App() {
  const [projects, setProjects] = useState<Project[]>(STATIC_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Tous');
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    // Synchronisation en temps réel avec Supabase
    const unsubscribe = subscribeToProjects((data) => {
      setProjects(data);
    });
    return () => unsubscribe();
  }, []);

  const categories = ['Tous', ...new Set(projects.map(p => p.category))];

  const filteredProjects = activeCategory === 'Tous' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen pt-20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden flex items-center">
        <div className="absolute inset-0">
          <img 
            src="/images/cosmetics_hero_yanone_1779020159754.png" 
            className="w-full h-full object-cover"
            alt="Hero Background"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full" />
      </section>

      {/* Projects Grid Container */}
      <main className="max-w-7xl mx-auto px-6 py-24">
        {/* Filter Controls */}
        <div className="mb-16">
          <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-[#f2c391] text-brand-dark shadow-lg shadow-[#f2c391]/20'
                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-brand-dark'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 md:gap-12"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-gray-400 font-light italic">Aucun projet trouvé dans cette catégorie.</p>
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="bg-gray-50 py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-full flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-semibold mb-4 leading-none">Projet Conception</h2>
            <p className="text-gray-400 font-light max-w-sm">
              Portfolio de design et packaging interactif. Créativité sans limites, exécution sans failles.
            </p>
          </div>
          
          <div className="flex gap-12">
            <div>
              <h4 className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-6">Contact</h4>
              <p className="text-brand-dark font-medium cursor-pointer hover:text-[#c88d4d] transition-colors">contact@projet-conception.com</p>
            </div>
            <div className="hidden sm:block w-[1px] h-12 bg-gray-200 self-end" />
            <div className="flex flex-col items-center md:items-start">
              <h4 className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-6">Suivez-nous</h4>
              <button 
                onClick={() => setShowAdmin(true)}
                className="flex items-center gap-2 text-gray-300 hover:text-brand-dark transition-colors mt-auto"
              >
                <Settings size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Administration</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Admin Dashboard Overlay */}
      {showAdmin && <AdminDashboard onClose={() => setShowAdmin(false)} />}

      {/* Modal View */}
      <ProjectModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </div>
  );
}

